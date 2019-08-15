var db = require('../database')

module.exports = {
    getUserCart : (req,res)=>{
        var sql = `select ca.name, p.id, GROUP_CONCAT(i.imagepath) AS images, p.name, p.price,
        SUM(c.quantity) as qty, p.rating, shop.name as shopname from product p 
        join cartproduct c on p.id = c.productid join category ca on p.cat_id = ca.id join shop on p.shop_id = shop.userid 
        join user u on u.userid = c.userid join image i on p.id = i.product_id where u.username = '${req.query.user}'
        group by p.id`
    
         db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
           
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    },
    addToCart : (req,res)=>{
        console.log(req.query.user)
        var sql = `insert into cartproduct (userid, quantity, productid) values ((select userid from user where username = '${req.query.user}'),'${req.body.qty}', '${req.body.productid}')`
        db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
            console.log("Add Cart Success")
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    },
    updateItemCart : (req,res) => {
        console.log(req.body)
        var sql = `UPDATE cartproduct SET quantity = ${req.body.qtyupdated} WHERE productid = ${req.body.productid} AND userid = ${req.body.userid}`
        db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
            console.log("UPDATE Cart Success")
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    }
}