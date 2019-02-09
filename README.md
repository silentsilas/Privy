TODO:
- [x] Ability to set required length of generated password.
- [ ] Ability to set required minimum for a certain character type to appear.
- [ ] Add common symbols to list of character types.
- [ ] Tally up the total search space, and show the calculations to derive entropy of generated password.
- [ ] Add XKCD-style passwords

## Json Wordlist Generator
Inside `json_gen`, you'll find `create_list.js`. You can give it a wordlist (right now I have it hardcoded to use the words_alpha.txt file in the same directory). 

`node create_list.js [char_length]`

Thus, `node create_list.js 4` will create a `words_4.json` file full of every word with a character length of 4.

I got the wordlist from here: https://github.com/dwyl/english-words/blob/master/words_alpha.txt
