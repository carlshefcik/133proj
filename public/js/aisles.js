$(document).ready(() => {
    loadAisles()
})

function loadAisles(){
    $.ajax({
        url: '/load_aisles',
        type: 'Get',
        datatype: 'json',
        success: (data) =>{
            for (var property in data) {
                addElement(data[property])
            }
        }
    })
}

//creates an appropriate aisle element from the given aisle element
function addElement(element){
    let aisleNode = document.createElement("div")
    aisleNode.classList.add("col-sm-6")
    aisleNode.classList.add("col-md-3")

    let atag = document.createElement("a")
    atag.href = "/aisles/group.html?aisle="+element[0]
    aisleNode.appendChild(atag)

    let image = document.createElement("img")
    image.classList.add("aisle-img")
    image.src = element[1]
    atag.appendChild(image)

    let ptext = document.createElement("p")
    ptext.innerHTML = element[0]
    atag.appendChild(ptext)

    document.getElementById('aisles-list').appendChild(aisleNode)
}
