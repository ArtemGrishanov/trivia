// запустить все юнит тесты
npm run jest

// запустить в консоли один конкретный файл
npm run jest remix-triggers.test.js

// запустить в консоли один конкретный тест
// где 'property_updated simple trigger' это название теста из функции it()
npm run jest -- -t 'property_updated simple trigger'

// отладить один конкретный тест
node --inspect-brk node_modules/.bin/jest --runInBand remix-triggers.test.js -t 'property_updated simple trigger'
// затем идем в chrome://inspect/#devices и выбираем inspect

Больше информации
https://jestjs.io/docs/ru/troubleshooting
