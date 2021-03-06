const functions = require('firebase-functions');
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase');
const serviceAccount = require("./serviceAccountKey.json");
const emailRegex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

const app = express();

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
const settings = {
    timestampsInSnapshots: true
};
firebaseFirestore.settings(settings);
// var firebaseMessaging = firebaseService.messaging(); This is be use later

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
})); //hook up with your app

// Set static path
//app.use(express.static(path.join(__dirname, 'src'))); //initializing the app with the directory of the app.js

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/hi', (req, res) => {
    res.send("Hello World!");
});

//returns a json of element names of the aisles and the groups as corresponding arrays
app.get('/aisles_and_groups', (req, res) => {
    let items = {}
    firebaseFirestore.collection("Aisles").get().then((coll) => {
        coll.forEach((doc) => {
            var tmp = doc.id;
            items[tmp] = [];
            // adds groups to the aisles element arrays
            doc.data()['subCollections'].forEach((e) => {
                items[tmp].push(e);
            })
        });
        res.send(items);
    }).catch(function (error) {
        console.log(error);
    });
})

//gets the aisles and their ing urls
app.get('/load_aisles', (req, res) => {
    let aisles = {}
    firebaseFirestore.collection("Aisles").get().then((coll) => {
        coll.forEach((doc) => {
            let tmp = doc.id
            aisles[tmp] = []
            aisles[tmp].push(tmp)
            aisles[tmp].push(doc.data()['imgURL'])
        })
        res.send(aisles)
    }).catch(function (error) {
        console.log(error)
    })
})

//loads all items from requested aisle
app.get('/load_items', (req, res) => {
    let items = []
    let aisleName = Object.keys(req.query)[0]
    let groups
    console.log(aisleName)

    getItems()

    function getItems() {
        firebaseFirestore.collection("Aisles").doc(aisleName).get().then((doc) => {
            groups = doc.data()["subCollections"]
        }).then((data) => {
            groups.forEach((groupName) => {
                firebaseFirestore.collection("Aisles").doc(aisleName).collection(groupName).get().then((coll) => {
                    coll.forEach((doc) => {
                        // put in array and then add to array
                        items.push([doc.data()["name"], doc.id, doc.data()["imgURL"]])
                    })
                })
            })
        })
        // for some reason firebase does an async call on firestore functions
        setTimeout(function () {
            res.send(items)
        }, 500)
    }
})

//loads all items from requested user's uid
app.get('/load_history', (req, res) => {
    let itemsHistory = []
    var firebaseUser = firebaseAuth.currentUser;

    if (firebaseUser) { //if there is a user logged in
        let userID = firebaseUser.uid
        let userDB = firebaseFirestore.collection("Customer").doc(userID)

        //query for email
        firebaseFirestore.collection("Customer").doc(userID).get().then((doc) => {
            let items = doc.data().history

            items.forEach((item) => {
                firebaseFirestore.collection("Items").doc(item).get().then((doc) => {
                    let tempItem = [
                        doc.data().name,
                        doc.data().imgURL,
                        item
                    ]
                    itemsHistory.push(tempItem)
                })
            })

            setTimeout(function () {
                res.send(itemsHistory)
            }, 500)
        })
    } else { //no user logged in so must store cart in cache
        res.status(304).send("No user logged in, store in cache")
    }
})

//loads items for sales page
app.get('/get_sales', (req, res) => {
    let sales = [];

    firebaseFirestore.collection("Items").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc.get("sale") == true) {
                let tempItem = [
                    doc.get("name"),
                    doc.get("imgURL"),
                    doc.id
                ]
                sales.push(tempItem)
            }
        });
        //send items before error handling
        res.send(sales);
    }).catch(function (error) {
        console.log(error);
    });
})

//loads items for item page
app.get('/load_item_info', (req, res) => {
    let itemInfo = {}
    let itemId = Object.keys(req.query)[0]
    console.log(itemId)

    firebaseFirestore.collection("Items").doc(itemId).get().then((doc) => {
        if (doc.exists) {
            // sets doc data to the item info
            itemInfo = doc.data()
            res.send(itemInfo)
        } else {
            console.log("Item doesnt exist")
            res.redirect(404, '/404.html')
        }
    })
})

