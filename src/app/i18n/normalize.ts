import { supportedLanguages } from './supported-languages';

const sortJson = require('sort-json');
const path = require('path');
const fs = require('fs');
const jsonFormat = require('json-format');
const endOfLine = require('os').EOL;

const languages = supportedLanguages.languages.map(l => {
  const filePath = path.join(__dirname, l.id + '.json');
  return {
    path: filePath,
    value: require(filePath),
  };
});

languages.forEach(language => {
  language.value = sortJson(language.value, { ignoreCase: true, depth: 3 });
  fs.writeFileSync(language.path, jsonFormat(language.value) + endOfLine);
});
