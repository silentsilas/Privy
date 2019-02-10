import Words from '../Words.js';
import Entropy from '../Entropy.js';

export default class {
  constructor({output: output, genBtn: genBtn}) {
    this.output = output;
    this.genBtn = genBtn;
    this.wordsSlider;
    this.wordsSliderId = 'words';

    this.wordsLengthEl;
    this.wordsLengthId = 'totalWordsOutput';

    this.totalWords;

    this.phraseSlider;
    this.phraseSliderId = 'phraseLength';

    this.phraseOutputId = 'phraseLengthOutput';
    this.phraseOutputEl;
    this.phraseLength = 4;

    this.min = 1;
    this.max = 31;
    this.content = `
      <div class="slider" id="${this.wordsSliderId}"></div>
      <span id="${this.wordsLengthId}"></span>
      <div class="slider" id="${this.phraseSliderId}"></div>
      <span id="${this.phraseOutputId}"></span>
    `
  }

  setup() {
    document.querySelector("#settings").innerHTML = this.content;
    this.wordsSlider = document.getElementById(this.wordsSliderId);
    this.wordsLengthEl = document.getElementById(this.wordsLengthId);

    noUiSlider.create(this.wordsSlider, {
        start: [4, 31],
        connect: true,
        range: {
            'min': 1,
            'max': 31
        }
    });

    this.phraseSlider = document.getElementById(this.phraseSliderId);
    this.phraseOutputEl = document.getElementById(this.phraseOutputId);
    noUiSlider.create(this.phraseSlider, {
      start: [5],
      connect: false,
      range: {
        'min': 1,
        'max': 10
      }
    });

    this.words = new Words();
    this.wordsSlider.noUiSlider.on('update', (values, handle) => {
      this.min = Math.round(values[0]);
      this.max = Math.round(values[1]);
      this.totalWords = 0;
      for (let idx = this.min - 1; idx < this.max; idx++) {
        this.totalWords += this.words.wordLengths[idx];
      }
      this.wordsLengthEl.innerHTML = `
      Characters Per Word: ${this.min} - ${this.max}<br /> 
      Total Words: ${this.totalWords}`;
    });
    
    this.phraseSlider.noUiSlider.on('update', (values) => {
      this.phraseLength = Math.round(values[0]);
      this.phraseOutputEl.innerHTML = `
      # of Words in Phrase: ${this.phraseLength}
      `;
    });
    this.generatePassphrase = this.generatePassphrase.bind(this);
    this.genBtn.addEventListener('click', this.generatePassphrase);
  }

  destroy() {
    this.genBtn.removeEventListener('click', this.generatePassphrase);
  }

  generatePassphrase() {
    this.output.innerHTML = '';

    // we'll go through and concat all of our words into one array to choose from
    let validWordsArr = [];
    for (let idx = this.min; idx < this.max; idx++) {
      validWordsArr.push(this.words.wordLists[idx]);
    }
    const validWords = Array.prototype.concat.apply([], validWordsArr);

    // create an array of cryptographically-random values
    const random = new Uint32Array(this.phraseLength);
    window.crypto.getRandomValues(random);

    // now we create the password string
    let passphrase = '';
    for (let idx = 0; idx < this.phraseLength; idx++) {
      const validIdx = random[idx] % validWords.length;
      passphrase += validWords[validIdx] + " ";
    }
    this.output.innerHTML += `${passphrase}<br><br>`;

    Entropy.calculateEntropy(this.output, this.totalWords, this.phraseLength);
  }
}
