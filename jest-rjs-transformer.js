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
        
        const transformedCode = `
// Transformed from .rjs file
class RenderInstance {
  constructor(instance) {
    // Merge instance if provided
    if (instance) {
      Object.assign(this, instance);
    }
    
    // Initialize from object literal
    const obj = {${objectContent}};
    Object.assign(this, obj);
    
    // Bind methods to this
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (typeof obj[key] === 'function') {
        this[key] = obj[key].bind(this);
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
        ['@babel/preset-env', { 
          modules: 'commonjs',
          targets: { node: 'current' }
        }],
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
      
      // Fallback: create a simple wrapper
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
