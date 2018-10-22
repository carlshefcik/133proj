$(document).ready(() => {
    console.log('ready')

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

    $('#loginButton').click((e)=>{
        console.log('login')
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
    
    // // when the button is clicked sends an ajax request to express to retrive data
    // $('#signUpButton').click((e)=>{
    //     console.log('hello')
    //     e.preventDefault();
    //     let info = {
    //         username: document.getElementById('signUpEmail').value,
    //         password: document.getElementById('signUpPassword').value
    //     }
        
    //     $.ajax({
    //         url: '/register_user',
    //         type: 'POST',
    //         datatype: 'json',
    //         data: info,
    //         success: (data) =>{
    //             console.log(data) // log data to console
    //             console.log(info);
    //         }
    //     })
        
    //     console.log("good");
    // })


});
 