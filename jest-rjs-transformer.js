/**
 * Jest transformer for .rjs files
 * Transforms .rjs files (which use Render({...}) pattern) into ES modules
 * that can be used with 'new Render(this)' in the component code
 *
 * Pattern: export default Render({ ... })
 * Converts to: A class that can be instantiated with 'new'
 */

const babel = require('@babel/core');

module.exports = {
  process(sourceText, sourcePath, options) {
    let code = sourceText.trim();

    // Simple transformation: wrap Render({...}) in a class
    // We'll use a function that returns a class instance
    if (code.includes('export default Render(')) {
      // Extract everything after 'Render(' and before the final '});'
      const renderStart = code.indexOf('Render(');
      const renderContentStart = code.indexOf('{', renderStart);
      const renderEnd = code.lastIndexOf('});');

      if (renderContentStart !== -1 && renderEnd !== -1) {
        // Get the object content
        const objectContent = code.substring(renderContentStart + 1, renderEnd);

        // Create a class that contains all the properties and methods
        // We'll use a simpler approach: create a function that returns an object
        // with all the methods bound properly

        // Use eval-safe approach: wrap the object literal in a function
        // This preserves all the original code structure
        const transformedCode = `
// Transformed from .rjs file
class RenderInstance {
  constructor(instance) {
    // Merge instance if provided
    if (instance) {
      Object.assign(this, instance);
    }
    
    // Initialize from object literal using eval to preserve structure
    const obj = (function() {
      return {${objectContent}};
    })();
    
    // Copy all properties and methods
    Object.keys(obj).forEach(key => {
      this[key] = obj[key];
    });
    
    // Bind methods to this
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (typeof this[key] === 'function') {
        this[key] = this[key].bind(this);
      }
    });
  }
}

// Export as constructor function
export default function Render(instance) {
  return new RenderInstance(instance);
}

export { RenderInstance };
`;

        code = transformedCode;
      }
    }

    // Use babel to transform ES6+ syntax to CommonJS
    const babelOptions = {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            targets: { node: 'current' },
          },
        ],
      ],
      filename: sourcePath,
      sourceMaps: options.instrument ? 'inline' : false,
    };

    try {
      const result = babel.transformSync(code, babelOptions);
      return {
        code: result.code || code,
        map: result.map,
      };
    } catch (error) {
      // If babel transformation fails, use fallback
      console.warn(`Babel transformation failed for ${sourcePath}:`, error.message);

      // Fallback: create a simple wrapper that uses the global Render function
      const fallbackCode = `
const Render = global.Render || function(obj) {
  const instance = Object.assign({}, obj);
  // Bind methods
  Object.keys(instance).forEach(key => {
    if (typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
  return instance;
};

module.exports = Render;
module.exports.default = Render;
`;

      return {
        code: fallbackCode,
        map: null,
      };
    }
  },
};
