$(document).ready(() => {

    // when the button is clicked sends an ajax request to express to retrive data
    $('#register_user').click((e)=>{
        let info = {
            username: document.getElementById('email').value,
            password: document.getElementById('password').value
        }
        
        $.ajax({
            url: '/register_user',
            type: 'POST',
            datatype: 'json',
            data: info,
            success: (data) =>{
                console.log(data) // log data to console
                console.log(info);
            }
        })
        
    console.log("good");     
    })

});