const express = require('express');

const app = express();
app.use(express.static('dist'));
app.disable('etag');

module.exports = app;
