import bigInt, { BigIntegerStatic, BigInteger } from 'big-integer';
import wait from './wait';
import { AES, AESMessage } from './aes';

export class RSATest {
  private testMessage: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut gravida efficitur tellus eget pulvinar. Donec vel vestibulum sem, vel porta ligula. Sed iaculis in justo non lobortis. Nullam ullamcorper non ante a pretium. Cras gravida mauris ut dapibus suscipit. Donec tincidunt auctor suscipit. Curabitur sed urna tempus, tristique nisi iaculis, viverra dolor. Cras consequat congue faucibus. Curabitur efficitur mauris non nulla lobortis, in accumsan elit vestibulum. Integer sollicitudin sem in cursus pellentesque.
  Duis at quam felis. Sed tincidunt lacus id convallis lobortis. Etiam maximus urna vel eleifend hendrerit. Vivamus semper, sem sit amet dignissim vehicula, orci erat convallis massa, vitae fringilla purus urna sed felis. Aenean ullamcorper lacus sed turpis venenatis, in consectetur sem faucibus. Pellentesque mattis dui ac mi blandit, maximus sagittis justo tempor. Aenean dictum pretium odio a egestas. Duis pulvinar leo in imperdiet fermentum. Praesent eu metus eu nunc tristique accumsan. Quisque interdum, quam quis pretium mollis, elit nisl mattis nibh, at ultrices nisl sem ut ligula. Sed quis auctor risus. Etiam scelerisque, enim et aliquet bibendum, libero justo pretium sapien, ut rhoncus mauris risus ac tortor.
  Nulla in velit a nibh accumsan venenatis quis quis lacus. Phasellus a velit purus. Nunc placerat nisi ut purus venenatis consectetur. Donec porttitor eleifend elit ut dignissim. Vivamus id diam velit. Sed auctor orci vitae mauris ultricies aliquam. Etiam ut venenatis arcu, at gravida ligula. Donec sit amet mi fringilla, pellentesque neque ut, pretium leo. Aliquam sed laoreet lorem. Fusce convallis condimentum lorem, dapibus elementum mi. Nulla volutpat in purus luctus condimentum. Ut interdum, velit in mattis mollis, turpis odio eleifend dolor, vel aliquam risus ex eget quam. Nam vitae pulvinar dolor. Sed non fringilla lacus. Praesent non felis eget massa mattis iaculis. Nam non luctus lectus, et efficitur neque.
  Phasellus tortor erat, facilisis semper rhoncus a, tempor in nisl. Vestibulum interdum ipsum nec justo pretium laoreet. Cras eget rutrum est. Nunc malesuada nulla id dignissim pharetra. Ut ornare fermentum lacus, mollis consequat elit fermentum quis. Vestibulum vehicula magna vel neque lacinia venenatis. Sed mollis vel est sit amet viverra. Nullam nec consequat augue, a consectetur arcu. Integer vulputate dui dui, semper ultrices nisi tincidunt sit amet. In tristique tortor ut turpis iaculis luctus. Nam vitae ligula a mi iaculis lacinia id non nisi.
  In rutrum, elit a dictum eleifend, magna ante eleifend lectus, at gravida nulla dolor quis ex. Integer nec libero ac tellus vulputate accumsan. Nam a maximus lacus. Vivamus quis erat ornare, consequat lorem a, lobortis lectus. Nam blandit eros at metus ornare, vitae efficitur lectus lacinia. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam massa sem, tristique at posuere vel, gravida in lorem.`;

  constructor() {
    this.test();
  }

  async test() {
    const crypto = window.crypto;
    const alice = await new RSA(128).generate();
    const bob = await new RSA(128).generate();
    const key = await AES.generateKey();

    const rawKey = await crypto.subtle.exportKey("raw", key);
  
    // try to pass the key
    // notice we use alice's decrypt method. That applies her secret private key to it
    const encryptedKey = RSA.ApplyKey(
      // encrypt takes a big integer, so convert our raw binary key to one
      RSA.uint8ArrayToBigInteger(
        new Uint8Array(rawKey)
      ),
      alice.privateKey,
      alice.n
    );

    // now we send the encrypted key over a public channel to bob
    // he uses alice's public key and public exponent to decrypt it
    const decryptedKey = RSA.ApplyKey(encryptedKey, alice.publicKey, alice.n);

    // we have the key as a biginteger, so convert to uint8array to import it
    const decryptedKeyBuffer = RSA.bigIntegerToUint8Array(
      decryptedKey
    );
    const sharedKey = await crypto.subtle.importKey(
      "raw", 
      decryptedKeyBuffer, 
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );

    console.log(sharedKey);
    console.log("The above should be the same");

    const encryptedMessage: AESMessage = await AES.encryptMessage(this.testMessage, sharedKey);
    const decryptedMessage: string = await AES.decryptMessage(encryptedMessage, sharedKey);

    console.log(decryptedMessage);

  }
}

export class RSA {
  public publicKey: BigInteger = bigInt(0);
  public privateKey: BigInteger = bigInt(0);
  public generatedPrimes: boolean = false;
  // to see how long prime generation is taking
  public primeTime: number = 0;
  public primeIterations: number = 0;
  // the exponent that we share alongside our key
  public get n(): BigInteger {
    return this.p.times( this.q );
  }
  public bits!: number;
  private p: BigInteger = bigInt(0);
  private q: BigInteger = bigInt(0);

  private get phi(): BigInteger {
    return ( this.p.subtract(1) ).times( (this.q.subtract(1)) );
  }

  constructor(primeBits: number) {
    this.bits = primeBits;
  }

  public async generate(): Promise<RSA> {
    await this.calculatePrimes();
    this.calculatePublic();
    this.calculatePrivate();
    return this;
  }

  public encrypt(encodedText: BigInteger): BigInteger {
    return RSA.ApplyKey(encodedText, this.publicKey, this.n);
  }

  public decrypt(ciphertext: BigInteger): BigInteger {
    return RSA.ApplyKey(ciphertext, this.privateKey, this.n);
  }

  public static ApplyKey(message: BigInteger, key: BigInteger, exponent: BigInteger) : BigInteger {
    return bigInt(message).modPow(key, exponent);
  }

  private async findPrime(bitLength: number): Promise<BigInteger> {
    
    let isPrime = false;
    let prime;
    while (!isPrime) {
        prime = this.generate_prime_candidate(bitLength);
        isPrime = prime.isPrime(); //16);
        this.primeIterations++;
    }

    if (prime === undefined) {
      // this should never happen, but just to make typescript happy we'll check it
      throw new Error("We could not find a prime within the given parameters");
    }

    return prime;
  }

  private generate_prime_candidate(bitLength: number): BigInteger {
    // randomly generate an odd integer
    let maxBits = bigInt[2].pow(bitLength);
    let minBits = bigInt[2].pow(bitLength -1).add(1);
    let p = bigInt.randBetween(minBits, maxBits);

    // p |= (1 << length - 1) | 1
    // apply mask to set most & least significant bit to 1
    let bitMask = bigInt(1).shiftLeft(bitLength - 1).or(1);
    return p.or( bitMask );
  }
    
  public async calculatePrimes(): Promise<void> {
    let theyMatch = true;
    while (theyMatch) {

      let startTime = Date.now();
      this.p = await this.findPrime(this.bits);
      this.primeTime += Date.now() - startTime;

      await wait(300);

      startTime = Date.now();
      this.q = await this.findPrime(this.bits);
      this.primeTime +=  Date.now() - startTime;

      // we can't choose the same two prime numbers
      theyMatch = this.p.compare(this.q) === 0;
    }

    this.generatedPrimes = true;
  }

  public calculatePublic(): void {
    // Choose an integer e such that e and phi(n) are coprime
    let e = bigInt.randBetween(this.phi, bigInt.one);

    // Use Euclid's Algorithm to verify that e and phi(n) are comprime
    let tempGcd = bigInt.gcd(e, this.phi);
    while (!tempGcd.equals(1)) {
        e = bigInt.randBetween(this.phi, bigInt.one);
        tempGcd = bigInt.gcd(e, this.phi);
    }

    this.publicKey = e;
  }

  public calculatePrivate(): void {
    let eGcd = this.publicKey.modInv(this.phi);
    this.privateKey = eGcd;
  }

  public static bigIntegerToUint8Array(bn: BigInteger): Uint8Array {
    var hex = bigInt(bn).toString(16);
    if (hex.length % 2) { hex = '0' + hex; }
  
    var len = hex.length / 2;
    var u8 = new Uint8Array(len);
  
    var i = 0;
    var j = 0;
    while (i < len) {
      u8[i] = parseInt(hex.slice(j, j+2), 16);
      i += 1;
      j += 2;
    }
  
    return u8;
  }

  public static uint8ArrayToBigInteger(buf: Uint8Array): BigInteger {
    var hex: string[] = [];
    let u8 = Uint8Array.from(buf);
  
    u8.forEach(function (i) {
      var h = i.toString(16);
      if (h.length % 2) { h = '0' + h; }
      hex.push(h);
    });
  
    return bigInt(hex.join(''), 16);
  }
  
}