// 'use strict';
//
// const loopback = require('loopback');
// const promisify = require('util').promisify;
// const fs = require('fs');
// const writeFile = promisify(fs.writeFile);
// const readFile = promisify(fs.readFile);
// const mkdirp = promisify(require('mkdirp'));
//
// const DATASOURCE_NAME = 'vccDS';
// let dataSourceConfig;
// if (process.env.NODE_ENV === 'prod') {
//   dataSourceConfig = require('../../datasources.prod.js');
// } else {
//   dataSourceConfig = require('../../datasources.json');
// }
// const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);
//
// const tables = [
//   {
//     name: 'answer',
//     model: 'answer.json',
//     config: {
//       name: 'Answer',
//       public: true,
//     },
//   },
//   {
//     name: 'buy_answer',
//     model: 'buy-answer.json',
//     config: {
//       name: 'BuyAnswer',
//       public: true,
//     },
//   },
//   {
//     name: 'category',
//     model: 'category.json',
//     config: {
//       name: 'Category',
//       public: true,
//     },
//   },
//   {
//     name: 'education',
//     model: 'education.json',
//     config: {
//       name: 'Education',
//       public: true,
//     },
//   },
//   {
//     name: 'experience',
//     model: 'experience.json',
//     config: {
//       name: 'Experience',
//       public: true,
//     },
//   },
//   {
//     name: 'notification',
//     model: 'notification.json',
//     config: {
//       name: 'Notification',
//       public: true,
//     },
//   },
//   {
//     name: 'point',
//     model: 'point.json',
//     config: {
//       name: 'Point',
//       public: true,
//     },
//   },
//   {
//     name: 'question',
//     model: 'question.json',
//     config: {
//       name: 'Question',
//       public: true,
//     },
//   },
//   {
//     name: 'subcategory',
//     model: 'sub-category.json',
//     config: {
//       name: 'SubCategory',
//       public: true,
//     },
//   },
//   {
//     name: 'tag',
//     model: 'tag.json',
//     config: {
//       name: 'Tag',
//       public: true,
//     },
//   },
//   {
//     name: 'topup_card',
//     model: 'topup-card.json',
//     config: {
//       name: 'TopupCard',
//       public: true,
//     },
//   },
//   {
//     name: 'user',
//     model: 'user.json',
//     config: {
//       name: 'user',
//       public: true,
//     },
//   },
//   {
//     name: 'wallet',
//     model: 'wallet.json',
//     config: {
//       name: 'Wallet',
//       public: true,
//     },
//   },
//   {
//     name: 'transaction',
//     model: 'transaction.json',
//     config: {
//       name: 'Transaction',
//       public: true,
//     },
//   },
// ];
//
// async function discover() {
//   // It's important to pass the same "options" object to all calls
//   // of dataSource.discoverSchemas(), it allows the method to cache
//   // discovered related models
//   const options = {relations: true};
//
//   await mkdirp('common/models');
//   const configJson = await readFile('server/model-config.json', 'utf-8');
//   const modelConfig = JSON.parse(configJson);
//
//   for (var index = 0; index < tables.length; index++) {
//     // Discover models and relations
//     const discoveredTable = await db.discoverSchemas(tables[index].name,
//       options);
//
//     // Create model definition files. Note: Schema name should be vcc
//     const model = 'vcc.' + tables[index].name;
//     await writeFile(
//       'common/models/' + tables[index].model,
//       JSON.stringify(discoveredTable[model], null, 2),
//     );
//
//     // Expose models via REST API
//     modelConfig[tables[index].config.name] = {
//       dataSource: DATASOURCE_NAME,
//       public: tables[index].config.public,
//     };
//     await writeFile(
//       'server/model-config.json',
//       JSON.stringify(modelConfig, null, 2),
//     );
//   }
// }
// discover().catch(error => {
//   console.error('UNHANDLED ERROR:\n', error);
//   process.exit(1);
// });
