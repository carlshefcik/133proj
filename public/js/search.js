$(document).ready(() => {

    let searchValue = getParameterByName('search')
    if (searchValue) {
        searchItems(false)
    } else {
        loadMostPopular()
    }

    //add listener and prevents
    document.getElementById('search-btn').addEventListener('click', (event) => {
        searchItems(true)
        event.preventDefault()
    })
})

//just parses information from the url
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadMostPopular() {
    //gets a list of the 10 most popular things from the database
    document.getElementById("search-name").innerHTML = "Results: 10 most popular items"
    $.ajax({
        url: '/get_popular',
        type: 'Get',
        datatype: 'json',
        success: (data) => {
            for (var property in data) {
                //add all items to the table
                tableData.push(processItemData(data[property]))
            }
            dataTable.rows.add(tableData).draw()
        }
    })
}

function searchItems(fromSearchInput) {
    if (fromSearchInput) {
        history.pushState(null, "", "search.html?search=" + document.getElementById('search-input').value)
    }
    document.getElementById("search-name").innerHTML = "Results: " + getParameterByName("search")

    dataTable.clear()

    $.ajax({
        url: '/search_items',
        type: 'Get',
        datatype: 'json',
        success: (data) => {
            if (data.length > 1) {
                //reset tabledata and then re populate with new data
                tableData = []
                for (var property in data) {
                    tableData.push(processItemData(data[property]))
                }
                dataTable.rows.add(tableData).draw()
            } else {
                dataTable.draw()
                document.getElementById("search-name").innerHTML = "No Results for: " + getParameterByName("search")
            }
        }
    })
}

//creates an appropriate aisle element from the given item element
function processItemData(element) {
    // TODO have it create a list of items that can be ordered by price, popularity, and alphabetical order
    //console.log(element)

    let itemRow = document.createElement("tr")

    // creates img col element
    let imgCol = document.createElement("td")
    let image = document.createElement("img")
    image.classList.add("result-img")
    image.src = element[3]
    imgCol.appendChild(image)
    itemRow.appendChild(imgCol)

    // creates name col element
    let nameCol = document.createElement("td")
    let itemName = document.createElement("h4")
    itemName.innerHTML = element[1]
    nameCol.appendChild(itemName)
    itemRow.appendChild(nameCol)

    // creates price col element
    let priceCol = document.createElement("td")
    priceCol.innerHTML = element[2]
    itemRow.appendChild(priceCol)

    // creates button col element
    let btnCol = document.createElement("td")

    let itemATag = document.createElement("a") // link to item page
    itemATag.href = "/item.html?id=" + element[0]
    btnCol.appendChild(itemATag)

    let itemButton = document.createElement("button") // button
    itemButton.classList.add("btn")
    itemButton.classList.add("btn-sm")
    itemButton.innerHTML = "View Item"
    itemATag.appendChild(itemButton)

    let addButton = document.createElement("button") // button
    addButton.classList.add("btn")
    addButton.classList.add("btn-sm")
    addButton.innerHTML = "Add Item"
    addButton.addEventListener('click', (event) => {
        addItemToCart(event)
    })
    btnCol.appendChild(addButton)

    itemRow.appendChild(btnCol)

    // returns the item row to be added to the data source
    return itemRow;
}

function addItemToCart(event) {
    event.preventDefault()
    console.log("adding to cart")
    console.log(event)
}