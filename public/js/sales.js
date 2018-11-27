var firebaseStorage = firebase.storage()

$(document).ready(()=> {
    loadSales()
})

function loadSales(){
    $.ajax({
        url: '/get_sales',
        type: 'GET',
        datatype: 'json',
        success: (data) =>{
            console.log("success");
            for (var property in data) {
                addElement(data[property])
            }
        }
    })
}

//creates an appropriate aisle element from the given aisle element
function addElement(element){
    console.log(element)

    let salesNode = document.createElement("div")
    salesNode.classList.add("col-sm-6")
    salesNode.classList.add("col-md-3")

    let atag = document.createElement("a")

    atag.href = "/item.html?id="+element[2];
    salesNode.appendChild(atag)

    let image = document.createElement("img")
    image.classList.add("item-img")
    image.src

    let imgRef = firebaseStorage.refFromURL(element[1]);
    imgRef.getDownloadURL().then(function (url) {
        image.src = url
    }).catch(function (error) {
        console.log(error)
    });
    atag.appendChild(image)

    let ptext = document.createElement("p")
    ptext.innerHTML = element[0]
    atag.appendChild(ptext)

    document.getElementById('sales-list').appendChild(salesNode)
}