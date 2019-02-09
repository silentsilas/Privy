import PasswordForm from './components/PasswordForm.js';
import Words from './Words.js';
import 'nouislider/distribute/nouislider.css';
import PassphraseForm from './components/PassphraseForm.js';

export default class {
  constructor({output, genBtn, wordRadio, phraseRadio}) {
    this.output = output;
    this.genBtn = genBtn;
    this.wordRadio = wordRadio;
    this.phraseRadio = phraseRadio;

    this.handleWordClick = this.handleWordClick.bind(this);
    this.wordRadio.addEventListener('click', this.handleWordClick);

    this.handlePhraseClick = this.handlePhraseClick.bind(this);
    this.phraseRadio.addEventListener('click', this.handlePhraseClick);

    if (this.wordRadio.checked) {
      this.handleWordClick();
    }
    if (this.phraseRadio.checked) {
      this.handlePhraseClick();
    }
  }

  handleWordClick() {
    if (this.currentForm != null) this.currentForm.destroy();
    this.currentForm = new PasswordForm({output: this.output, genBtn: this.genBtn});
    this.currentForm.setup();
  }

  handlePhraseClick() {
    if (this.currentForm != null) this.currentForm.destroy();
    this.currentForm = new PassphraseForm({output: this.output, genBtn: this.genBtn});
    this.currentForm.setup();
  }
  
}
