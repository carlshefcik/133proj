$(document).ready(() => {

    // when the button is clicked sends an ajax request to express to retrive data
    $('#sendResetLinkButton').click((e)=>{
        let info = {
            requestEmail: document.getElementById('resetEmail').value
        }

        $.ajax({
            url: '/send_reset_password',
            type: 'POST',
            datatype: 'json',
            data: info,
            success: (data) =>{
                console.log("bla bla bla") // log data to console
            }
        })

        console.log("good");
    })

});