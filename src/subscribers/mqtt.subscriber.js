const mqttClient = require('../config/mqtt');
const env = require('../config/env');
const sensorService = require('../services/sensor.service');

const startMqttSubscriber = () => {
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT');
    mqttClient.subscribe(env.mqttTopic, (err) => {
      if (err) {
        console.error('Subscribe error:', err);
      } else {
        console.log(`Subscribed to topic: ${env.mqttTopic}`);
      }
    });
  });
  mqttClient.on('message', (topic, message) => {
    const data = Buffer.from(message.toString('hex'), 'hex');
    sensorService.saveSensorData(data, (err, result) => {
      if (err) {
        console.error('MQTT HEX parse/save error:', err.message);
        return;
      }

      if (result && result.saved) {
        console.log('Saved to DB:', result.insertId);
        return;
      }

      console.log('HEX packet parsed, DB not saved:', result && result.message);
    });
  });

  // mqttClient.on('message', (topic, message) => {
  //   try {
  //     const data = JSON.parse(message.toString());

  //     sensorService.saveSensorData(data, (err, result) => {
  //       if (err) {
  //         console.error('Save DB error:', err);
  //       } else {
  //         console.log('Saved to DB:', result.insertId);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('MQTT parse error:', error.message);
  //   }
  // });
};

module.exports = startMqttSubscriber;