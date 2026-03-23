const mqtt = require('mqtt');
const mysql = require('mysql2');

// 1. Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123456',
  database: 'smartband_db'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// 2. Kết nối MQTT Broker
// const mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883');
const mqttClient = mqtt.connect('wss://test.mosquitto.org:8081');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');

  mqttClient.subscribe('smartband/data', (err) => {
    if (err) {
      console.error('Subscribe error:', err);
    } else {
      console.log('Subscribed to topic: smartband/data');
    }
  });
});

// 3. Nhận message từ MQTT
mqttClient.on('message', (topic, message) => {
  console.log('Received message:', message.toString());

  try {
    const data = JSON.parse(message.toString());

    const heart_rate = data.heart_rate;
    const spo2 = data.spo2;
    const steps = data.steps;

    const sql = `
      INSERT INTO sensor_data (heart_rate, spo2, steps)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [heart_rate, spo2, steps], (err, result) => {
      if (err) {
        console.error('Insert error:', err);
      } else {
        console.log('Data saved to MySQL, ID:', result.insertId);
      }
    });

  } catch (error) {
    console.error('JSON parse error:', error.message);
  }
});

// 4. Xử lý lỗi MQTT
mqttClient.on('error', (err) => {
  console.error('MQTT error:', err);
});