var db = require('../database')

module.exports = {
    createStore : (req,res)=>{
        console.log(req.body)

        // BLM DIGANTI
      
        var sql = `insert into shop  values ((select userid from user where username = '${req.query.user}'),'${req.body.name}', '${req.body.description}', ${req.body.shopimage})`
        
        db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
            console.log("Register Shop Success")
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    },
    getUserStore : (req,res)=>{
        console.log(req.params.id)
        var sql = `select * from shop where userid = ${req.params.id}`
        db.query(sql, (err,result)=>{
            if(err){
                res.status(500).send(err);
            }

            console.log("Berhasil Get Data")
            // console.log(result) // ROW DATA PACKET ISI BYK
            res.status(200).send(result)
        })
    },
    getProductStore : (req,res)=>{
        console.log(req.params.id)
        var sql = `select p.name, p.price, p.description, p.rating, c.name as cat, p.image_id from product p join category c on p.cat_id = c.id where shop_id = ${req.params.id}`
        db.query(sql,(err,result)=>{
            if(err){
                res.status(500).send(err);
            }

            console.log("berhasil get product")
            res.status(200).send(result)
            
        })
    }
}