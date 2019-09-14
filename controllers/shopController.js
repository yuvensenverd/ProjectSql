var db = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    createStore : (req,res)=>{
        console.log("Masuk create store")
        const path = '/post/image/shop'; //file save path
        const upload = uploader(path, 'SHP').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
        // BLM DIGANTI
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
           
            data.shopimage = imagePath;
            
            var sql = `insert into shop set ?`
            
            db.query(sql, data, (err,result)=>{
            
        
                if(err){
                    fs.unlinkSync('./public' + imagePath);
                    res.status(500).send(err);
                } 

                console.log("Register Shop Success")
                //
                sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
                left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
                where u.userid = ${data.userid}`
            

                db.query(sql, (err,results2)=>{
                    if(err) throw err;


                        
                    res.status(200).send(results2)

                })
                
                
      
            
            
            })
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
        var sql = `select p.id, p.name, p.price, p.description, count(distinct r.id) as ReviewCount, avg(r.rating) as avgrating, c.name as cat, GROUP_CONCAT(distinct i.imagepath) AS images
        from product p left join category c on p.cat_id = c.id left join image i on p.id = i.product_id left join review r on r.productid = p.Id
        where shop_id = ${req.params.id} and p.deleted = 0 group by id`

   
        
        
        db.query(sql,(err,result)=>{
            if(err){
                res.status(500).send(err);
            }

            console.log("berhasil get product")
            res.status(200).send(result)
            
        })
    },
    getShopRating : (req,res)=>{
        console.log('masuk rating')
        console.log('req query')
        console.log(req.query)
        var sql = `select count(distinct r.id) as shopReviewCount, avg(r.rating) as shopAvgRating
        from product p left join category c on p.cat_id = c.id left join image i on p.id = i.product_id left join review r on r.productid = p.Id
        where shop_id = ${req.query.shopid} and p.deleted = 0`
        db.query(sql,(err,result)=>{
            if(err){
                res.status(500).send(err);
            }

            console.log("berhasil get rating")
            res.status(200).send(result)
            
        })
    }

    
}