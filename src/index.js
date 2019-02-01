import './scss/styles.scss';
import Main from './js/Main.js';

const debugDiv = document.querySelector("#debug");
const uppercaseEl = document.querySelector("#uppercase");
const lowercaseEl = document.querySelector("#lowercase");
const digitsEl = document.querySelector("#digits");
const generateBtn = document.querySelector("#generate");

if (window.crypto == null) {
    let errorMsg = "Browser does not support Crypto Web API";
    debugDiv.innerHTML = errorMsg;
    throw new Error(errorMsg);
}

const app = new Main({
    output: debugDiv,
    uppercaseEl: uppercaseEl,
    lowercaseEl: lowercaseEl,
    digitsEl: digitsEl
});

generateBtn.addEventListener('click', (event) => {
    app.generatePassword();
});
