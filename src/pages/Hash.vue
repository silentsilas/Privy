<template>
  <q-page class="row justify-center" :padding="true">
    <div style="width: 500px; max-width: 90vw;">

      <div class="imageWrapper">
        <img :src="originalUrl" class="image" />
        <span class="caption">This miniature murder machine does not know what to do with these vegetables; a situation we can all surely relate to.</span>
      </div>
      <p>
        Over the years, humanity has discovered that the true purpose of the internet is to propogate as much multimedia as possible of these miniature murder machines engaging in cute and/or comical acts. 
      </p>
      <p>
        For historical preservation of these precious files, scientists developed a method to verify that the file you downloaded is an exact replica of the original.
      </p>
      <p>
        The lucky individual with the Original would run their file through what is called a <b>hashing algorithm</b>, which spits out a certain number of letters and numbers. The gibberish it creates is otherwise known as the <b>hash</b>, or <b>digest</b>.
      </p>
      <p> 
        Anyone who wishes to check whether the file they downloaded is an exact replica would then run their file through the same hashing algirithm, and see if their hash is the exact same.
      </p>
      <p>
        <div style="word-break: break-all;"> {{ algorithm }} of Privy's cat photo: 
          <textarea v-model="originalHash" class="image"></textarea>
        </div>
      </p>
      <p>
        As you can see above, we ran our comical cat photo through the <b>{{ algorithm }}</b> hashing algorithm. You can now try downloading the file yourself, and see if your hash is the same.
      </p>
      <p>
        <q-btn color="primary" label="Download" class="image" @click="downloadFile" />
        <span class="caption">This will download <i>{{ serverUrl }}</i> to your device.</span>
      </p>
      <div v-if="downloaded">
        <div class="imageWrapper">
          <img :src="serverDownloadedUrl" class="image" />
          <span class="caption">I still can't believe someone tried to feed this miniature murder-machine a bunch of plants.</span>
        </div>
        <p>
          Sweet, we got the precious file from the internets. Now let's see if it's a carbon-copy of the one at the top of this page.
        </p>
        <p v-if="!hashed">
          <q-btn color="primary" label="Hash That Cat" class="image" @click="hashServerImage" />
        </p>
        <div v-else>
          <p>
            <div style="word-break: break-all;"> {{ algorithm }} of our downloaded cat photo: 
              <textarea v-model="serverHash" class="image"></textarea>
            </div>
          </p>
          <p>
            If this hash looks the same as the previous one, then we know these two files are identical!
          </p>
        </div>
      </div>
      <div v-if="hashed">
        <p>
          If you'd like, you can try hashing one of your own files! It doesn't matter how big the file is; the digest will always be the exact same length.
        </p>
        <input type="file" @change="uploadFile" />
        <div v-if="uploaded">
          <p>
            <div style="word-break: break-all;"> {{ algorithm }} Digest of {{ uploadedFileName }}: 
              <textarea v-model="uploadedFileHash" class="image"></textarea>
            </div>
          </p>
          <p>
            Now if you were to put this hash on your website, your users can be confident that the file they downloaded wasn't tampered with by a malicious actor, since they can hash the file themselves to check if it matches!
          </p>
          <p>
            Hashing also plays a critical role with passwords. When you sign up for an account somewhere, you send your password to their server. But the server doesn't want to actually save the password itself, since every account would be compromised if their database ever leaked.
          </p>
          <p>
            So instead, the server saves the hash of your password. Then, when you log in, the server hashes the password you sent and checks if it matches the one saved to your account. If they match, then the server knows that this is the correct password, without ever storing the password itself!
          </p>
          <p>
            <input v-model="plaintext" @input="plaintextChanged" placeholder="Try typing stuff here">
          </p>
          <p>
            <div style="word-break: break-all;"> {{ algorithm }} Digest of {{ plaintext }}: 
              <textarea v-model="plaintextHashed" class="image"></textarea>
            </div>
          </p>
        </div>
      </div>

    </div>
  </q-page>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from 'axios';

@Component({
})
export default class Hash extends Vue {
  private reader: FileReader = new FileReader();
  private encoder: TextEncoder = new TextEncoder();
  private algorithm: string = "SHA-256";

  private originalUrl: string = "statics/cat.jpg";
  private originalHash: string | boolean = false;

  private serverUrl: string = "https://silentsilas.com/cat.jpg";
  private serverData?: ArrayBuffer;
  private serverHash: string | boolean = false;
  private serverDownloadedUrl: string = "";

  private uploadedFileHash: string | boolean = false;
  private uploadedFileName: string = "Unknown file";

  private plaintext: string = "";

  private downloaded: boolean = false;
  private hashed: boolean = false;
  private uploaded: boolean = false;
  private plaintextHashed: string = "";

  private plaintextChanged() {
    const plaintextArray = this.encoder.encode(this.plaintext);

    this.hash(plaintextArray).then((hash) => {
      this.plaintextHashed = hash;
    }).catch((err) => {
      alert(err);
    });
  }

  private mounted() {
    this.hashOriginalImage().then((hash: string) => {
      this.originalHash = hash;
    }).catch((err) => {
      alert(err);
    });
  }

  private downloadFile() {
    this.setupServerImage().then().catch((err) => {
      alert(err);
    });
  }

  private async setupServerImage() {
    const response = await axios.get(this.serverUrl, {
      responseType: 'blob',
    });

    if (!crypto.subtle) {
      throw new Error("Can't access crypto tools. Your device may be too old, or you're not on a secure network.");
    }

    this.serverData = <ArrayBuffer> await response.data.arrayBuffer();

    // set source of our image to what we just downloaded
    var blob = new Blob( [ this.serverData ], { type: "image/jpeg" } );
    this.serverDownloadedUrl = window.URL.createObjectURL( blob );
    this.downloaded = true;
  }

  private hashServerImage() {
    if (!this.serverData) {
      alert("Could not find downloaded file");
      return;
    }
    this.hash(this.serverData).then((hash) => {
      this.serverHash = hash;
      this.hashed = true;
    })
  }

  private async hashOriginalImage() {
    if (!crypto.subtle) {
      throw new Error("Can't access crypto tools. Your device may be too old, or you're not on a secure network.");
    }
    
    // get file from app assets
    const { data } = await axios.get(this.originalUrl, {
      responseType: 'arraybuffer',
    });

    return await this.hash(data);
  }

  private uploadFile(event: Event) {
    if (!event.target) {
      return;
    }

    const { files } = <HTMLInputElement> event.target;

    // ensure they uploaded at least one file
    if (!files) {
      return;
    }
    const file = files[0];
    this.uploadedFileName = file.name;
    this.reader.onload = async (e) => {
      if (!this.reader.result) {
        return;
      }

      const arrayBuffer = <ArrayBuffer> this.reader.result;
      this.uploadedFileHash = await this.hash(arrayBuffer);
      this.uploaded = true;
    }
    this.reader.readAsArrayBuffer(file);
  }

  private async hash(data: ArrayBuffer) {
    const digest: ArrayBuffer = await crypto.subtle.digest(this.algorithm, data);

    return Array.prototype.map.call(new Uint8Array(digest), (byte: number) => {
      // turn digest into a hexadecimal string
      return ('00' + byte.toString(16)).slice(-2);
    }).join('');
  }

}
</script>
<style lang="scss" scoped>
.image {
    width: 100%;
    height: auto;
}
.imageWrapper {
  padding-bottom: 10px;
}
.caption {
  font-size: 12px;
  line-height: 0.8rem;
}
</style>