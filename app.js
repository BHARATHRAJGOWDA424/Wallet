require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan')
const AdminSetupService = require('./domain/services/systemSetup/admin/AdminSetupService');
const UserManagement = require('./api/UserManagement/routes');


const app = express();
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_PATH + process.env.DB_NAME, module.exports = {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
mongoose.connection.on(`connected`, () => {
  console.log('Connected to database ');
});

// On Error
mongoose.connection.on('error', err => {
  console.log('Database error: ' + err);
});

// Port Number
const port = process.env.PORT || 1993;

app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));

// Morgan Middleware for logging
app.use(morgan('dev'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

//TestRoute
app.post('/test', (req, res) => {
  res.status(200).send({ message: 'Testcase Successfully completed', data: req.body });
});

// Index Route
app.get('/', (req, res) => {
  res.status(404).send('Invalid Endpoint');
});

app.use('/api', UserManagement);



app.get('*', (req, res) => {
  res.status(404).send('Invalid Endpoint');
});

let appListenCallBack = async () => {
  try {
    await AdminSetupService.create().setup()
    console.log('Server started on port ' + port);

  } catch (error) {
    console.log('Server started on port ' + port + ' with error ' + error);
  }
}

app.listen(port, appListenCallBack);