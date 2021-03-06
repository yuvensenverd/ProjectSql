var db = require('../database')
var moment = require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    getUserCart : (req,res)=>{
        var sql = ` select ca.name, p.id, GROUP_CONCAT(distinct i.imagepath) AS images, p.name, p.price,
        c.quantity as qty, shop.name as shopname from product p 
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
        var sql = `insert into cartproduct (userid, quantity, productid, lastmodified) values ((select userid from user where username = '${req.query.user}'),'${req.body.qty}', '${req.body.productid}', '${moment().format('YYYY-MM-DD hh:mm:ss')}')`
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
        var sql = `UPDATE cartproduct SET quantity = ${req.body.qtyupdated}, lastmodified = '${moment().format('YYYY-MM-DD hh:mm:ss')}' WHERE productid = ${req.body.productid} AND userid = ${req.body.userid}`
        db.query(sql, (err,result)=>{
           
    
            if(err) res.status(500).send(err);
    
            
       
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    },
    deleteItemCart : (req,res) =>{
     
        var sql = `delete from cartproduct where productid = ${req.params.id} and userid = ${req.params.userid}`
        db.query(sql, (err,result)=>{
            if(err) res.status(500).send(err);

           
            console.log("Delete Cart Success")
         
            res.status(200).send(result)
        })
    },
    addTransaction : (req,res) =>{
   
      
       
        if(req.body.gopay){
            delete req.body.gopay
            var datasum = {
                transactiondate : moment().format('YYYY-MM-DD hh:mm:ss'),
                totalprice : req.body.totalprice,
                userid : req.body.userid
            }
            var sql = `insert into sumtransaction set ?`
            db.query(sql,datasum, (err,result)=>{
                if(err) res.status(500).send(err);
    
              
              
                var transactionid = result.insertId
                console.log(transactionid)
                var listproduct = []
                for(var i = 0; i< req.body.listproduct.length; i++){
                    listproduct.push([...req.body.listproduct[i], transactionid])
                }
                console.log(listproduct)
    
                sql = `insert into transactionitem (productid, price, qty, transactionid) VALUES ?`
                db.query(sql,[listproduct], (err,results2)=>{
                    if(err){
                        throw err;
                    } 
                    console.log("insert transactionitem success")
                    sql = `delete from cartproduct where userid = ${req.body.userid}`
                    db.query(sql, (err,result3)=>{
                        if(err) res.status(500).send(err);
            
                        console.log("Delete Cart Transaction Success")
                        
                        res.status(200).send(result3)
                    })
                })
            })
        }else{
            console.log("Uplaod")
            // ADD MANUAL TRASNFER

            const path = '/post/image/manualtransfer'; //file save path
            const upload = uploader(path, 'MTF').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    console.log("Masuk")
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
             
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
               
                data.profileimg = imagePath;
                var datasum = {
                    transactiondate : moment().format('YYYY-MM-DD hh:mm:ss'),
                    totalprice : data.totalprice,
                    userid : data.userid,
                    imagepath : data.profileimg
                }
                var sql = `insert into sumtransaction set ?`
                db.query(sql,datasum, (err,result)=>{
                    if(err) res.status(500).send(err);
        
                  
                  
                    var transactionid = result.insertId
                    console.log(transactionid)
                    var listproduct = []
                    for(var i = 0; i< data.listproduct.length; i++){
                        listproduct.push([...data.listproduct[i], transactionid])
                    }
                    console.log(listproduct)
        
                    sql = `insert into transactionitem (productid, price, qty, transactionid) VALUES ?`
                    db.query(sql,[listproduct], (err,results2)=>{
                        if(err){
                            throw err;
                        } 
                        console.log("insert transactionitem success")
                        sql = `delete from cartproduct where userid = ${data.userid}`
                        db.query(sql, (err,result3)=>{
                            if(err) res.status(500).send(err);
                
                            console.log("Delete Cart Transaction Success")
                            
                            res.status(200).send(result3)
                        })
                    })
                })
            })
        }
       
    }
}