import './scss/styles.scss';
import Main from './js/Main.js';

const resultsDiv = document.querySelector("#results");
const uppercaseEl = document.querySelector("#uppercase");
const lowercaseEl = document.querySelector("#lowercase");
const digitsEl = document.querySelector("#digits");
const lengthEl = document.querySelector("#length");
const lengthElOutput = document.querySelector("#lengthOutput");
const generateBtn = document.querySelector("#generate");

if (window.crypto == null) {
    let errorMsg = "Browser does not support Crypto Web API";
    resultsDiv.innerHTML = errorMsg;
    throw new Error(errorMsg);
}

const app = new Main({
    output: resultsDiv,
    uppercaseEl: uppercaseEl,
    lowercaseEl: lowercaseEl,
    digitsEl: digitsEl,
    lengthEl: lengthEl,
    lengthElOutput: lengthElOutput
});

generateBtn.addEventListener('click', (event) => {
    app.generatePassword();
});
