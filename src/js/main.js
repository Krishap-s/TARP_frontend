// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import sign_up from './sign_up';
import login from './login'

var signup_button = document.getElementById("sign_up")

if (signup_button != null){
    signup_button.onclick = (e) => {
        e.preventDefault()
        sign_up()
    }
}

var login_button = document.getElementById("login")

if(login_button != null ){
    login_button.onclick = (e) => {
        e.preventDefault()
        login()
    }
}