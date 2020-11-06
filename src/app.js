require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
//const winston = require('winston');
const app = express();
const errorHandler = require('./errorHandler');
const bookmarkRoute = require('./bookmarkRoute');
const validateBearerToken = require('./validateBearerToken');



const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


app.use('/bookmarks', bookmarkRoute);
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);
app.use(errorHandler);





module.exports = app;