//***********************************************************/
// THIS IS THE OUTDATED SERVER: USE SERVER IN FUNCTIONS FOLER
//***********************************************************/
const express = require('express');
const bodyParser = require ('body-parser');
const path = require('path');
const firebase = require('firebase');
const firestore = require('@firebase/firestore');
const storage = require('@firebase/storage');
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
var firebaseStorage = firebase.storage()
// var firebaseDatabase = firebaseService.database();
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

//gets the aisles and their img urls
app.get('/load_aisles', (req,res) => {
    let aisles = {}
    firebaseFirestore.collection("Aisles").get().then((coll) =>{
        coll.forEach((doc) =>{
            let tmp = doc.id
            aisles[tmp] = []
            aisles[tmp].push(tmp)
            aisles[tmp].push(doc.data()['imgURL'])
        })
        res.send(aisles)
    }).catch(function(error){
        console.log(error)
    })
})

//loads all items from requested aisle
app.get('/load_items', (req,res) => {
    let items = []
    let aisleName = Object.keys(req.query)[0]
    let groups
    console.log(aisleName)

    getItems()


    function getItems() {
        firebaseFirestore.collection("Aisles").doc(aisleName).get().then((doc) =>{
            groups = doc.data()["subCollections"]
        }).then((data) =>{
            groups.forEach((groupName) =>{
                firebaseFirestore.collection("Aisles").doc(aisleName).collection(groupName).get().then((coll) =>{
                    coll.forEach((doc) =>{
                        items.push(doc.data()["name"])
                    })
                })
            })
        })
        // for some reason firebase does an async call on firestore functions
        setTimeout(function(){res.send(items)}, 2000)
    }
})

app.get('/search_items', (req,res)=>{
    // does db query for all the items
    // returns resulting items
    let items = [1]
    res.send(items)
})

app.get('/get_popular', (req,res)=>{
    let popular = {
        "test1": ["id1", "name1", 1, "image1"],
        "test3": ["id3", "name3", 2, "image3"],
        "test2": ["id2", "name2", 3, "image2"],
        "test4": ["id4", "name4", 4, "image4"],
        "test5": ["id5", "name5", 5, "image5"]
    }
    res.send(popular)
})

//adds a new item to the database
app.post('/add_item', (req,res) =>{
    //verifies that the user is an admin


    let itemData = req.body
    // console.log(itemData)
    let itemid
    let itemProperties = {
        name: itemData.Name,
        aisle: itemData.Aisle,
        group: itemData.Group,
        quantity: itemData.Quantity, 
        sale: itemData.Sale, 
        salePercent: itemData.SalePercent, 
        info: itemData.Info,
        imgURL: ""
    }

    // create new item in the items collection
    firebaseFirestore.collection('Items').add(itemProperties).then(ref => {
        console.log('Added document with ID: ', ref.id)
        itemid = ref.id

        //create new item in the correct aisle collection with a uid store isle address and uid for item page
        firebaseFirestore.collection('Aisles').doc(itemData.Aisle).collection(itemData.Group).doc(itemid).set(itemProperties)
        res.send(itemid)
    });

    // Image upload snippett
    {
    // console.log("uploading image")
    // // Create file metadata including the content type
    // var metadata = { contentType: 'image/jpeg' };
    // // Upload the file and metadata
    // var uploadTask = firebaseStorage.ref().child("Aisles/Bakery/Bread/default.jpg").put(itemData.Image, metadata)

    // // Register three observers:
    // // 1. 'state_changed' observer, called any time the state changes
    // // 2. Error observer, called on failure
    // // 3. Completion observer, called on successful completion
    // uploadTask.on('state_changed', function(snapshot){
    //     // Observe state change events such as progress, pause, and resume
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log('Upload is ' + progress + '% done');
    //     switch (snapshot.state) {
    //     case firebase.storage.TaskState.PAUSED: // or 'paused'
    //         console.log('Upload is paused');
    //         break;
    //     case firebase.storage.TaskState.RUNNING: // or 'running'
    //         console.log('Upload is running');
    //         break;
    //     }
    // }, function(error) {
    //     // Handle unsuccessful uploads
    //     console.log("didnt upload")
    // }, function() {
    //     // Handle successful uploads on complete
    //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //     uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    //         console.log('File available at', downloadURL);
    //         itemProperties.imgURL = downloadURL
    //     });
    // });
    }

    // //add imgURL to original item document
    // firebaseFirestore.collection('Items').doc(itemid).set({
    //     imgURL: itemProperties.imgURL
    // }).then(ref => {
    //     console.log('Added changed imgurl of: ', ref.id)
    // })
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
