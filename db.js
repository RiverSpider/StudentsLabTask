const { Client } = require('pg');
const client = new Client({ 
  user: 'riverspider',
  host: 'dpg-cgoo9u8u9tun42q1o0ng-a',
  database: 'feedback_gbp8',
  password: 'DBCZMKBE1O6xRMwVcSIy2ylJWMlqa9Zh',
  port: 5432,
});

module.exports = client;