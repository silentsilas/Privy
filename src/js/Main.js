import Settings from './Settings.js';
const zxcvbn = require('zxcvbn');

export default class {
    constructor({output, uppercaseEl, lowercaseEl, digitsEl, lengthEl, lengthElOutput}) {
        this.output = output;
        this.uppercaseEl = uppercaseEl;
        this.lowercaseEl = lowercaseEl;
        this.digitsEl = digitsEl;
        this.lengthEl = lengthEl;
        this.lengthElOutput = lengthElOutput;

        this.lengthEl.addEventListener('input', () => {
            this.lengthElOutput.innerHTML = this.lengthEl.value;
        });
        console.log(zxcvbn);
    }

    // we'll check the state of our checkboxes and update our Settings obj accordingly
    updateSettings() {
        Settings.uppercase.allowed = this.uppercaseEl.checked;
        Settings.lowercase.allowed = this.lowercaseEl.checked;
        Settings.digits.allowed = this.digitsEl.checked;
        Settings.password_length = this.lengthEl.value;
    }

    getAllowedChars() {
        // build up our array of allowed Unicode values
        let allowed = [];
        allowed = Settings.uppercase.allowed ? allowed.concat(Settings.uppercase.UNICODES) : allowed;
        allowed = Settings.lowercase.allowed ? allowed.concat(Settings.lowercase.UNICODES) : allowed;
        allowed = Settings.digits.allowed ? allowed.concat(Settings.digits.UNICODES) : allowed;

        // if no checkboxes were checked, then we have no unicode values to choose from
        if (allowed.length <= 0) {
            let errorMsg = "Must enable at least one type of character.";
            this.output.innerHTML = errorMsg;
            throw new Error(errorMsg);
        }
        return allowed;
    }

    
    calculateEntropy(password) {
        let range = 0;
        range += Settings.uppercase.allowed ? Settings.uppercase.COUNT : 0;
        range += Settings.lowercase.allowed ? Settings.lowercase.COUNT : 0;
        range += Settings.digits.allowed ? Settings.digits.COUNT : 0;
        this.output.innerHTML += `Unique Characters: ${range}<br>`;

        const entropyPerCharacter = Math.log2(range);
        const combinations = Math.pow(range, Settings.password_length);
        this.output.innerHTML += `Total Password Combinations: ${combinations}<br>`;
        const totalEntropy = entropyPerCharacter * Settings.password_length;
        this.output.innerHTML += `Entropy: ${totalEntropy}<br><br>`;
        const richguy = 100000000000;
        this.output.innerHTML += `Hours for a rich guy to crack it: guaranteed at ${combinations / richguy / 60 / 60}, averaged at ${combinations / richguy / 60 / 60 / 2}<br>`;

        const richcompany = 1000000000000;
        this.output.innerHTML += `Hours for a rich company to crack it: guaranteed at ${combinations / richcompany / 60 / 60}, averaged at ${combinations / richcompany / 60 / 60 / 2}<br>`;

        const richstate = 100000000000000;
        this.output.innerHTML += `Hours for a rich state to crack it: guaranteed at ${combinations / richstate / 60 / 60}, averaged at ${combinations / richstate / 60 / 60 / 2}<br>`;

        this.output.innerHTML += '<br>Going by this chart: <a href="http://i.imgur.com/e3mGIFY.png">http://i.imgur.com/e3mGIFY.png</a><br><br>';
        console.log(Math.log2(100000) * 4);
    }

    generatePassword() {
        this.output.innerHTML = '';
        this.updateSettings();
        
        // get our array of valid unicode values that we can choose from
        const allowedChars = this.getAllowedChars();

        // create an array of cryptographically-random values
        const random = new Uint8Array(Settings.password_length);
        window.crypto.getRandomValues(random);

        // now we create the password string
        let password = '';
        for (let idx = 0; idx < Settings.password_length; idx++) {
            // use the next random value to choose a unicode character
            const validIdx = random[idx] % allowedChars.length
            password += String.fromCharCode(allowedChars[validIdx]);
        }
        this.output.innerHTML += `${password}<br><br>`;

        this.calculateEntropy(password);
    }


}