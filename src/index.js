import './scss/styles.scss';

import Main from './js/Main.js';

if (window.crypto == null) {
    throw new Exception("Browser does not support Crypto Web API");
}
const debugDiv = document.querySelector("#debug");
const app = new Main({output: debugDiv});
app.generatePassword();

// for (var i = 0; i < array.length; i++) {

//     debugDiv.innerHTML += String.fromCharCode(charCode) +", ";
// }


