var db = require('../database')

module.exports = {
    getAllFromProduct: (req,res) => {
  

        var sql = 
        `SELECT * from product;`;
    
        //  AND USIA BETWEEN ${req.query.usiaMin} AND ${req.query.usiaMax};
    
        
        // console.log(res) // SERVER RESP
        db.query(sql, (err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
       
    
        })
    },
    getProductDetails : (req,res)=>{
        var sql = `select p.id, p.name, p.price, p.desc, s.name as shopname, s.description as shopdesc, p.rating, p.image, c.name as category from product p  join category c
        on p.cat_id = c.id  join shop s on p.shop_id = s.userid   `
        
        if(req.query.cat){
            sql += `where c.name = '${req.query.cat}'`
        }
        if(req.query.id){
            sql += `where p.id = '${req.query.id}'`
        }
    
        db.query(sql, (err,results)=>{
            if(err) res.status(500).send(err);
    
          
            res.status(200).send(results)
       
    
        })
    },
    

}