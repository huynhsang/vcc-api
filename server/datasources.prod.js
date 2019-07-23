'use strict';

module.exports = {
  db: {
    name: 'db',
    connector: 'memory',
  },
  vccDS: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    url: process.env.MYSQL_URL,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    name: 'vccDS',
    user: process.env.MYSQL_USER,
    connector: 'mysql',
    dateStrings: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  },
  emailDS: {
    name: 'emailDS',
    connector: 'mail',
    transports: [
      {
        type: 'smtp',
        host: 'smtp.gmail.com',
        secure: true,
        port: 465,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: 'no.reply.vcnc@gmail.com',
          pass: 'aaAA11!!',
        },
      },
    ],
  },
};
