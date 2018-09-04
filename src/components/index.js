$(document).ready(() => {
    console.log('index loaded');

    document.getElementById("login-button").addEventListener('click', function(e){
        console.log('clicked');
        document.getElementById('status').innerHTML = "Hello, the button only displays this.";
    });
});
