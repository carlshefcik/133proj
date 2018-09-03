var express = require('express');
var app = express();
var bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended: true})); //hook up with your app
app.use(express.static('./')); //initializing the app with the directory of the app.js


app.listen(8000, () => {
    console.log('server started at http://localhost:8000/src/index.html') //boots up node.js server
});
