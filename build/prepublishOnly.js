const getCSSVar = require('./transCSSVar');
const generateIndexJson = require('./imgJSON');
function main() {
  try {
    getCSSVar();
    generateIndexJson();
  } catch (error) {
    console.log(error, '---err');
  }
}

main();
