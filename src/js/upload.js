import CryptoJS from 'crypto-js'

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

function upload(){
    var file = document.getElementById("file").files[0]
    var reader = new FileReader();
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
       var data = CryptoJS.lib.WordArray.create(reader.result)
       var key = CryptoJS.lib.WordArray.random(32)
       var master_key = CryptoJS.enc.Hex.parse(localStorage.getItem("master_key"))
       var encrypted_data = CryptoJS.AES.encrypt(data,key,{mode:CryptoJS.mode.ECB}).ciphertext
       var encrypted_file = new File([convertWordArrayToUint8Array(encrypted_data)],file.name)
       var encrypted_file_key = CryptoJS.AES.encrypt(key,master_key,{mode:CryptoJS.mode.ECB}).ciphertext
       var hmac = CryptoJS.HmacSHA256(encrypted_data,master_key)
       console.log(encrypted_file.name)
       var formData = new FormData()
       formData.append("encrypted_file",encrypted_file)
       formData.append("encrypted_file_key",encrypted_file_key.toString())
       formData.append("hmac",hmac.toString())
       var access_token = localStorage.getItem("access_token")
       fetch("http://127.0.0.1:8000/files/upload",{
        method:"PUT",
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
       })
       .then(async (resp) => {
        var resp_json = await resp.json()
        if(resp.status == 200){
            var out = document.getElementById("file_id")
            out.innerText = "File ID: " + resp_json["file_id"]
        }
       })

    }
}

export default upload