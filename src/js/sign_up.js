import CryptoJS from 'crypto-js'

function sign_up(){
   var name = document.getElementById("name").value
   var email = document.getElementById("email").value  
   var password = document.getElementById("password").value
   var salt = CryptoJS.lib.WordArray.random(16)
   var master_and_derived_key = CryptoJS.PBKDF2(`${email}:${password}`,salt,{iterations:50000,keySize:256/32,hasher:CryptoJS.algo.SHA256})
   var master_and_derived_key_string = master_and_derived_key.toString()
   var derived_key_string= master_and_derived_key_string.slice(0,master_and_derived_key_string.length/2)
   var derived_key = CryptoJS.enc.Hex.parse(derived_key_string)
   var master_enc_key_string = master_and_derived_key_string.slice(master_and_derived_key_string.length/2,master_and_derived_key_string.length)
   var master_enc_key = CryptoJS.enc.Hex.parse(master_enc_key_string)
   var master_key = CryptoJS.lib.WordArray.random(32)
   var iv = CryptoJS.lib.WordArray.random(16)
   var encrypted_master_key = CryptoJS.AES.encrypt(master_key,master_enc_key,{iv:iv,mode:CryptoJS.mode.CBC})
   encrypted_master_key = CryptoJS.enc.Hex.parse(iv.toString() + encrypted_master_key.ciphertext.toString())
   var data = {"email":email,"derived_key":derived_key.toString(),"name":name,"encrypted_master_password":encrypted_master_key.toString(),"salt":salt.toString()}
   fetch("http://127.0.0.1:8000/users/register",{
      method:"PUT",
      body: JSON.stringify(data),
      headers: {
      "Content-Type": "application/json",
    },
   })
   .then((resp) => {
      var data = resp.json()
      alert("Registered")
      window.location = "login.html"
   })
}

export default sign_up 