app.get('/get_popular', (req, res) => {
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
app.post('/add_item', (req, res) => {
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

})

app.post('/register_user', (req, res) => {
    console.log('going')
    let email = req.body.username;
    let password = req.body.password;
    let userID;

    if (emailRegex.test(email) && password.length >= 6) {
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(function (data) {
                console.log("Test here: " + data.user.uid);
                firebaseFirestore.collection("Customer").doc(data.user.uid).set({
                    email: email,
                    lastName: "",
                    firstName: ""
                })
                console.log("success");
                res.send(email);
            }).catch(function (error) {
            console.log("fail");
        })
    }

});

app.post('/login_user', (req, res) => {

    console.log(req.body);
    let email = req.body.username;
    console.log("here is email: " + email);
    let password = req.body.password;
    console.log("here is password: " + password);

    let user1 = ""
    let promise1 = new Promise(function (resolve, reject) {
        firebaseAuth.onAuthStateChanged(function (user) {
            user1 = user
        })
        resolve('data')
    });

    promise1.then(function (data) {
        if (user1) {
            console.log("User already logged in!!!")
        } else {
            if (emailRegex.test(email) && password.length >= 6) {
                firebaseAuth.signInWithEmailAndPassword(email, password);
                res.send(email);
                console.log("login successed");
            } else {
                console.log("login failed");
                //alert('Either email nor password is invalid.');
                return;
            }
        }
    });
});

app.get('/logOutUser', (req, res) => {

    let user1 = ""
    let promise1 = new Promise(function (resolve, reject) {
        firebaseAuth.onAuthStateChanged(function (user) {
            user1 = user
        })
        resolve('data')
    })

    promise1.then(function (data) {
        if (user1) {
            firebaseAuth.signOut();
            console.log("Logged out succesful")
            res.send("Logged out succesfull")
            //res.send("Guest")
        }
    })
});

app.get('/check_user_status', (req, res) => {
    console.log("I am over here!!!!")
    let user1 = ""
    let promise1 = new Promise(function (resolve, reject) {
        firebaseAuth.onAuthStateChanged(function (user) {
            user1 = user
        })
        resolve('data')
    })

    promise1.then(function (data) {
        if (user1) {
            console.log("User is logged in!!!!")
            res.send(user1.email)
        } else {
            console.log("User is not logged in!!!!")
            res.send("Guest")
        }
    })

});

app.get('/check_user_status_1', (req, res) => {
    console.log("I am over here!!!!")
    let user1 = ""
    let promise1 = new Promise(function (resolve, reject) {
        firebaseAuth.onAuthStateChanged(function (user) {
            user1 = user
        })
        resolve('data')
    })

    promise1.then(function (data) {
        if (user1) {
            console.log("User is logged in!!!!")
            res.send(user1.uid)
        } else {
            console.log("User is not logged in!!!!")
            res.send("Guest")
        }
    })

});

app.get('/get_cart', (req, res) => {
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

//loads the cart items if there are items, returns error otherwise
app.get('/load_cart', (req, res) => {
    // variable for the user
    var firebaseUser = firebaseAuth.currentUser;
    let cartItem = {}

    if (firebaseUser) {
        let userID = firebaseUser.uid
        // let userDB = firebaseFirestore.collection("Customer").doc(userID)
        let cartInfo

        firebaseFirestore.collection("Customer").doc(userID).get().then((doc) => {
            cartInfo = doc.get("cart")

            Object.keys(cartInfo).forEach((key) => {
                firebaseFirestore.collection("Items").doc(key).get().then((doc) => {
                    Object.defineProperty(cartItem, doc.id, {
                        value: [doc.get('name'), doc.get('imgURL'), doc.get('price'), cartInfo[key]],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    })
                })
            })
            setTimeout(function () {
                res.send(cartItem)
            }, 200)
        })
    } else { //no user logged in so must store cart in cache
        res.status(304).send("No user logged in, store in cache")
    }
});


app.get('/add_to_history', (req, res) => {
    //pareses data
    let itemID = Object.keys(req.query)[0]
    // let itemQuantity = req.query[data][1]

    // variable for the user
    var firebaseUser = firebaseAuth.currentUser;

    if (firebaseUser) { //if there is a user logged in
        let userID = firebaseUser.uid
        let userDB = firebaseFirestore.collection("Customer").doc(userID)
        let history;

        //query for email
        firebaseFirestore.collection("Customer").doc(userID).get().then((doc) => {
            if (doc.exists) {
                // gets cart reference in the db
                history = doc.get("history")

                if (!history) {
                    history = [itemID]
                    userDB.update({
                        history: history
                    })
                } else {
                    for (const itr in history) {
                        if (history[itr] == itemID) {
                            console.log("found");
                        } else {
                            console.log("not found");
                            userDB.update({
                                history: firebase.firestore.FieldValue.arrayUnion(itemID)
                            });
                        }
                    }
                }

                res.send("sucess")
            }
        })
    } else { //no user logged in so must store cart in cache
        res.status(304).send("No user logged in, store in cache")
    }
})


//adds given item id to the cart
app.get('/add_to_cart', (req, res) => {
    //pareses data
    let data = Object.keys(req.query)[0]
    let itemID = req.query[data][0]
    let itemQuantity = req.query[data][1]

    // variable for the user
    var firebaseUser = firebaseAuth.currentUser;

    if (firebaseUser) { //if there is a user logged in
        let userID = firebaseUser.uid
        let userDB = firebaseFirestore.collection("Customer").doc(userID)
        let cart;

        //query for email
        firebaseFirestore.collection("Customer").doc(userID).get().then((doc) => {
            if (doc.exists) {
                // gets cart reference in the db
                cart = doc.get("cart") ? doc.get("cart") : {};

                if (cart[itemID]) {
                    //adds more items if the item is alread in the cart
                    cart[itemID] += parseInt(itemQuantity, 10)
                } else {
                    // creates a new map element in the cart if item is not there
                    Object.defineProperty(cart, itemID, {
                        value: parseInt(itemQuantity, 10),
                        writable: true,
                        enumerable: true,
                        configurable: true
                    })
                }

                //updates the cart with the new cart data
                userDB.update({
                    cart: cart
                })

                res.send("sucess")
            }
        })

    } else { //no user logged in so must store cart in cache
        res.status(304).send("No user logged in, store in cache")
    }
})

app.get('/cart_item_delete', (req, res) => {
    //pareses data
    let data = Object.keys(req.query)[0]
    let itemID = req.query[data][0]

    // variable for the user
    var firebaseUser = firebaseAuth.currentUser;

    if (firebaseUser) { //if there is a user logged in
        let userID = firebaseUser.uid
        let userDB = firebaseFirestore.collection("Customer").doc(userID)
        let cart;

        //query for email
        firebaseFirestore.collection("Customer").doc(userID).get().then((doc) => {
            if (doc.exists) {
                // gets cart reference in the db
                cart = doc.get("cart");

                if (cart[itemID]) {
                    //adds more items if the item is alread in the cart
                    delete cart[itemID]
                }

                //updates the cart with the new cart data
                userDB.update({
                    cart: cart
                })

                res.send("sucessfully deleted item")
            }
        })

    } else { //no user logged in so must store cart in cache
        res.status(304).send("No user logged in, store in cache")
    }
})

app.get('/checkout', (req, res) => {
    var firebaseUser = firebaseAuth.currentUser;

    if (firebaseUser) { //if there is a user logged in
        let userID = firebaseUser.uid
        let userDB = firebaseFirestore.collection("Customer").doc(userID)

        //deletes cart map
        userDB.update({
            cart: firebase.firestore.FieldValue.delete()
        })
        res.send("success")
    } else { //no user logged in so must store cart in cache
        res.status(304).send("No user logged in, store in cache")
    }
})

app.get('/get_inventory', (req, res) => {
    let items = [];
    //var ref_inventory = firebaseFirestore.collection('Aisles').doc("Bakery/Bread");
    firebaseFirestore.collection("Aisles").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var tmp = doc.id;
            items.push(tmp);
        });
        console.log(items);
        //send items before error handling
        res.send(items);
    }).catch(function (error) {
        console.log(error);
    });
});

app.get('*', function (req, res) {
    res.redirect('/404.html');
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.app = functions.https.onRequest(app);