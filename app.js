var express = require('express');
var bodyParser = require ('body-parser');
var path = require('path');
var firebase = require("firebase-admin");

var app = express();
var serivceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serivceAccount),
    databaseURL: "https://testing-island.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

var usersRef = ref.child("users");
usersRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});

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
    res.send(usersRef);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`); //boots up node.js server
});
