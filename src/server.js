const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');
const startMqttSubscriber = require('./subscribers/mqtt.subscriber');

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }

  console.log('Connected to MySQL');

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
  });

  startMqttSubscriber();
});