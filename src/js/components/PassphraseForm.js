import Words from '../Words.js';

export default class {
  constructor({output: output, genBtn: genBtn}) {
    this.output = output;
    this.genBtn = genBtn;
    this.wordsSliderId = 'words';
    this.wordsLengthId = 'totalWordsOutput';
    this.content = `
      <div id="${this.wordsSliderId}"></div>
      <span id="${this.wordsLengthId}"></span>
    `
  }

  setup() {
    document.querySelector("#settings").innerHTML = this.content;
    this.wordsSlider = document.getElementById(this.wordsSliderId);
    this.wordsLength = document.getElementById(this.wordsLengthId);

    noUiSlider.create(this.wordsSlider, {
        start: [4, 31],
        connect: true,
        range: {
            'min': 1,
            'max': 31
        }
    });
    this.words = new Words();
    this.wordsSlider.noUiSlider.on('update', (values, handle) => {
      const min = Math.round(values[0]);
      const max = Math.round(values[1]);
      let totalWords = 0;
      for (let idx = min - 1; idx < max; idx++) {
        totalWords += this.words.wordLengths[idx];
      }
      this.wordsLength.innerHTML = `
      Characters: ${min} - ${max}<br /> 
      Total Words: ${totalWords}`;
    }); 
    this.generatePassword = this.generatePassword.bind(this);
    this.genBtn.addEventListener('click', this.generatePassword);
  }

  destroy() {
    this.genBtn.removeEventListener('click', this.generatePassword);
  }

  generatePassword() {

  }
}
