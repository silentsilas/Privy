import Settings from './Settings.js';

export default class {
    constructor({output, uppercaseEl, lowercaseEl, digitsEl}) {
        this.output = output;
        this.uppercaseEl = uppercaseEl;
        this.lowercaseEl = lowercaseEl;
        this.digitsEl = digitsEl;
    }

    getAllowedChars() {
        let allowed = [];

        // check state of our checkboxes
        allowed = this.uppercaseEl.checked ? allowed.concat(Settings.uppercase.UNICODES) : allowed;
        allowed = this.lowercaseEl.checked ? allowed.concat(Settings.lowercase.UNICODES) : allowed;
        allowed = this.digitsEl.checked ? allowed.concat(Settings.digits.UNICODES) : allowed;

        // if no checkboxes were checked, then we have no unicode values to choose from
        if (allowed.length <= 0) {
            let errorMsg = "Must enable at least one type of character.";
            this.output.innerHTML = errorMsg;
            throw new Error(errorMsg);
        }
        return allowed;
    }

    generatePassword() {
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
        this.output.innerHTML = password;
    }

}