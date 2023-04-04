// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import sign_up from './sign_up';

document.getElementById("sign_up").onclick = (e) => {
    e.preventDefault()
    sign_up()
}