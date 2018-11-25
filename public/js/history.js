var firebaseStorage = firebase.storage()
var historyList = []

$(document).ready(() => {

    // solution from https://jennamolby.com/how-to-display-dynamic-content-on-a-page-using-url-parameters/
    // Parse the URL parameter
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    // Give the parameter a variable name
    let dynamicContent = getParameterByName('id');
    console.log(dynamicContent)

    loadItem(dynamicContent)
})

function loadItem(groupName) {
    $.ajax({
        url: '/load_item_info',
        type: 'Get',
        datatype: 'json',
        data: groupName,
        statusCode: {
            404: function () {
                //this happens when express gives the 404 error code
                window.location.pathname = '/404.html'
            }
        },
        ////////////////////////////////////////////////////
        success: (data) => {
            createARow(data)
            
            

        }
    })
}

//trying to create a row for every 3 elements added//
function createARow(data) {
    var row = 0
    let newRow = document.createElement("div")
    newRow.classList.add("row")

    
        historyList.forEach(element => {
              newRow.appendChild(addElement(data)) 
                row++
            
            if (row ==3){
                newRow.classList.add("row")}
         })

        
    



}

//trying to create an element per each card
function addElement(element) {
    let anItemImg = document.createElement("card-img-top")


    //let anItem = document.getElementById("viewHistory")
    let image = document.createElement("img")
    image.classList.add("item-img")
    
    let imgRef = firebaseStorage.refFromURL(element[2]);
    imgRef.getDownloadURL().then(function(url) {
        image.src = url
    }).catch(function(error) {
        console.log(error)
    });

    anItemImg.appendChild(image)

    let anItemBody = document.createElement("card-body")
    let anItemTitle = document.createElement("card-title")
    anItemBody.appendChild(anItemTitle)

    let itemName = document.createElement("")
    itemName.innerHTML = element[0]
    anItemTitle.appendChild(itemName)

    let anItemPrice = document.createElement("card-text")
    anItemBody.appendChild(anItemPrice)

///<<<<<<<<<<need help getting the price element or we could completely drop this too and ONLY show img and item name?/////////////////
    let itemPrice = document.createElement("")
   // itemID.innerHTML = element[1]
    itemPrice.innerHTML = element[1].get[6]
    anItemPrice.appendChild(itemPrice)



}

////////////////////////////////////////////////////
//adds item to array of 9
///////////////this function is called within group.js under function loadItems,
// it is called as an eventListener click/////////
function addToHistory(element){
    if(historyList.length == 9)
    {
        historyList.splice(1,0)
    }
    historyList.push(element)


}