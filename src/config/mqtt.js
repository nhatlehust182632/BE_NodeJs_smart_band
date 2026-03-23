const mqtt = require('mqtt');
const env = require('./env');

const client = mqtt.connect(env.mqttUrl);

module.exports = client;