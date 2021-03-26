const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const reservationsRouter = require('./routes/reservations');

const app = express();
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true, 
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use('/', reservationsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
}); 