//***********************************************************/
// THIS IS THE OUTDATED SERVER: USE SERVER IN FUNCTIONS FOLER
//***********************************************************/
const express = require('express');
const bodyParser = require ('body-parser');
const path = require('path');
const firebase = require('firebase');
const firestore = require('@firebase/firestore');
const serviceAccount = require("./serviceAccountKey.json");
const emailRegex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

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
const settings = {timestampsInSnapshots: true};
firebaseFirestore.settings(settings);
// var firebaseMessaging = firebaseService.messaging(); This is be use later

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //hook up with your app

// Set static path
app.use(express.static(path.join(__dirname, 'public'))); //initializing the app with the directory of the app.js

app.get('/', (req, res)=>{
    res.send('Hello');
});

//returns a json of element names of the aisles and the groups as corresponding arrays
app.get('/aisles_and_groups', (req,res)=>{
    let items = {}
    firebaseFirestore.collection("Aisles").get().then((coll)=> {
        coll.forEach((doc) => {
            var tmp = doc.id;
            items[tmp] = [];
            // adds groups to the aisles element arrays
            doc.data()['subCollections'].forEach((e)=>{
                items[tmp].push(e);
            })
        });
        res.send(items);     
    }).catch(function(error){
        console.log(error);
    });
})

//adds a new item to the database
app.post('/add_item', (req,res) =>{
    //verifies that the user is an admin
    let itemData = req.body;
    console.log(itemData)
    //upload image to storage and save url to store in item data

    //create new item in the correct aisle collection with a uid store isle address and uid for item page
    firebaseFirestore.collection('Aisles').doc(itemData.Aisle).collection(itemData.Group)

    //create new item in the items collection
    firebaseFirestore.collection('Items').add({
        name: itemData.Name,
        country: 'Japan'
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    })

    res.send(itemData)
})

app.post('/register_user', (req,res)=>{
    console.log('going')
    let email = req.body.username;
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
        //alert('Either email nor password is invalid.');
        return;
    }
    
});

app.post('/login_user', (req,res)=>{
    console.log(req.body);
    let email = req.body.username;
    console.log("here is email: " + email);
    let password = req.body.password;
    console.log("here is password: " + password);

    if(emailRegex.test(email) && password.length >= 6){
        firebaseAuth.signInWithEmailAndPassword(email, password);
        res.send(email);
        console.log("login successed");
    } else {
        console.log("login failed");
        //alert('Either email nor password is invalid.');
        return;
    }
    
});

app.get('/get_cart', (req,res)=>{
    console.log("test");
    var ref = firebaseFirestore.collection('Aisles').doc('Bakery').collection('Bread');
    ref.get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
});

app.get('/get_inventory', (req,res)=>{

    let items = [];
    //var ref_inventory = firebaseFirestore.collection('Aisles').doc("Bakery/Bread");

    firebaseFirestore.collection("Aisles").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var tmp = doc.id;
            items.push(tmp);
            //console.log(items);
            
        });
        console.log(items);
        //send items before error handling
        res.send(items);
    }).catch(function(error){
        console.log(error);
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/`); //boots up node.js server
});
