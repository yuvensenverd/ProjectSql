const Crypto = require('crypto')

module.exports = {
    encrypt(password){
        var hashpassword = Crypto.createHmac('md5', "kakssjdmsmaksmdkmksmaijsidnwiqniwneq").update(password).digest("hex")
        console.log(hashpassword)
        return hashpassword
    }
}