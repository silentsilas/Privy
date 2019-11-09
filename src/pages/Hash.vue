<template>
  <q-page class="row justify-center" :padding="true">
    <div style="width: 500px; max-width: 90vw;">
          <input type="file" />
          <img :src="kittyUrl" />
          <q-item>
            <q-item-main>
              <q-item-tile style="word-break: break-all;" v-if="kittyHash">
                {{ algorithm }}: {{ kittyHash }}
              </q-item-tile>
            </q-item-main>
          </q-item>
    </div>
  </q-page>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from 'axios';

@Component({
  // components: {
  //   ComingSoon
  // }
})
export default class Hash extends Vue {

  private reader: FileReader = new FileReader();
  private decoder: TextDecoder = new TextDecoder("utf-8");
  private kittyUrl: string = "statics/kitty.jpg";
  private kittyHash: string | boolean = false;
  private algorithm: string = "SHA-256";

  private mounted() {
    this.setupImage();

    // we'll need to run this when we get a file from user
    // this.reader.readAsArrayBuffer();
  }

  private async setupImage() {
    const { data } = await axios.get(this.kittyUrl, {
      responseType: 'arraybuffer',
    });
    const digest: ArrayBuffer = await crypto.subtle.digest(this.algorithm, data);

    this.kittyHash = Array.prototype.map.call(new Uint8Array(digest), (byte: number) => {
      // turn digest into a hexadecimal string
      return ('00' + byte.toString(16)).slice(-2);
    }).join('');
  }

}
</script>
