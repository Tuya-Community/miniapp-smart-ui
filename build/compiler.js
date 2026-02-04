const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const less = require('gulp-less');
const insert = require('gulp-insert');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const ts = require('gulp-typescript');
const util = require('util');
const merge2 = require('merge2');
const exec = util.promisify(require('child_process').exec);

const src = path.resolve(__dirname, '../packages');

const libConfig = path.resolve(__dirname, '../tsconfig.lib.json');
const esConfig = path.resolve(__dirname, '../tsconfig.json');
const exampleConfig = path.resolve(__dirname, '../tsconfig.example.json');

const libDir = path.resolve(__dirname, '../lib');
const esDir = path.resolve(__dirname, '../dist');
const exampleDistDir = path.resolve(__dirname, '../example/dist');
const examplePagesDir = path.resolve(__dirname, '../example/pages');

const exampleAppJsonPath = path.resolve(__dirname, '../example/app.json');
const baseWxssPath = path.resolve(__dirname, '../packages/common/index.wxss');
const baseCssPath = path.resolve(__dirname, '../packages/common/index.css');
const blockChangelogPath = path.resolve(__dirname, '../BLOCK_CHANGELOG.md');
const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');
const docsDir = path.resolve(__dirname, '../docs');

const lessCompiler2Wxss = dist =>
  function compileLess() {
    const srcPath = [`${src}/**/*.less`];
    if ([esDir, libDir].indexOf(dist) !== -1) {
      srcPath.push(`!${src}/**/demo/**/*.less`);
    }
    return gulp
      .src(srcPath)
      .pipe(less())
      .pipe(postcss())
      .pipe(
        insert.transform((contents, file) => {
          if (!file.path.includes('packages' + path.sep + 'common')) {
            const relativePath = path
              .relative(path.normalize(`${file.path}${path.sep}..`), baseWxssPath)
              .replace(/\\/g, '/');
            contents = `@import '${relativePath}';${contents}`;
          }
          return contents;
        })
      )
      .pipe(rename({ extname: '.wxss' }))
      .pipe(gulp.dest(dist));
  };

const lessCompiler2Css = dist =>
  function compileLess() {
    const srcPath = [`${src}/**/*.less`];
    if ([esDir, libDir].indexOf(dist) !== -1) {
      srcPath.push(`!${src}/**/demo/**/*.less`);
    }
    return gulp
      .src(srcPath)
      .pipe(less())
      .pipe(postcss())
      .pipe(
        insert.transform((contents, file) => {
          if (!file.path.includes('packages' + path.sep + 'common')) {
            const relativePath = path
              .relative(path.normalize(`${file.path}${path.sep}..`), baseCssPath)
              .replace(/\\/g, '/');
            contents = `@import '${relativePath}';${contents}`;
          }
          return contents;
        })
      )
      .pipe(gulp.dest(dist));
  };

const tsCompiler = (dist, config) =>
  function compileTs() {
    const tsProject = ts.createProject(config, {
      declaration: true,
    });
    const tsResult = tsProject.src().pipe(tsProject());

    return merge2(tsResult.js.pipe(gulp.dest(dist)), tsResult.dts.pipe(gulp.dest(dist)));
  };

const copier = (dist, ext) =>
  function copy() {
    const srcPath = [`${src}/**/*.${ext}`];
    if ([esDir, libDir].indexOf(dist) !== -1) {
      srcPath.push(`!${src}/**/demo/**/*.${ext}`);
    }
    return gulp
      .src(srcPath)
      .pipe(
        insert.transform((contents, file) => {
          if (ext === 'json' && file.path.includes(`${path.sep}demo${path.sep}`)) {
            contents = contents.replace('/example', '');
          }
          return contents;
        })
      )
      .pipe(gulp.dest(dist));
  };

const staticCopier = dist =>
  gulp.parallel(
    copier(dist, 'wxml'),
    copier(dist, 'wxs'),
    copier(dist, 'json'),
    copier(dist, 'tyml'),
    copier(dist, 'tyss'),
    copier(dist, 'rjs')
  );

const cleaner = path =>
  function clean() {
    return exec(`npx rimraf ${path}`);
  };

const copyChangelog = () =>
  function copyChangelog() {
    if (!process.env.PIPELINE_DATA) return;
    gulp.src(blockChangelogPath).pipe(gulp.dest(docsDir));
    gulp.src(changelogPath).pipe(gulp.dest(docsDir));
  };

const tasks = [
  ['buildEs', esDir, esConfig],
  ['buildLib', libDir, libConfig],
].reduce((prev, [name, ...args]) => {
  prev[name] = gulp.series(
    cleaner(...args),
    gulp.parallel(
      tsCompiler(...args),
      lessCompiler2Wxss(...args),
      lessCompiler2Css(...args),
      staticCopier(...args),
      copyChangelog()
    )
  );
  return prev;
}, {});

const isBuild = process.env.MODE === 'build';

if (isBuild) {
  tasks.buildExample = gulp.series(
    cleaner(exampleDistDir),
    gulp.parallel(
      tsCompiler(exampleDistDir, exampleConfig),
      lessCompiler2Wxss(exampleDistDir),
      lessCompiler2Css(exampleDistDir),
      staticCopier(exampleDistDir),
      copyChangelog()
    )
  );
} else {
  tasks.buildExample = gulp.series(
    cleaner(exampleDistDir),
    gulp.parallel(
      tsCompiler(exampleDistDir, exampleConfig),
      lessCompiler2Wxss(exampleDistDir),
      lessCompiler2Css(exampleDistDir),
      staticCopier(exampleDistDir),
      copyChangelog(),
      () => {
        const appJson = JSON.parse(fs.readFileSync(exampleAppJsonPath));
        const excludePages = ['pages/dashboard/index'];
        appJson.pages
          .filter(page => page.indexOf(excludePages) === -1)
          .forEach(path => {
            const component = path.replace(/(pages\/|\/index)/g, '');
            const writeFiles = [
              {
                path: `${examplePagesDir}/${component}/index.js`,
                contents: "import Page from '../../common/page';\n\nPage();",
              },
              {
                path: `${examplePagesDir}/${component}/index.wxml`,
                contents: `<smart-${component}-demo />`,
              },
            ];
            writeFiles.forEach(writeFile => {
              fs.access(writeFile.path, fs.constants.F_OK, fileNotExists => {
                if (fileNotExists) {
                  fs.writeFile(writeFile.path, writeFile.contents, err => {
                    if (err) {
                      throw err;
                    }
                  });
                }
              });
            });
          });
      },
      () => {
        gulp.watch(`${src}/**/*.less`, lessCompiler2Wxss(exampleDistDir));
        gulp.watch(`${src}/**/*.less`, lessCompiler2Css(exampleDistDir));
        gulp.watch(`${src}/**/*.wxml`, copier(exampleDistDir, 'wxml'));
        gulp.watch(`${src}/**/*.tyml`, copier(exampleDistDir, 'tyml'));
        gulp.watch(`${src}/**/*.rjs`, copier(exampleDistDir, 'rjs'));
        gulp.watch(`${src}/**/*.tyss`, copier(exampleDistDir, 'tyss'));
        gulp.watch(`${src}/**/*.wxs`, copier(exampleDistDir, 'wxs'));
        gulp.watch(`${src}/**/*.ts`, tsCompiler(exampleDistDir, exampleConfig));
        gulp.watch(`${src}/**/*.json`, copier(exampleDistDir, 'json'));
      }
    )
  );
}

module.exports = tasks;
