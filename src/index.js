import './scss/styles.scss';
import Main from './js/Main.js';

const resultsDiv = document.querySelector("#results");
const generateBtn = document.querySelector("#generate");
const passwordRadio = document.querySelector("#word");
const passphraseRadio = document.querySelector("#phrase");

if (window.crypto == null) {
    let errorMsg = "Browser does not support Crypto Web API";
    resultsDiv.innerHTML = errorMsg;
    throw new Error(errorMsg);
}

const app = new Main({
    output: resultsDiv,
    genBtn: generateBtn,
    wordRadio: passwordRadio,
    phraseRadio: passphraseRadio
});
