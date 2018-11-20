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
    var dynamicContent = getParameterByName('aisle');
    console.log(dynamicContent)

    document.getElementById('group-name').innerHTML = "Items for "+ dynamicContent + " aisle:"

    loadItems(dynamicContent)
})

function loadItems(groupName){
    $.ajax({
        url: '/load_items',
        type: 'Get',
        datatype: 'json',
        data: groupName,
        success: (data) =>{
            console.log(data)
            data.forEach(element => {
                addElement(element)
            });
        }
    })
}

//creates an appropriate aisle element from the given aisle element
function addElement(element){
    let aisleNode = document.createElement("div")
    aisleNode.classList.add("col-sm-6")
    aisleNode.classList.add("col-md-3")

    let atag = document.createElement("a")
    atag.href = ""
    aisleNode.appendChild(atag)

    // let image = document.createElement("img")
    // image.classList.add("aisle-img")
    // image.src = element[1]
    // atag.appendChild(image)

    let ptext = document.createElement("p")
    ptext.innerHTML = element
    atag.appendChild(ptext)

    document.getElementById('item-list').appendChild(aisleNode)
}
