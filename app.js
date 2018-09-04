var express = require('express');
var bodyParser = require ('body-parser');
var path = require('path');

var app = express();

// View engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //hook up with your app

// Set static path
app.use(express.static(path.join(__dirname, 'src'))); //initializing the app with the directory of the app.js


app.get('/', (req, res)=>{
    res.send('Hello')
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`) //boots up node.js server
});
