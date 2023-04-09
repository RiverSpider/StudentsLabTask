const { Client } = require('pg');

const client = new Client({
  host: 'ep-tight-bar-321171.eu-central-1.aws.neon.tech',
  port: 5432,
  database: 'feedback_u3f4',
  user: 'feedback_u3f4_user',
  password: 'QQkZ5qApb6FnYTSeaigiMk0HDXVWG67t',
});


module.exports = client;