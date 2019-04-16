const wordLists: string[] = [];
const wordLengths: number[] = [];
for (let idx = 1; idx < 32; idx++) {
    wordLists.push(
        require(`@/assets/words_${idx}.json`),
    );
    // for performance reasons, we'll keep track of how many words
    // are found for each character length
    wordLengths.push(wordLists[idx - 1].length);
}

export default class Words {
    public wordLists: string[];
    public wordLengths: number[];
    constructor() {
        this.wordLists = wordLists;
        this.wordLengths = wordLengths;
    }
}
