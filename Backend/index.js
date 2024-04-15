const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./controller/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});