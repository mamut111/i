const express = require('express')
const path = require('path');


const app = express()
const port = 3001


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `*`);
    next();
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

