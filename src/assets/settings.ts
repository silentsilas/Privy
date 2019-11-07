// https://www.ssec.wisc.edu/~tomw/java/unicode.html#x0000
const unicodes = new Map();
unicodes.set(33,`!`); 
unicodes.set(35, `#`);
unicodes.set(36, `$`);
unicodes.set(37, `%`);
unicodes.set(38, `&`);
unicodes.set(40, `(`);
unicodes.set(41, `)`);
unicodes.set(43, `+`);
unicodes.set(45, `-`);
unicodes.set(46, `.`);
unicodes.set(47, `/`);
unicodes.set(58, `:`);
unicodes.set(59, `;`);
unicodes.set(60, `&lt;`);
unicodes.set(61, `=`);
unicodes.set(62, `&gt;`);
unicodes.set(63, `?`);
unicodes.set(64, `@`);
unicodes.set(91, `[`);
unicodes.set(92, `\\`);
unicodes.set(93, `]`);
unicodes.set(94, `^`);
unicodes.set(95, `_`);
unicodes.set(123, `{`);
unicodes.set(124, `|`);
unicodes.set(125, `}`);
unicodes.set(126, `~`);

export default {
  password_length: 10,
  uppercase: {
    allowed: true,
    COUNT: 26,
    UNICODES: [
      65, 66, 67, 68, 69, 70,
      71, 72, 73, 74, 75, 76,
      77, 78, 79, 80, 81, 82,
      83, 84, 85, 86, 87, 88,
      89, 90,
    ],
  },
  lowercase: {
    allowed: true,
    COUNT: 26,
    UNICODES: [
      97, 98, 99, 100, 101, 102,
      103, 104, 105, 106, 107, 108,
      109, 110, 111, 112, 113, 114,
      115, 116, 117, 118, 119, 120,
      121, 122,
    ],
  },
  digits: {
    allowed: true,
    COUNT: 10,
    UNICODES: [
      48, 49, 50, 51, 52,
      53, 54, 55, 56, 57,
    ],
  },
  curly_brackets: {
    allowed: false,
    COUNT: 2,
    UNICODES: [
      123, 125,
    ],
  },
  tilde: {
    allowed: false,
    COUNT: 1,
    UNICODES: [
      126,
    ],
  },
  carrot: {
    allowed: false,
    COUNT: 1,
    UNICODES: [
      94,
    ],
  },
  square_brackets: {
    allowed: false,
    COUNT: 2,
    UNICODES: [
      91, 93,
    ],
  },
  backwards_slash: {
    allowed: false,
    COUNT: 2,
    UNICODES: [
      92,
    ],
  },
  at: {
    allowed: false,
    COUNT: 1,
    UNICODES: [
      64,
    ],
  },
  punctuation: {
    allowed: false,
    UNICODES: unicodes
  },
};
