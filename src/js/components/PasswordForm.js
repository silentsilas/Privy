import Settings from './PasswordSettings.js';
import Entropy from '../Entropy.js';

export default class {
  constructor({output: output, genBtn: genBtn}) {
    this.output = output;
    this.genBtn = genBtn;
    this.uppercaseId = 'uppercase';
    this.uppercaseEl;
    this.lowercaseId = 'lowercase';
    this.lowercaseEl;
    this.digitsId = 'digits';
    this.digitsEl;
    this.charLengthId = 'passwordLength';
    this.charLengthEl;
    this.charLength = 16;
    this.charLengthOutputId = 'passwordLengthOutput';
    this.charLengthOutputEl;
    this.content = `
    <label>
      <input class="nes-checkbox" type="checkbox" id="${this.uppercaseId}" checked></input>
      <span>Uppercase</span>
    </label>
    
    <label>
      <input class="nes-checkbox" type="checkbox" id="${this.lowercaseId}" checked></input>
      <span>Lowercase</span>
    </label>
    
    <label>
      <input class="nes-checkbox" type="checkbox" id="${this.digitsId}" checked></input>
      <span>Digits</span>
    </label>
    <div class="slider" id="${this.charLengthId}"></div>
    Length: <span id="${this.charLengthOutputId}">16</span>
    `
  }

  setup() {
    document.querySelector("#settings").innerHTML = this.content;
    this.uppercaseEl = document.getElementById(this.uppercaseId);
    this.lowercaseEl = document.getElementById(this.lowercaseId);
    this.digitsEl = document.getElementById(this.digitsId);
    this.charLengthEl = document.getElementById(this.charLengthId);
    this.charLengthOutputEl = document.getElementById(this.charLengthOutputId);

    noUiSlider.create(this.charLengthEl, {
        start: [this.charLength],
        range: {
            'min': [1],
            'max': [64]
        }
    });

    this.charLengthEl.noUiSlider.on('update', (values, handle) => {
      const newVal = Math.round(values[0]);
      this.charLengthOutputEl.innerHTML = newVal;
      this.charLength = newVal;
    });
    console.log(this.charLengthEl);

    this.generatePassword = this.generatePassword.bind(this);
    this.genBtn.addEventListener('click', this.generatePassword);
    
  }

  destroy() {
    this.genBtn.removeEventListener('click', this.generatePassword);
  }

  // we'll check the state of our checkboxes and update our Settings obj accordingly
  updateSettings() {
    Settings.uppercase.allowed = this.uppercaseEl.checked;
    Settings.lowercase.allowed = this.lowercaseEl.checked;
    Settings.digits.allowed = this.digitsEl.checked;
    Settings.password_length = this.charLength;
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

    let range = 0;
    range += Settings.uppercase.allowed ? Settings.uppercase.COUNT : 0;
    range += Settings.lowercase.allowed ? Settings.lowercase.COUNT : 0;
    range += Settings.digits.allowed ? Settings.digits.COUNT : 0;

    Entropy.calculateEntropy(this.output, range, Settings.password_length);
  }

};
