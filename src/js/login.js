import CryptoJS from 'crypto-js'

async function login(){
   window.CryptoJS = CryptoJS
   var email = document.getElementById("email").value  
   var password = document.getElementById("password").value
   var resp = await fetch(`http://127.0.0.1:8000/users/get_salt?email=${email}`,{
      method:"GET",
   })
   var salt = await resp.text()
   var salt = CryptoJS.enc.Hex.parse(salt.slice(1,salt.length - 1))
   var master_and_derived_key = CryptoJS.PBKDF2(`${email}:${password}`,salt,{iterations:50000,keySize:256/32,hasher:CryptoJS.algo.SHA256})
   var master_and_derived_key_string = master_and_derived_key.toString()
   var derived_key_string= master_and_derived_key_string.slice(0,master_and_derived_key_string.length/2)
   var derived_key = CryptoJS.enc.Hex.parse(derived_key_string)
   var master_enc_key_string = master_and_derived_key_string.slice(master_and_derived_key_string.length/2,master_and_derived_key_string.length)
   var master_enc_key = CryptoJS.enc.Hex.parse(master_enc_key_string)
   var data = {"email":email,"derived_key":derived_key_string}
   resp = await fetch("http://127.0.0.1:8000/users/login",{
      method:"POST",
      headers: {
      "Content-Type": "application/json",
   },
      body:JSON.stringify(data)
      
   })
   if (resp.status != 200) {
      alert("Invalid credentials")
   } else {
      data = await resp.json()
      sessionStorage.setItem("accessToken",data["access_token"])
      var encrypted_master_key_string = data["encrypted_master_password"]
      var iv = CryptoJS.enc.Hex.parse(encrypted_master_key_string.slice(0,32))
      var encrypted_master_key = CryptoJS.enc.Hex.parse(encrypted_master_key_string.slice(32,encrypted_master_key_string.length))
      var cipherparams = CryptoJS.lib.CipherParams.create({ciphertext:encrypted_master_key})
      var master_key = CryptoJS.AES.decrypt(cipherparams,master_enc_key,{iv:iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7})
      localStorage.setItem("master_key",master_key.toString())
      alert("Logged In")
   }
}

export default login 