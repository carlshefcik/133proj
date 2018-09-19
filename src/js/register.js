$(document).ready(() => {

    // when the button is clicked sends an ajax request to express to retrive data
    $('#test').click((e)=>{
        let info = [document.getElementById('email'),
                    document.getElementById('password')];
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