require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const transactions = require('./routes/api/transactions');
const creators = require('./routes/api/creators');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds035553.mlab.com:35553/stellar-tip`;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/transactions', transactions)
app.use('/creators', creators)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));