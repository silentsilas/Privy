let wordLists = [];
let wordLengths = [];
for (let idx = 1; idx < 32; idx++) {
  wordLists.push(
    require(`../words/words_${idx}.json`)
  );
  // for performance reasons, we'll keep track of how many words
  // are found for each character length
  wordLengths.push(wordLists[idx-1].length);
}

export default class {
  constructor() {
    console.log(wordLists);
    this.wordLengths = wordLengths;
  }
}
