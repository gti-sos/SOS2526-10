let express = require('express');

let app=express();

app.use("/", express.static("./public"));

const cool = require('./cool/cool.js');
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/cool', (req, res) => {
  res.send(cool.coolFace());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
