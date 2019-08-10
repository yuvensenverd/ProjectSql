var db = require('../database')

module.exports = {
    createStore : (req,res)=>{
        console.log(req.body)
      
        var sql = `insert into shop  values ((select userid from user where username = '${req.query.user}'),'${req.body.name}', '${req.body.description}', ${req.body.shopimage})`
        
        db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
            console.log("Register Shop Success")
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    }
}