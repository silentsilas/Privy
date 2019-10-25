<template>
  <q-page class="row justify-center" :padding="true">
    <div style="width: 500px; max-width: 90vw;">
      <q-list no-border>
        <!-- <q-item>
          <q-item-main>
            <q-item-tile>Generate {{ bits }} bit RSA Keys.</q-item-tile>
            <q-item-tile label v-if="error">{{ errorMessage }}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>
              <q-slider v-model="bits" :min="1" :max="2048" :step="1" :disable="generatedPrimes" />
            </q-item-tile>
          </q-item-main>
        </q-item> -->
        <KeyStep v-if="currentStep >= 1" 
          :index="1" 
          title="Choose two prime numbers (P and Q)" 
          :workText="`
            P = ? <br> 
            Q = ?
            <br><br>
            In the real world, you'd use huge prime numbers (2048 bits) to be secure. But I'll let you use smaller numbers for educational purposes.`"
          :workingText="`
            P = ? <br> 
            Q = ?
            <br><br>
            Finding two prime numbers...`"
          :completeText="`
            ${breakable(`
              P = ${p} <br> 
              Q = ${q}
            `)}
            <br><br>
            From just these two numbers, we can use some fancy math to create two different keys that can undo each other.`" 
          :action="generatePrimes" 
          :showNextAction="showNext" 
          key="step-1" 
        />
        <KeyStep v-if="currentStep >= 2" 
          :index="2" 
          title="Calculate N = P * Q" 
          :workText="`
            ${breakable(`
              N = ${p} * ${q}<br>
              N = ?
            `)}
            <br><br>
            We'll multiply the two primes we calculated to get us another important number.`"
          :workingText="`
            ${breakable(`
              N = ${p} * ${q}<br>
              N = ?
            `)}
            <br><br>
            Multiplying the two prime numbers...`"
          :completeText="`
            ${breakable(`
              N = ${p} * ${q}<br>
              N = ${n}
            `)}
            <br><br>
            Sweet! Both of our keys will have two numbers. This is the one shared by both.` " 
          :action="calculateN" 
          :showNextAction="showNext" 
          key="step-2" />
        <KeyStep v-if="currentStep >= 3" 
          :index="3" 
          title="Find the totient of N" 
          :workText="`
            ${breakable(`
              φ(n) = φ(p) * φ(q)<br>
              φ(n) = (P - 1) * (Q - 1)<br>
              φ(n) = (${p} - 1) * (${q} - 1)<br>
              φ(n) = ?
            `)}
            <br><br>
            The totient (Represented as φ in math) is simply how many integers less than a given number that don't share a common divisor with it. This is normally a really hard problem! There are two mathemetical properties we can use to our advantage, however.
            <br><br>
            Prime numbers, by definition, don't have any divisors to share in the first place.
            <br><br>
            So their totient is simply (n - 1)!
            <br><br>
            Strangely enough, totients also happen to be multiplicative, which means we can quickly find the totient of a product of two primes (our N) by multiplying the totients of those primes:<br>
            (p - 1) * (q - 1).<br><br>
            I'll be quizzing you on this later, by the way.`"
          :workingText="`
            ${breakable(`
              φ = (P - 1) * (Q - 1)<br>
              φ = (${p} - 1) * (${q} - 1)<br>
              φ = ?
            `)}
            <br><br>
            Finding that Phi...`"
          :completeText="`
            ${breakable(`
              φ = (P - 1) * (Q - 1)<br>
              φ = (${p} - 1) * (${q} - 1)<br>
              φ = ${phi}
            `)}
            <br><br>
            Sweet! This number will come in handy, thanks to the two unique mathematical properties we used to create it.` " 
          :action="calculateTotient" 
          :showNextAction="showNext" 
          key="step-3" />
        <KeyStep v-if="currentStep >= 4" 
          :index="4" 
          title="Create our public key" 
          :workText="`
            ${breakable(`
              gcd(public_key, φ(n)) = 1<br>
              gcd(public_key, ${phi})<br>
              public_key = ?
            `)}
            <br><br>
            That fancy formula above is essentially asking us to find an integer that is coprime to the totient of N. Once we find it, we then have our public key!<br><br>
            We'll simply choose a random number and see if the greatest common divisor of it and our φ(n) is 1. If so, we're done. Otherwise, rinse and repeat.`"
          :workingText="`
            ${breakable(`
              gcd(public_key, φ(n)) = 1<br>
              gcd(public_key, ${phi})<br>
              public_key = ?
            `)}
            <br><br>
            Finding that coprime integer...`"
          :completeText="`
            ${breakable(`
              gcd(public_key, φ(n)) = 1<br>
              gcd(public_key, ${phi})<br>
              public_key = ${publicKey}
            `)}
            <br><br>
            We did it, my friend. We created the public key. It's called 'public' because we can show it to the world. It's sort of like your username.<br><br>
            When someone asks for your contact information, just tell them:<br><br>
            Sure, here's my public RSA key:<br>
            ${publicKey}<br>
            ${n}<br>
            <br>
            Trust me, they'll be impressed. I know I certainly am.` " 
          :action="calculatePublic" 
          :showNextAction="showNext" 
          key="step-4" />
        <KeyStep v-if="currentStep >= 5" 
          :index="5" 
          title="Create our private key" 
          :workText="`
            ${breakable(`
              (private_key * public_key)(mod φ(n)) = 1<br>
              (private_key * ${publicKey})(mod ${phi}) = 1<br>
              private_key = ?
            `)}
            <br><br>
            Alright, another crazy formula! To get our precious private key, we have to find the modular multiplicative inverse of our public key and φ(n).<br><br>
            You could do this by hand by utilizing the Euclidean Algorithm followed by Back Substitution. Or if you really know your stuff, you could run the Extended Euclidean Algorithm to reach it faster.<br><br>
            I may show these methods in a future update, but for now, let's have the computer do the grunt work.`"
          :workingText="`
            ${breakable(`
              (private_key * public_key)(mod φ(n)) = 1<br>
              (private_key * ${publicKey})(mod ${phi}) = 1<br>
              private_key = ?
            `)}
            <br><br>
            Running through the Extended Euclidian Algorithm on ${publicKey} and ${phi}...`"
          :completeText="`
            ${breakable(`
              (private_key * public_key)(mod φ(n)) = 1<br>
              (private_key * ${publicKey})(mod ${phi}) = 1<br>
              private_key = ${this.privateKey}
            `)}
            <br><br>
            We've completed the last step. The private key is ours. It's called private because you make sure no one ever knows its value. It's sort of like your password.<br><br>
            Now you can give your public key to a friend, and let them encrypt a message with it. They then send you this encrypted gibberish, and using the magic of RSA, you're able to decrypt it with your private key!` " 
          :action="calculatePrivate" 
          key="step-5" />
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import KeyStep from '@/components/KeyStep.vue';
import wait, { runAndWaitUntil } from '@/helpers/wait';
import { gcd, primeSync, randBetween, modInv } from '@/helpers/bigint-crypto-utils';

