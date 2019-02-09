const readline = require('readline');
const fs = require('fs');

const args = process.argv.slice(2);
let length = 0;
let output = `words_${length}.json`;

// parse out the arguments
args.forEach((val, index) => {
  if (index == 0) {
    // this should be the length we're looking for
    length = val;
    output = `words_${length}.json`;
  }
  if (index == 1) {
    // custom output filename
    output = val;
  }
});

// we'll keep the words of our given length here
let newWords = [];
let longestLength = 0;
const rl = readline.createInterface({
  input: fs.createReadStream('words_alpha.txt')
});

rl.on('line', (input) => {
  if (input.length == length) {
    newWords.push(input);
  }
  if (input.length > longestLength) {
    longestLength = input.length;
  }
});

rl.on('close', () => {
  fs.writeFileSync(output, JSON.stringify(newWords));
});
