var firebaseStorage = firebase.storage()

$(document).ready(() => {
    total_cost = 0
    cart_total_unique = 0

    //get cart from db or cache
    loadCart()
})


function loadCart(){

    $.ajax({
        url: '/load_cart',
        type: 'Get',
        datatype: 'json',
        statusCode: {
            304: function () {
                //no one logged in so process cache
                alert("No one logged in!")
            }
        },
        success: (data) =>{
            console.log(data)
            if(data){
                tableData = []
                Object.keys(data).forEach((key) => {
                    tableData.push(processItemData(data[key]))
                })
                console.log("draw data")
                dataTable.rows.add(tableData).draw()
            }

            document.getElementById("item-total").innerHTML = "$" + total_cost.toFixed(2)

            document.getElementById("cart-quantity").innerHTML = cart_total_unique
        }
    })
}

//creates an appropriate cart row element from the given item element
function processItemData(element){
    console.log(element)
    
    let itemRow = document.createElement("tr")

    // creates img col element and has to query firebase for the img url
    let imgCol = document.createElement("td")
    let image = document.createElement("img")
    image.classList.add("item-img")
    let imgRef = firebaseStorage.refFromURL(element[1]);
    imgRef.getDownloadURL().then(function (url) {
        image.src = url
    }).catch(function (error) {
        console.log(error)
    });
    imgCol.appendChild(image)
    itemRow.appendChild(imgCol)

    // creates name col element
    let nameCol = document.createElement("td")
    let itemName = document.createElement("p")
    itemName.innerHTML = element[0]
    nameCol.appendChild(itemName)
    itemRow.appendChild(nameCol)

    // creates price col element
    let priceCol = document.createElement("td")
    priceCol.innerHTML = "$ "+ element[2]
    itemRow.appendChild(priceCol)


    // creates button col element
    let btnCol = document.createElement("td")

    let quantityTag = document.createElement("input") // quantity
    quantityTag.classList.add("quantity-input")
    quantityTag.value = element[3]
    
    let minusButton = document.createElement("button") // button
    minusButton.classList.add("red-button")
    minusButton.innerHTML = "-"
    minusButton.addEventListener('click', (event)=>{
        if(!(quantityTag.value <= 0)){
            quantityTag.value--
        }
    })
    
    let plusButton = document.createElement("button") // button
    plusButton.classList.add("red-button")
    plusButton.innerHTML = "+"
    plusButton.addEventListener('click', (event)=>{
        quantityTag.value++
    })

    btnCol.appendChild(minusButton)
    btnCol.appendChild(quantityTag)
    btnCol.appendChild(plusButton)

    itemRow.appendChild(btnCol)

    total_cost += element[2] * element[3]
    cart_total_unique++

    // returns the item row to be added to the data source
    return itemRow;

}
