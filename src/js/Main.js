import Settings from './Settings.js';

export default class {
    constructor({output, uppercaseEl, lowercaseEl, digitsEl}) {
        this.output = output;
        this.uppercaseEl = uppercaseEl;
        this.lowercaseEl = lowercaseEl;
        this.digitsEl = digitsEl;
        
        this.randomChars = this.getRandomChars();
        this.allowedChars = this.getSettings();
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
        this.allowedChars = this.getSettings();
        let password = '';
        while(password.length != Settings.password_length) {
            password += String.fromCharCode(this.getValidChar());
        }
        this.output.innerHTML = password;
    }

    getValidChar() {
        
        for (var i = 0; i < this.randomChars.length; i++) {
            let char = this.randomChars[i];
            let index = this.allowedChars.findIndex((element) => {
                return element == char;
            });
            if (index != -1) {
                this.randomChars[i] = -1;
                return this.allowedChars[index];
            }
        }

        // we must have failed
        // so go about it again
        this.randomChars = this.getRandomChars();
        return this.getValidChar();
    }

    getRandomChars() {
        let array = new Uint8Array(10);
        window.crypto.getRandomValues(array);
    
        for (var i = 0; i < array.length; i++) {
            array[1] = (array[i] % (Settings.UNICODE_MAX - Settings.UNICODE_MIN) ) + Settings.UNICODE_MIN;
        }
        return array;
    }
}