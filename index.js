require('dotenv').config()

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const router = require('./routes/auth')


const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .send({ message: err.message, stack: err.stack });
});

app.use('/api/v1', router);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});