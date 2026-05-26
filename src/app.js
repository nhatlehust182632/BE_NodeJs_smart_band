const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensor.routes');
const userRoutes = require('./routes/user.routes');
const deviceRoutes = require('./routes/device.routes');
const heartRateRoutes = require('./routes/heartRate.routes');
const locationRoutes = require('./routes/location.router');
const monitorRoutes = require('./routes/monitor.router');
const stepRoutes = require('./routes/step.routes');
const atrialRoutes = require('./routes/atrial.routes');
const disconnectRoutes = require('./routes/disconnect.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sensors', sensorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/heartRate', heartRateRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/step', stepRoutes);
app.use('/api/atrial', atrialRoutes);
app.use('/api/disconnect', disconnectRoutes);

module.exports = app;
