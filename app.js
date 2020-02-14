const express = require("express");
const app = express();

app.get('/', (req, res) => res.json(
    {msg: "Welcome, Nerd!"}
));

const port = 5000;
app.set(port)

app.listen(port, () => { console.log(`App running on ${port}!`) })

module.exports = app