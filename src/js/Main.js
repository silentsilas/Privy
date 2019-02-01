import Settings from './Settings.js';

export default class {
    constructor({output, uppercaseEl, lowercaseEl, digitsEl}) {
        this.output = output;
        this.uppercaseEl = uppercaseEl;
        this.lowercaseEl = lowercaseEl;
        this.digitsEl = digitsEl;
        
        this.randomChars;
        this.allowedChars;
    }

    getSettings() {
        let allowed = [];
        allowed = this.uppercaseEl.checked ? allowed.concat(Settings.uppercase.UNICODES) : allowed;
        allowed = this.lowercaseEl.checked ? allowed.concat(Settings.lowercase.UNICODES) : allowed;
        allowed = this.digitsEl.checked ? allowed.concat(Settings.digits.UNICODES) : allowed;
        if (allowed.length <= 0) {
            let errorMsg = "Must enable at least one type of character.";
            this.output.innerHTML = errorMsg;
            throw new Error(errorMsg);
        }
        return allowed;
    }

    generatePassword() {
        // get our array of valid unicode values that we can choose from
        this.allowedChars = this.getSettings();

        // create an array of cryptographically-random values
        this.random = new Uint8Array(Settings.password_length);
        window.crypto.getRandomValues(this.random);

        // now we create the password string
        let password = '';
        for (let idx = 0; idx < Settings.password_length; idx++) {
            // use the next random value to choose a unicode character
            const validIdx = this.random[idx] % this.allowedChars.length
            password += String.fromCharCode(this.allowedChars[validIdx]);
        }
        this.output.innerHTML = password;
    }

}