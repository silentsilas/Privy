let wordLists = [];
for (let idx = 1; idx < 32; idx++) {
  wordLists.push(
    require(`../words/words_${idx}.json`)
  );
}

export default class {
  constructor() {
    console.log(wordLists);
  }
}
