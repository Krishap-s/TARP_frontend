import CryptoJS from 'crypto-js'

function convertUint8ArrayToWordArray(u8Array) {
	var words = [], i = 0, len = u8Array.length;

	while (i < len) {
		words.push(
			(u8Array[i++] << 24) |
			(u8Array[i++] << 16) |
			(u8Array[i++] << 8)  |
			(u8Array[i++])
		);
	}

	return {
		sigBytes: words.length * 4,
		words: words
	};
}

function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

function downloadBlob(blob, name = 'file.txt') {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}

async function download(){
    var file_id = document.getElementById("file_id").value
    var access_token = localStorage.getItem("access_token")
    var resp = await fetch(`http://127.0.0.1:8000/files/${file_id}`,{
        method:"GET",
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
    if (resp.status != 200){
        alert("Invalid id")
        return
    }
    var resp_json = await resp.json()
    console.log(resp_json["encrypted_file_key"])
    var master_key = CryptoJS.enc.Hex.parse(localStorage.getItem("master_key"))
    var encrypted_file_key = CryptoJS.enc.Hex.parse(resp_json["encrypted_file_key"])
    var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext:encrypted_file_key})
    var hmac = resp_json["hmac"]
    var key = CryptoJS.AES.decrypt(cipherParams,master_key,{mode:CryptoJS.mode.ECB})
    console.log(key)
    var resp = await fetch(`http://127.0.0.1:8000/files/${file_id}/download`,{
        method:"GET",
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
    var encrypted_data_buffer = await resp.arrayBuffer()
    var encrypted_data = convertUint8ArrayToWordArray(new Uint8Array(encrypted_data_buffer))
    var dirty_hmac = CryptoJS.HmacSHA256(encrypted_data,master_key).toString()
    if (hmac != dirty_hmac){
        alert("Invalid HMAC!! File has been modified")
        return
    }
    var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext:encrypted_data})
    var data = CryptoJS.AES.decrypt(cipherParams,key,{mode:CryptoJS.mode.ECB})
    console.log(data)
    var dirty_hmac = CryptoJS.HmacSHA256(encrypted_data,master_key).toString()
    downloadBlob(new Blob([convertWordArrayToUint8Array(data)]),resp_json["file_name"])
}

export default download