@Component({
  components: {
    KeyStep
  }
})
export default class Keys extends Vue {
  private bits: number = 10;
  private p: bigint = BigInt(0);
  private q: bigint = BigInt(0);
  private currentStep: number = 1;
  private publicKey: bigint = BigInt(0);
  private privateKey: bigint = BigInt(0);
  private generatedPrimes: boolean = false;

  private error: boolean = false;
  private errorMessage: string = "";

  private async generatePrimes(callback: Function) {
    console.log(self.navigator.hardwareConcurrency);
    try {
      await runAndWaitUntil(async () => {
        try {
          await wait(500);
          this.p = await primeSync(this.bits);
          this.q = await primeSync(this.bits);
        } catch (err) {
          this.error = true;
          this.errorMessage = err;
        }
      }, 2000);
    } catch (err) {
      this.error = true;
      this.errorMessage = err;
    }

    this.generatedPrimes = true;

    callback();
  }

  get n(): bigint {
    return this.p * this.q;
  }

  get phi(): bigint {
    return (this.p - BigInt(1) ) * (this.q - BigInt(1));
  }

  private breakable(message: string) {
    return `
      <div class="breakable">
        ${message}
      </div>`;
  }

  private async calculateN(callback: Function) {
    // waste some time
    await wait(2000);

    callback();
  }

  private async calculateTotient(callback: Function) {
    await wait(2000);

    callback();
  }

  private async calculatePublic(callback: Function) {
    await runAndWaitUntil(async () => {
      // Choose an integer e such that e and phi(n) are coprime
      let e = randBetween(this.phi, BigInt(1));

      // Use Euclid's Algorithm to verify that e and phi(n) are comprime
      let tempGcd = gcd(e, this.phi);
      while (tempGcd != 1) {
          e = randBetween(this.phi, BigInt(1));
          tempGcd = gcd(e, this.phi);
      }

      this.publicKey = e;

    }, 2000);

    callback();
  }

  private async calculatePrivate(callback: Function) {
    await runAndWaitUntil(async () => {
      let eGcd = modInv(this.publicKey, this.phi);
      console.log(eGcd);
      this.privateKey = eGcd;
    }, 2000);

    callback();
  }

  private async showNext() {
    // do some animation maybe
    await wait(300);
    this.currentStep++;
  }

}
</script>
<style lang="scss">
.breakable {
  word-wrap: break-word;
}
</style>
