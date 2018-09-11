$(document).ready(() => {

    // when the button is clicked sends an ajax request to express to retrive data
    $('#get-sale-btn').click((e)=>{
        $.ajax({
            url: '/get_sales',
            type: 'GET',
            datatype: 'json',
            success: (data) =>{
                console.log("test for sale" + data) // log data to console
                let items = []; // create temp array
                data.forEach((e) => {
                    items.push(""+e.item +" on sale for "+ e.percent + "% off") // parses json and 
                });
                document.getElementById('sales').innerText = items; // sets the items in the document
            }
        })
    })

    // Test for get inventory buttoon
    $('#get-inventory-btn').click((e)=>{
        $.ajax({
            url: '/get_inventory',
            type: 'GET',
            datatype: 'json',
            success: (data) =>{
                console.log("test for data" + data) // log data to console
                let items = []; // create temp array
                data.forEach((e) => {
                    console.log("test here" + e);
                    items.push(e.name + " " + e.desc + " " + e.exp) // parses json and 
                });
                document.getElementById('test').innerText = items; // sets the items in the document
            }
        })
    })
});
