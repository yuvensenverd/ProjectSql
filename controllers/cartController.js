var db = require('../database')

module.exports = {
    getUserCart : (req,res)=>{
        var sql = ` select ca.name, p.id, GROUP_CONCAT(i.imagepath) AS images, p.name, p.price,
        c.quantity as qty, p.rating, shop.name as shopname from product p 
        left join cartproduct c on p.id = c.productid left join category ca on p.cat_id = ca.id left join shop on p.shop_id = shop.userid 
        left join user u on u.userid = c.userid left join image i on p.id = i.product_id where u.username = '${req.query.user}'
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
        console.log(new Date())
        var sql = `insert into cartproduct (userid, quantity, productid, lastmodified) values ((select userid from user where username = '${req.query.user}'),'${req.body.qty}', '${req.body.productid}', '${new Date().toString()}')`
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
        var sql = `UPDATE cartproduct SET quantity = ${req.body.qtyupdated}, lastmodified = '${new Date().toString()}' WHERE productid = ${req.body.productid} AND userid = ${req.body.userid}`
        db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
            console.log("UPDATE Cart Success")
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    },
    deleteItemCart : (req,res) =>{
        console.log("Delete masuk cart ")
        console.log(req.params.id)
        console.log(req.params.userid)
        var sql = `delete from cartproduct where productid = ${req.params.id} and userid = ${req.params.userid}`
        db.query(sql, (err,result)=>{
            if(err) res.status(500).send(err);

            console.log(sql)
            console.log("Delete Cart Success")
         
            res.status(200).send(result)
        })
    }
}