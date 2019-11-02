<template>
  <q-page class="row justify-center" :padding="true">
    <div style="width: 500px; max-width: 90vw;">
      <q-list no-border>
        <h4>Generate a {{ rsa.bits * 2 }} bit RSA Keypair.</h4>
        <!-- <q-item>
          <q-item-main>
            <q-item-tile label>
              <q-slider v-model="bits" :min="1" :max="2048" :step="1" :disable="generatedPrimes" />
            </q-item-tile>
          </q-item-main>
        </q-item> -->
        <q-item v-if="error">
          <q-item-tile label class="error">Error: {{ errorMessage }}</q-item-tile>
        </q-item>
        <KeyStep v-if="currentStep >= 1" 
          :index="1" 
          title="Choose two prime numbers (P and Q)" 
          :workText="`
            P = ? <br> 
            Q = ?
            <br><br>
            In the real world, you'd use huge prime numbers (2048 bits${sup('*')} or higher) to be secure. We'll be using much smaller numbers for educational purposes (two ${rsa.bits} bit prime numbers in our case).
            <br><br>
            ${commentary(`
            * Bits are essentially how many binary numbers can represent some data. 4 bits means the data needs at least four 1's and 0's to represent it. The number 12, for example, becomes 1100 when converted to binary, so it has 4 bits. The number 17, however, becomes 10001, which is one bit too many to qualify.
            <br><br>
            We will be choosing prime numbers with ${rsa.bits} bits, which means numbers between ${Math.pow(2, rsa.bits - 1) + 1} and ${ Math.pow(2, rsa.bits)}.
            `)}
            `"
          workButtonText="Find Two Primes!"
          :workingText="`
            ${breakable(`
              P = ${rsa.p.toString()} <br> 
              Q = ${rsa.q.toString()}
            `)}
            <br><br>
            Finding two prime numbers...<br>
            ${iterations()}`"
          :completeText="`
            ${breakable(`
              P = ${rsa.p.toString()} <br> 
              Q = ${rsa.q.toString()}
            `)}
            <br><br>
            From just these two numbers, we can use some fancy math to create two different keys that can undo each other. One will be a <b>public key</b> which you'll show to the world, and the other will be your <b>private key</b> which you'll keep only to yourself.
            <br><br>
            Your public key is like your phone number, which you can give to someone else for them to add you to their contacts. The two of you may start chatting once you exchange public keys.
            <br><br>
            Your private key is like your phone's password. This is what lets you 'log in' to your phone to view the messages that were sent to your phone number.`" 
          :action="calculatePrimes" 
          :showNextAction="showNext" 
          key="step-1" 
        />
        <KeyStep v-if="currentStep >= 2" 
          :index="2" 
          title="Calculate N = P * Q" 
          :workText="`
            ${breakable(`
              N = ${rsa.p.toString()} * ${rsa.q.toString()}<br>
              N = ?
            `)}
            <br><br>
            We'll multiply the two primes we calculated to get us another important number.`"
          workButtonText="Multiply our primes!"
          :workingText="`
            ${breakable(`
              N = ${rsa.p.toString()} * ${rsa.q.toString()}<br>
              N = ?
            `)}
            <br><br>
            Multiplying the two prime numbers...`"
          :completeText="`
            ${breakable(`
              N = ${rsa.p.toString()} * ${rsa.q.toString()}<br>
              N = ${rsa.n.toString()}
            `)}
            <br><br>
            Sweet! Both our public key and our private key will include this number N. It's fine for the world to know this number, as we will be betting on a few mathematical properties to keep our secrets safe.` " 
          :action="calculateN" 
          :showNextAction="showNext" 
          key="step-2" />
        <KeyStep v-if="currentStep >= 3" 
          :index="3" 
          title="Find the totient of N" 
          :workText="`
            ${breakable(`
              φ(N) = φ(P) * φ(Q)<br>
              φ(N) = (P - 1) * (Q - 1)<br>
              φ(N) = (${rsa.p.toString()} - 1) * (${rsa.q.toString()} - 1)<br>
              φ(N) = ?
            `)}
            <br><br>
            The totient function (Represented as φ in math) essentially counts up all integers${sup(`*`)} up to given integer N that don't share a common divisor with N${sup(`**`)}. This is normally a really hard problem! There are two mathemetical properties we can use to our advantage, however.
            <br><br>
            Prime numbers, by definition, don't have any divisors to share in the first place. That means their totient is simply (N - 1)! 
            <br><br>
            So if we have the prime number ${breakable(`${rsa.p.toString()}`)}, then its totient is ${breakable(`${rsa.p.subtract(1).toString()}`)}. You could teach your boss this, probably.
            <br><br>
            Strangely enough, totients also happen to be <b>multiplicative</b>${sup(`***`)} with coprime integers, which means we can quickly find the totient of a product of two primes by multiplying the totients of those primes:
            <br><br>
            φ(N) = φ(P) * φ(Q)<br>
            φ(N) = (P - 1) * (Q - 1).
            <br><br>
            We are betting on the fact that if our attacker knows our integer N, they won't be able to figure out φ(N) without expending <i>years</i> of computing power.
            <br><br>
            I'll be quizzing you on this later, by the way.
            <br><br>
            ${commentary(`
              * Integers are <i>whole numbers</i>, like 1, 42, and 1337. No decimals here.<br>
              ** This means there are no integers, besides 1, that can divide into <i>both</i> of these integers. In other words, they are <b>relatively prime</b> or <b>coprime</b>.<br>
              *** Look up 'Euler totient function multiplicative property proof' and get a math degree to learn why this is the case. You should probably do the latter first.
            `)}
            `"
          workButtonText="Multiply those totients!"
          :workingText="`
            ${breakable(`
              φ(N) = φ(P) * φ(Q)<br>
              φ(N) = (P - 1) * (Q - 1)<br>
              φ(N) = (${rsa.p.toString()} - 1) * (${rsa.q.toString()} - 1)<br>
              φ(N) = ?
            `)}
            <br><br>
            Finding that Phi...`"
          :completeText="`
            ${breakable(`
              φ(N) = φ(P) * φ(Q)<br>
              φ(N) = (P - 1) * (Q - 1)<br>
              φ(N) = (${rsa.p.toString()} - 1) * (${rsa.q.toString()} - 1)<br>
              φ(N) = ${rsa.phi.toString()}
            `)}
            <br><br>
            There we go! This number will come in handy, thanks to the two unique mathematical properties we used to create it.` " 
          :action="calculateTotient" 
          :showNextAction="showNext" 
          key="step-3" />
        <KeyStep v-if="currentStep >= 4" 
          :index="4" 
          title="Create our public key" 
          :workText="`
            ${breakable(`
              gcd(public, φ(N)) = 1<br>
              gcd(public, ${rsa.phi.toString()}) = 1<br>
              public = ?
            `)}
            <br><br>
            That fancy formula above is essentially asking us to find an integer that is coprime to the totient of N. Once we find it, we then have our public key!
            <br><br>
            So far, we know two prime numbers are coprimes to each other. But we don't know too much about φ(N) to quickly find a coprime for it. So we'll simply choose a random integer (which we'll call public) and see if the greatest common divisor of public and φ(n) is 1.
            <br><br>
            If this is true, then we've found a coprime integer! If their gcd is greater than 1, then choose another random integer and try again. It won't take too many tries for a computer to find one.
            <br><br>
            ${commentary(`
              Sidenote: Unless we choose a super small number, our security doesn't depend on this randomly chosen coprime integer. It only affects how fast we can encrypt things. Lots of RSA implementations simply choose the prime integer 65537 because of this.
            `)}
            `"
          workButtonText="Choose a coprime!"
          :workingText="`
            ${breakable(`
              gcd(public, φ(N)) = 1<br>
              gcd(public, ${rsa.phi.toString()})<br>
              public = ?
            `)}
            <br><br>
            Choosing a coprime integer...`"
          :completeText="`
            ${breakable(`
              gcd(public, φ(N)) = 1<br>
              gcd(public, ${rsa.phi.toString()})<br>
              public = ${rsa.publicKey.toString()}
            `)}
            <br><br>
            We did it, my friend. We created the public key. It's called 'public' because we can show it to the world. It's sort of like your username.<br><br>
            When someone asks for your contact information, just tell them:<br><br>
            Sure, here's my public RSA key:<br>
            ${breakable(`
              Public: ${rsa.publicKey.toString()}<br>
              Exponent (N): ${rsa.n.toString()}<br>
            `)}
            <br>
            ${commentary(`
              Trust me, they'll be impressed. I know I certainly am.
            `)}
            ` " 
          :action="calculatePublic" 
          :showNextAction="showNext" 
          key="step-4" />
        <KeyStep v-if="currentStep >= 5" 
          :index="5" 
          title="Create our private key" 
          :workText="`
            ${breakable(`
              (private * public) mod φ(N) = 1<br>
              (private * ${rsa.publicKey.toString()}) mod ${rsa.phi.toString()} = 1<br>
              private = ?
            `)}
            <br><br>
            Alright, this looks like a crazy formula! To get our precious private key, we have to find the <b>modular multiplicative inverse</b> of public and φ(N).<br><br>
            You could do this by hand by following the <b>Euclidean Algorithm</b>, then using <b>Back Substitution</b>. Both of which you could probably learn in a short Youtube video.
            <br><br>
            Or, if you really know your stuff, you could follow the <b>Extended Euclidean Algorithm</b> which shortens how many operations you have to make. This also doesn't take too long to learn. Trust me, I'm not a doctor.<br><br>
            I'd love to show both methods step-by-step in a future update, but for now, let's have the computer do the grunt work.`"
          workButtonText="Move that bus!"
          :workingText="`
            ${breakable(`
              (private * public) mod φ(N) = 1<br>
              (private * ${rsa.publicKey.toString()}) mod ${rsa.phi.toString()} = 1<br>
              private = ?
            `)}
            <br><br>
            Running through the Extended Euclidian Algorithm on ${rsa.publicKey.toString()} and ${rsa.phi.toString()}...`"
          :completeText="`
            ${breakable(`
              (private * public) mod φ(N) = 1<br>
              (private * ${rsa.publicKey.toString()}) mod ${rsa.phi.toString()} = 1<br>
              private = ${rsa.privateKey.toString()}
            `)}
            <br><br>
            Huzzah! We've completed the last step. The final piece of the private key is ours. It's called private because you make sure no one ever knows its value. It's sort of like your password.
            <br><br>
            Now you can give your public key to a friend, and let them encrypt a message with it. They can then send you this encrypted gibberish, and using the magic of RSA, you're able to decrypt it with your private key!
            <br><br>
            Our public & private keys:<br>
            ${breakable(`
              Public: ${rsa.publicKey.toString()}<br>
              Exponent (N): ${rsa.n.toString()}
              <br><br>
              Private : ${rsa.privateKey.toString()}<br>
              Exponent (N): ${rsa.n.toString()}            
            `)}
            ` "
          :action="calculatePrivate" 
          :showNextAction="showNext" 
          key="step-5" />
          <KeyStep v-if="currentStep >= 6" 
          :index="6" 
          title="Let's try it out!" 
          :workText="`
            To Encrypt:<br>
            ${breakable(`
              ciphertext = plaintext ^ public mod N<br>
              ciphertext = plaintext ^ ${rsa.publicKey.toString()} mod ${rsa.n.toString()}<br>
              plaintext = ?
            `)}
            <br><br>
            To Decrypt:<br>
            ${breakable(`
              plaintext = ciphertext ^ private mod N<br>
              plaintext = ciphertext ^ ${rsa.privateKey.toString()} mod ${rsa.n.toString()}<br>
              plaintext = ?
            `)}
            <br><br>
            As you can see, the private key can decrypt anything the public key encrypts${sup('*')}. Let's try encrypting the word '${testPlaintext}.'
            <br><br>
            First we turn the string into a number. Our word will be encoded with UTF-8${sup('**')}, which, when represented as a number, becomes ${testNumber}. Now we can plug in this number, along with our public key, private key, and exponent (N) into our formulas!
            <br><br>
            ${commentary(`
              * It is also true vice-versa. The public key can decrypt anything the private key encrypts. This is how you're able to 'sign' a message. If the sender encrypted it with their private key, you can know for sure that it was sent by them if you can decrypt it with their public key.<br>
              ** UTF-8 characters, as you might have guessed, take up 8-bits each. Since we have a 16-bit RSA keypair, we're able to encrypt exactly two of these characters. If we added just one more character, we would get gibberish if we tried to decrypt it, as our formula would no longer work. This is a major limitation of RSA.
            `)}
          `"
          workButtonText="Encrypt!"
          :workingText="`
            To Encrypt:<br>
            ${breakable(`
              ciphertext = plaintext ^ public mod N<br>
              ciphertext = plaintext ^ ${rsa.publicKey.toString()} mod ${rsa.n.toString()}<br>
              ciphertext = ${testNumber} ^ ${rsa.publicKey.toString()} mod ${rsa.n.toString()}<br>
              ciphertext = ?
            `)}
            <br><br>
            To Decrypt:<br>
            ${breakable(`
              plaintext = ciphertext ^ private mod N<br>
              plaintext = ciphertext ^ ${rsa.privateKey.toString()} mod ${rsa.n.toString()}<br>
              plaintext = ${testCiphertext} ^ ${rsa.privateKey.toString()} mod ${rsa.n.toString()}<br>
              plaintext = ?
            `)}
            <br><br>
            Encrypting and decrypting '${testPlaintext}' as a number...
          `"
          :completeText="`
            To Encrypt:<br>
            ${breakable(`
              ciphertext = plaintext ^ public mod N<br>
              ciphertext = plaintext ^ ${rsa.publicKey.toString()} mod ${rsa.n.toString()}<br>
              ciphertext = ${testNumber} ^ ${rsa.publicKey.toString()} mod ${rsa.n.toString()}<br>
              ciphertext = ${testCiphertext}
            `)}
            <br><br>
            To Decrypt:<br>
            ${breakable(`
              plaintext = ciphertext ^ private mod N<br>
              plaintext = ciphertext ^ ${rsa.privateKey.toString()} mod ${rsa.n.toString()}<br>
              plaintext = ${testCiphertext} ^ ${rsa.privateKey.toString()} mod ${rsa.n.toString()}<br>
              plaintext = ${testNumber}
            `)}
            <br><br>
            Yay! We can see that the number we got after decrypting the ciphertext is the exact same as the number we were trying to encrypt. Now once we turn that number back into a UTF-8 string, it becomes our original message: ${testDecrypted}
            <br><br>
            In a future update, we'll implement a secure chatting feature using RSA keys and what is called a <b>session key</b>.
            <br><br>
            RSA keys can only encrypt up to a certain amount of data at once, but session keys don't have this limitation. And so you use RSA to securely share a small session key, which can then be used to encrypt/decrypt as much data as you'd like between each other.
          `"
          :action="calculateEncryptDecrypt"
          key="step-6"
          />
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import KeyStep from '@/components/KeyStep.vue';
import wait, { runAndWaitUntil } from '@/helpers/wait';
import bigInt, { BigIntegerStatic, BigInteger } from 'big-integer';
import { RSA, RSATest } from '@/helpers/rsa';

@Component({
  components: {
    KeyStep
  }
})
export default class Keys extends Vue {
  private currentStep: number = 1;
  private rsa: RSA = new RSA(8);

  private testPlaintext: string = "hi";
  private encoder: TextEncoder = new TextEncoder();
  private decoder: TextDecoder = new TextDecoder();
  private get testNumber(): BigInteger {
    const encoded: Uint8Array = this.encoder.encode(this.testPlaintext);
    return RSA.uint8ArrayToBigInteger(encoded);
  } 
  private get testCiphertext(): BigInteger {
    return bigInt(this.testNumber).modPow(this.rsa.publicKey, this.rsa.n);
  }
  private get testDecrypted(): string {
    const decrypted = bigInt(this.testCiphertext).modPow(this.rsa.privateKey, this.rsa.n);
    return this.decoder.decode(RSA.bigIntegerToUint8Array(decrypted));
  }

  private error: boolean = false;
  private errorMessage: string = "";

  private sup(message: string): string {
    return `<span class="super">${message}</span>`;
  }

  private breakable(message: string): string {
    return `<span class="breakable">${message}</span>`;
  }

  private commentary(message: string): string {
    return `<span class="commentary">${message}</span>`;
  }

  private iterations(): string {
    return this.rsa.primeIterations == 0 ? "" : `
    We tested the primality of ${this.breakable(`${this.rsa.primeIterations}`)} total integers in ${this.rsa.primeTime / 1000} seconds.`;
  }

  private async calculatePrimes(callback: Function): Promise<any> {
    await wait(300);
    await this.rsa.calculatePrimes();
    await wait(1000);

    callback();
  }

  private async calculateN(callback: Function): Promise<any> {
    // waste some time
    await wait(1000);

    callback();
  }

  private async calculateTotient(callback: Function): Promise<any> {
    await wait(1000);

    callback();
  }

  private async calculatePublic(callback: Function): Promise<any> {
    await runAndWaitUntil(async () => {
      await this.rsa.calculatePublic();
    }, 2000);

    callback();
  }

  private async calculatePrivate(callback: Function): Promise<any> {
    await runAndWaitUntil(async () => {
      this.rsa.calculatePrivate();
    }, 2000);

    callback();
  }

  private async calculateEncryptDecrypt(callback: Function): Promise<any> {
    await wait(1000);

    callback();
  }

  private async showNext(): Promise<void> {
    // do some animation maybe
    await wait(300);
    this.currentStep++;
  }

  mounted(): void {
    new RSATest();
  }

}
</script>
<style lang="scss">
.breakable {
  word-wrap: break-word;
}
.commentary {
  font-weight: 100;
  font-size: 14px;
}
.error {
  color: rgb(2200, 60, 30);
}
.super {
  vertical-align: text-top;
  font-size: 12px;
}
</style>
