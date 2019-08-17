var db = require('../database')

module.exports = {
    getBannerImg : (req,res)=>{
        console.log("msk bnner")
        var sql = `SELECT * FROM banner`
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
      
            res.status(200).send(results)
       
    
        })
    }

}