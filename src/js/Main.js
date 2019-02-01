import Settings from './Settings.js';

export default class {
    constructor({output}) {
        this.output = output;
        this.randomChars = this.getRandomChars();
        this.allowedChars = this.getSettings();
    }

    getSettings() {
        let allowed = [];
        allowed = Settings.uppercase.allowed ? allowed.concat(Settings.uppercase.UNICODES) : allowed;
        allowed = Settings.lowercase.allowed ? allowed.concat(Settings.lowercase.UNICODES) : allowed;
        allowed = Settings.digits.allowed ? allowed.concat(Settings.digits.UNICODES) : allowed;
        return allowed;
    }

    generatePassword() {
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