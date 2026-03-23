const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensor.routes');
const userRoutes = require('./routes/user.routes');
const deviceRoutes = require('./routes/device.routes');
const heartRateRoutes = require('./routes/heartRate.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sensors', sensorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/heartRate', heartRateRoutes);

module.exports = app;