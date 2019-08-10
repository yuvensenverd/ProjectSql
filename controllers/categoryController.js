var db = require('../database')

module.exports = {
    getCategories : (req,res)=>{
        var sql = `SELECT * FROM category`
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
      
            res.status(200).send(results)
       
    
        })
    }

}