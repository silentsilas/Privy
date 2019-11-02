// https://github.com/mdn/dom-examples/blob/master/web-crypto/encrypt-decrypt/aes-gcm.js

export interface AESMessage {
   ciphertext: Uint8Array,
   iv: Uint8Array,
   combined: Uint8Array
};

export class AES {

    /*
    Fetch the contents of the "message" textbox, and encode it
    in a form we can use for the encrypt operation.
    */
    private static getMessageEncoding(message: string) {
        let enc = new TextEncoder();
        return enc.encode(message);
    }

    /*
    Get the encoded message, encrypt it and display a representation
    of the ciphertext in the "Ciphertext" element.
    */
    static async encryptMessage(message: string, key: CryptoKey): Promise<AESMessage> {
        let encoded = AES.getMessageEncoding(message);
        // The iv must never be reused with a given key.
        let iv = window.crypto.getRandomValues(new Uint8Array(12));
        let cipherbinary = await window.crypto.subtle.encrypt(
            {
            name: "AES-GCM",
            iv: iv
            },
            key,
            encoded
        );

        const buffer = new Uint8Array(cipherbinary, 0, 5);
        console.log(`${buffer}...[${cipherbinary.byteLength} bytes total]`)

        const ciphertext = new Uint8Array(cipherbinary);

        let combined = AES.combineUint8Arrays(iv, ciphertext);

        return {
            ciphertext: ciphertext,
            iv: iv,
            combined: combined
        };
    }

    static combineUint8Arrays(array1: Uint8Array, array2: Uint8Array) {
        let combined = new Uint8Array(array1.length + array2.length);
        combined.set(array1, 0);
        combined.set(array2, array1.length);

        return combined;
    }

    /*
    Fetch the ciphertext and decrypt it.
    Write the decrypted message into the "Decrypted" box.
    */
    static async decryptMessage(aesMessage: AESMessage, key: CryptoKey): Promise<string> {
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: aesMessage.iv
            },
            key,
            aesMessage.ciphertext
        );

        let dec = new TextDecoder();
        return dec.decode(decrypted);
    }

    /*
    Generate an encryption key, then set up event listeners
    on the "Encrypt" and "Decrypt" buttons.
    */
    static async generateKey(): Promise<CryptoKey> {
        return await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
    }
}