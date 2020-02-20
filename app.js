const express = require("express");
const app = express();

app.get('/', (req, res) => res.json(
    {msg: "Welcome, Nerd!"}
));

//Database Configuration
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/enterpair-api";

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect( url , {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
      console.log("Successfully connected to the database");
  }).catch(err => {
      console.log('Could not connect to the database. Exiting now...');
      console.log(err)
      process.exit();
  });

const port = 5000;
app.set(port)

app.listen(port, () => { console.log(`App running on ${port}!`) })

module.exports = app