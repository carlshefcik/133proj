$(document).ready(() => {

    loadSaleItems()
    $('#nav-bar').load('/nav-bar.html');
    $('#page-footer').load('/page-footer.html');

    // when the button is clicked sends an ajax request to express to retrive data
    $('#get-sale-btn').click((e)=>{
        $.ajax({
            url: '/get_sales',
            type: 'GET',
            datatype: 'json',
            success: (data) =>{
                console.log(data) // log data to console
                let items = []; // create temp array
                data.forEach((e) => {
                    items.push("" + e.item + " on sale for " + e.percent + "% off") // parses json and
                });
                document.getElementById('sales').innerText = items; // sets the items in the document
            }
        })
    })
});

$(function(){
    $('#registerButton').click(function(){
        window.location='../register.html'
    });
});

function loadSaleItems(){
    $.ajax({
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
    let containerFluid = document.createElement("div")

    let row = document.createElement("div")
    row.classList.add("row")
    row.classList.add("flex-row")
    row.classList.add("flex-nowrap")
    row.classList.add("align-items-center")
    containerFluid.appendChild(row)

    let thumbnail = document.createElement("div")
    row.appendChild(thumbnail)

    let atag = document.createElement("a")
    atag.href = "/item.html?id="+element[0]
    thumbnail.append(atag)

    let image = document.createElement("img")
    image.classList.add("aisle-img")
    image.src = element[1]
    atag.appendChild(image)

    let ptext = document.createElement("p")
    ptext.innerHTML = element[0]
    atag.appendChild(ptext)

    document.getElementById('MeatScrollBar').appendChild(aisleNode)
}


$(function(){
    $('#loginButton').click(function(event){
        event.preventDefault();
        console.log($("#inputEmail"));
        let info = {
            username: document.getElementById('inputEmail').value,
            password: document.getElementById('inputPassword').value
        }

        $.ajax({
            url: '/login_user',
            type: 'POST',
            datatype: 'json',
            data: info,
            success: (data) =>{           
                $("#user").text(data);
            }
        })
            
        console.log("aye");
    })
    // window.location='../index.html'
    // if logged in
    
});




