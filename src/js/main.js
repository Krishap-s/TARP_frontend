// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import sign_up from './sign_up';
import login from './login'
import upload from './upload'
import download from './download';

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

var upload_button = document.getElementById("upload")

if(upload_button != null){
    upload_button.onclick = (e) => {
        e.preventDefault()
        upload()
    }
}

var download_button = document.getElementById("download")

if(download_button != null){
    download_button.onclick = (e) => {
        e.preventDefault()
        download()
    }
}