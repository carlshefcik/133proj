var express = require('express');
var bodyParser = require ('body-parser');
var path = require('path');
const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();


  
var app = express();
//var serivceAccount = require("./serviceAccountKey.json");

//var db = firebase.database();
//var ref = db.ref("restricted_access/secret_document");
//ref.on("value", function(snapshot) {
//    console.log(snapshot.val());
//  }, function (errorObject) {
//    console.log("The read failed: " + errorObject.code);
//});


var docRef = db.collection('users').doc('alovelace');

var setAda = docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});

var test = db.collection("items").doc("dairy");
var test2 = test.set({
    name: 'Milk',
    desc: 'From cow',
    exp: 2023
  });

  db.collection('items').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
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
    res.send(sale);
});

app.get('/get_inventory', (req,res)=>{
    var items = [];
    db.collection('items').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("Test " + doc.id, '=>', doc.data());
          var tmp = doc.data();
          console.log("Here before " + items[0]);
          items.push(tmp);
          res.send(items);
          console.log("Here after " + JSON.stringify(items[0]));
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
        res.send(items);
      });
    //res.send(items);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`); //boots up node.js server
});
