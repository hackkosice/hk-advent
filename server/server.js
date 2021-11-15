require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./router/default');
const port = process.env.PORT || 9999;

app.use('/api', api);

app.listen(port, () => console.log(`Listening on port ${port}`))