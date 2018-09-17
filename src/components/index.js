$(document).ready(() => {

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
        window.location='register.html'
    });
});
