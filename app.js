const express = require('express');
const bodyParser = require ('body-parser');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

var app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

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

app.post('/register_user', (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    var link = db.collection("Customer").doc();
    var insert = link.set({
        name: email,
        password: password
    });
    console.log(email + " " + password);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`); //boots up node.js server
});
