var express = require('express');
var bodyParser = require ('body-parser');
var path = require('path');

var app = express();

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //hook up with your app

// Set static path
app.use(express.static(path.join(__dirname, 'src'))); //initializing the app with the directory of the app.js

const sale = [
    {
        item: 'Bannanas',
        percent: 30
    },{
        item: 'Ice Cream',
        percent: 50
    }
];

app.get('/', (req, res)=>{
    res.send('Hello');
});

app.get('/get_sales', (req,res)=>{
    res.send(sale);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`); //boots up node.js server
});
