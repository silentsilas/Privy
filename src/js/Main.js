import Settings from './Settings.js';
import Entropy from './Entropy.js';
import Words from './Words.js';

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
        this.words = new Words();
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

        Entropy.calculateEntropy(this.output);
    }


}
