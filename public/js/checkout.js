$(document).ready(() => {
    //get cart from db or cache
    loadCart()
    total_cost = 0
    cart_total_unique = 0

    document.getElementById("checkout_button").addEventListener('click', (event) => {
        checkout()
        event.preventDefault()
    })
})

function checkout() {
    console.log("needs a new ajax function")

    $.ajax({
        url: '/checkout',
        type: 'Get',
        datatype: 'json',
        statusCode: {
            304: function () {
                //no one logged in so process cache
                alert("No one logged in! Please log in")
            }
        },
        success: (data) => {
            //redirect to page that say order was completed and details are now on account page in order history
            if (data) {
                window.location.pathname = '/checkoutsuccess.html'
            }
        }
    })
}

function loadCart() {

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
        success: (data) => {
            console.log(data)
            if (data) {
                Object.keys(data).forEach((key) => {
                    //puts the data into the list
                    document.getElementById("cart-items").appendChild(processItemData(data[key]))
                })
            }

            let itemli = document.createElement("li")
            itemli.classList.add("list-group-item")
            itemli.classList.add("d-flex")
            itemli.classList.add("justify-content-between")

            let total = document.createElement("span")
            total.innerHTML = "Total (USD)"
            itemli.appendChild(total)

            let price = document.createElement("strong")
            price.innerHTML = "$" + total_cost.toFixed(2)
            itemli.appendChild(price)

            document.getElementById("cart-items").appendChild(itemli)

            document.getElementById("cart-unique-items").innerHTML = cart_total_unique

            document.getElementById("new-total").innerHTML = (total_cost - 5).toFixed(2)
        }
    })
}

//creates an appropriate cart row element from the given item element
function processItemData(element) {
    console.log(element)

    let itemli = document.createElement("li")
    itemli.classList.add("list-group-item")
    itemli.classList.add("d-flex")
    itemli.classList.add("justify-content-between")
    itemli.classList.add("lh-condensed")

    // creates name and quantity tag in a wrapper
    let wrapper = document.createElement("div")
    let itemName = document.createElement("h6")
    itemName.classList.add("my-0")
    itemName.innerHTML = element[0]
    let itemQuantity = document.createElement("small")
    itemQuantity.classList.add("text-muted")
    itemQuantity.innerHTML = "Quantity: " + element[3]

    wrapper.appendChild(itemName)
    wrapper.appendChild(itemQuantity)
    itemli.appendChild(wrapper)

    let price = document.createElement("span")
    price.classList.add("text-muted")
    price.innerHTML = "$" + (element[2] * element[3]).toFixed(2)

    total_cost += element[2] * element[3]
    cart_total_unique++

    itemli.appendChild(price)

    // returns the item row to be added to the data source
    return itemli;
}