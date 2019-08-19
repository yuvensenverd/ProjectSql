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
            
                // console.log("masuk post a")
            
                // res.status(200).send(result)
                res.status(200).send(result)
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
        var sql = ` select p.id, p.name, p.price, p.description, p.rating, c.name as cat, GROUP_CONCAT(i.imagepath) AS images
        from product p left join category c on p.cat_id = c.id left join image i on p.id = i.product_id where shop_id = ${req.params.id} group by p.id`

        
        db.query(sql,(err,result)=>{
            if(err){
                res.status(500).send(err);
            }

            console.log("berhasil get product")
            res.status(200).send(result)
            
        })
    }
}