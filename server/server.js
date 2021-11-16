require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./router/default');
const cors = require('cors');
const port = process.env.PORT || 9999;

app.use(cors());
app.use('/api', api);

app.listen(port, () => console.log(`Listening on port ${port}`))