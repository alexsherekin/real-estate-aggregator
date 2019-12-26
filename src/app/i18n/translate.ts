import { supportedLanguages } from './supported-languages';

const awaiter = setInterval(() => {
  console.log(`Waiting...`);
}, 1000);


const diff = require('keys-diff');
const fs = require('fs');
const path = require('path');
const jsonFormat = require('json-format');
const deeplClient = require('deepl-client');

const params = {
  auth_key: '5d0fa266-d272-0436-34a3-78b6e6b8ff16',
  text: '',
  target_lang: undefined,
};

const languages = supportedLanguages.languages.map(l => {
  const filePath = path.join(__dirname, l.id + '.json');
  return {
    default: l.default,
    key: l.label,
    languageKey: l.id.toUpperCase(),
    path: filePath,
    value: require(filePath),
  };
});

let diffExists = false;

const mainTranslation = languages.find(lang => lang.default);
if (!mainTranslation) {
  throw new Error('Invalid translation configuration. No default language');
}
const others = languages.filter(lang => !lang.default);

const allTranslationPromise = others.reduce((bigAccPromise, otherTranslation) => {
  return bigAccPromise = bigAccPromise.then(() => {
    const mainTranslationKey = mainTranslation.key;
    const keysDiff = diff(mainTranslation.value, otherTranslation.value);
    const mainUnique: string[] = keysDiff[0].map((elementPathArray: any) => elementPathArray.join('.'));
    const otherUnique: string[] = keysDiff[1].map((elementPathArray: any) => elementPathArray.join('.'));
    if (!mainUnique.length && !otherUnique.length) {
      return;
    }

    diffExists = true;
    console.error(`${mainTranslationKey} and ${otherTranslation.key} translations are diverging. Consider adding missed tokens or removing the obsolete ones.`);
    let translationPromise = Promise.resolve();
    if (mainUnique.length) {
      console.error(`${mainTranslationKey} only tokens:`);

      translationPromise = mainUnique.reduce((accPromise: Promise<void>, path) => {
        return accPromise = accPromise.then(() => {
          const stringified = path.toString();
          console.log(` - ${stringified}`);

          const parts = stringified.split('.');
          let mainValue = mainTranslation.value;
          let otherValue = otherTranslation.value;
          parts.slice(0, parts.length - 1).forEach(part => {
            if (!otherValue[part]) {
              otherValue[part] = {};
            }
            otherValue = otherValue[part];
            mainValue = mainValue[part];
          });

          mainValue = mainValue[parts[parts.length - 1]];
          otherValue[parts[parts.length - 1]] = '';
          if (!mainValue) {
            return;
          }

          return deeplClient.translate(Object.assign(params, {
            text: mainValue,
            source_lang: mainTranslation.languageKey,
            target_lang: otherTranslation.languageKey,
          })).then((result: any) => {
            if (!result) {
              return;
            }

            const firstTranslation = (result.translations || [])[0];
            if (!firstTranslation) {
              otherValue[parts[parts.length - 1]] = '';
              return;
            }
            console.log(`get result ${firstTranslation.text}`);

            otherValue[parts[parts.length - 1]] = firstTranslation.text || '';
          }).catch((error: Error) => {
            console.error(error);
          });
        });
      }, Promise.resolve());
    }

    return translationPromise.then(() => {
      fs.writeFileSync(otherTranslation.path, jsonFormat(otherTranslation.value));

      if (otherUnique.length) {
        console.error(`${otherTranslation.key} only tokens:`);
        otherUnique.forEach(t => console.log(` - ${t}`));

        otherUnique.forEach(path => {
          const parts = path.split('.');
          let tmp = mainTranslation.value;
          parts.slice(0, parts.length - 1).forEach(part => {
            if (!tmp[part]) {
              tmp[part] = {};
            }
            tmp = tmp[part];
          });
          tmp[parts[parts.length - 1]] = '';
        });

        fs.writeFileSync(mainTranslation.path, jsonFormat(mainTranslation.value));
      }

      console.log();
      console.log();
    });
  });
}, Promise.resolve());

allTranslationPromise
  .then(() => {
    clearInterval(awaiter);
    if (diffExists) {
      process.exit(1);
    }
  }).catch(error => {
    console.log(`Error occurred`, error);
    clearInterval(awaiter);
    process.exit(1);
  });
