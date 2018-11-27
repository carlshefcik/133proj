$(document).ready(() => {
    loadHistory()
})

function loadHistory(){
    $.ajax({
        url: '/load_history',
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

    console.log("Testing for element: " + element);
    console.log("Testing for element[0]: " + element[0]);

    let historyNode = document.createElement("div")
    historyNode.classList.add("col-sm-6")
    historyNode.classList.add("col-md-3")

    let atag = document.createElement("a")

    atag.href = "/item.html?id="+element;
    historyNode.appendChild(atag)

    // let image = document.createElement("img")
    // image.classList.add("aisle-img")
    // image.src = element[1]
    // atag.appendChild(image)

    let ptext = document.createElement("p")
    ptext.innerHTML = element
    atag.appendChild(ptext)

    document.getElementById('history-list').appendChild(historyNode)
}
