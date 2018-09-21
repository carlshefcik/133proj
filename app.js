const express = require('express');
const bodyParser = require ('body-parser');
const path = require('path');
const firebase = require('firebase');
const serviceAccount = require("./serviceAccountKey.json");
const emailRegex = new RegExp(/@gmail.com|@yahoo.com|@hotmail.com|@icloud.com|aol.com|msn.com/);

var app = express();

var config = {
    apiKey: "AIzaSyDS9owx0q_Eq96Cs2T-xD0s_cEHi4AxrEI",
    authDomain: "testing-island.firebaseapp.com",
    databaseURL: "https://testing-island.firebaseio.com",
    projectId: "testing-island",
    storageBucket: "testing-island.appspot.com",
    messagingSenderId: "1059701996270"
};
const firebaseService = firebase.initializeApp(config);

var firebaseAuth = firebaseService.auth();
// var firebaseStorage = firebaseService.storage(); This is be use later
var firebaseDatabase = firebaseService.database();
var firebaseFirestore = firebaseService.firestore();
// var firebaseMessaging = firebaseService.messaging(); This is be use later

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

    if(emailRegex.test(email) && password.length >= 6){
        firebaseAuth.createUserWithEmailAndPassword(email, password);
        firebaseAuth.onAuthStateChanged(firebaseUser => {
            var ref = firebaseFirestore.collection("Customer").doc(firebaseUser.uid);
            ref.set({
                email: email,
                lastName: "",
                firstName: ""
            })
        })
        console.log("success");
    } else {
        console.log("fail");
        alert('Either email nor password is invalid.');
        return;
    }


    //var link = db.collection("Customer").doc();
    //var insert = link.set({
    //    name: email,
    //    password: password
    //});
    
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`); //boots up node.js server
});
