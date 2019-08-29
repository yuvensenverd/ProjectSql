var db = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

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
        var sql = `select p.id, p.name, p.price, p.description, s.name as shopname, s.description as shopdesc, Round(count(r.productid)/2, 0) as ReviewCount, avg(r.rating) as avgrating,
        GROUP_CONCAT(i.imagepath) AS images, c.name as category from product p  left join category c on p.cat_id = c.id  left join shop s on 
        p.shop_id = s.userid left join image i on p.id= i.product_id left join review r on r.productid = p.Id where p.deleted = 0 `
        
        if(req.query.cat){
            sql += `and c.name = '${req.query.cat}'  `
        }
        if(req.query.id){
            sql += `and p.id = '${req.query.id}' `
        }
        sql = sql + ` group by p.id`
        
    
        db.query(sql, (err,results)=>{
            if(err){
                console.log(err)
                res.status(500).send(err);
            } 
    
          
            res.status(200).send(results)
       
    
        })
    },
    addProduct : (req,res) => {
        console.log(req.body)

        console.log("Masuk ADD Product")
        const path = '/post/image/product'; //file save path
        const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {
            if(err){
                console.log("Masuk")
                return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
            }
            //UPLOAD BERHASIL
            var noimage = false
            const { image } = req.files;
            console.log(image)
            var imagepaths =[]
            if(image){

                for(var i = 0; i< image.length; i++){
                    var imgpath = image[i] ? path + '/' + image[i].filename : null
                    if(imgpath){
                        imagepaths.push(imgpath)
                    }
                }
                console.log(imagepaths)
            }else{
                noimage = true
            }
            // const imagePath = image ? path + '/' + image[0].filename : null;
            // console.log(imagePath)
            // console.log(imagepaths)

            console.log(req.body.data)
            const data = JSON.parse(req.body.data);
            if(noimage == false){

                data.productimg = imagepaths; // imagepaths is an array now
                console.log(data)
            }
            
            var sql = `INSERT INTO product set name = '${data.name}', price = ${data.price}, cat_id = (select id from category where name = '${data.cat_name}'),
                        shop_id = ${data.shop_id}, Description = '${data.description}', Rating = ${data.rating}`

            db.query(sql, (err, results)=>{
                if(err) {

                    res.status(500).send(err)
                }

                console.log("Masuk gak error")
                // get product id baru
                sql = `select id, name from product where name = '${data.name}' and description = '${data.description}'` // to avoid duplicate select
                db.query(sql, (err,results2)=>{
                    if(err) res.status(500).send(err)

                    console.log(results2)
                    console.log(results2[0].id)
                    
                    // taro imagepath di table image
                    // var dataimg = {
                    //     product_id : results2[0].id,
                    //     imagepath : data.productimg
                    // }
                    if(noimage == false){

                        var datas = []
                        for(var i = 0; i<data.productimg.length;i++){
                            // datas.push({
                            //     product_id : results2[0].id,
                            //     imagepath : data.productimg[i]
                            // })
                            datas.push([results2[0].id, data.productimg[i]])
                        }
                        console.log(datas)
                    }else{
                        return res.status(200).send(results2)
                    }

                    sql = `INSERT INTO image (product_id, imagepath) VALUES ?`

                    // for(var i =0; i < datas.length; i++){
                    //     sql = sql + `(${results2[0].id}, '${datas[i].imagepath}')`
                    //     if(datas.length - 1 == i){
                           
                    //     }else{
                    //         sql = sql + ','
                    //     }
                    // }
                    
                    
                    
                    db.query(sql,[datas], (err,results3)=>{
                        if(err){
                            for(var i = 0; i<imagepaths.length; i++){
                                fs.unlinkSync('./public' + imagepaths[i]); 
                            }
                            console.log(err) 
                            return res.status(500).send(err)
                        } 

                        console.log("berhasil set image path")

                        // sql = `UPDATE product set image_id = '${results2[0].id}' where name = '${results2[0].name}'`
                        // db.query(sql, (err, results4)=>{
                        //     if(err)  return res.status(500).send(err)
                        //     console.log("Berhasil SEMUANYA")
                        //     res.status(200).send(results2)
                        // })
                        res.status(200).send(results2)
                    })
                    
                })
            })
        })
    },
    deleteProduct : (req,res)=>{
        console.log(req.params.id)
        var productid = req.params.id
        var sql = `update product p set p.deleted = 1 where p.Id = ${productid}`
        db.query(sql, (err,results)=>{
            if(err){
                console.log("Masuk")
                return res.status(500).send("Delete Failed");
            }

            console.log("delete success")
            res.status(200).send(results)
    
        })
    },
    editimageProduct : (req,res)=>{
        console.log("masuk editimageproduct")
        const path = '/post/image/product'; //file save path
        const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {
            if(err){
                console.log("Masuk")
                return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
            }
            //UPLOAD BERHASIL
            var noimage = false
            const { image } = req.files;
            console.log(image)
            var imagepaths =[]
            if(image){

                for(var i = 0; i< image.length; i++){
                    var imgpath = image[i] ? path + '/' + image[i].filename : null
                    if(imgpath){
                        imagepaths.push(imgpath)
                    }
                }
                console.log(imagepaths)
            }else{
                noimage = true
            }
            // const imagePath = image ? path + '/' + image[0].filename : null;
            // console.log(imagePath)
            // console.log(imagepaths)

            console.log(req.body.data)
            const data = JSON.parse(req.body.data);
            console.log(data)
            if(noimage == false){

                data.productimg = imagepaths; // imagepaths is an array now
                console.log(data)
            }

            var sql = `select imagepath from image where product_id = ${data.id}`
            db.query(sql, (err,results)=>{
                if(err) throw err;
                // console.log(results) // ARR OF OBJ
                console.log(results)
                for(var i = 0; i<data.index.length; i++){
                    fs.unlinkSync('./public' + results[data.index[i]].imagepath);
                    sql = `update image set imagepath = '${data.productimg[i]}' where imagepath = '${results[data.index[i]].imagepath}'`
                    db.query(sql, (err, results2)=>{
                        if(err)throw err;

                        console.log("Berhasil diubah")

                    })
                }
                
                res.status(200).send("Success")
            })
            
        })

    },
    editProduct : (req,res) =>{
        var id = req.params.id
        console.log(req.body)
        var sql = `update product set ? where Id = ${id}`
        db.query(sql,req.body, (err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
        })
    },
    addImage : (req,res) =>{
        const path = '/post/image/product'; //file save path
        const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {
            if(err){
                console.log("Masuk")
                return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
            }
            //UPLOAD BERHASIL
            var noimage = false
            const { image } = req.files;
            console.log(image)
            var imagepaths =[]
            if(image){

                for(var i = 0; i< image.length; i++){
                    var imgpath = image[i] ? path + '/' + image[i].filename : null
                    if(imgpath){
                        imagepaths.push(imgpath)
                    }
                }
                console.log(imagepaths)
            }else{
                noimage = true
            }
            // const imagePath = image ? path + '/' + image[0].filename : null;
            // console.log(imagePath)
            // console.log(imagepaths)

            const data = JSON.parse(req.body.data);
  
            if(noimage == false){

                data.productimg = imagepaths; // imagepaths is an array now
                console.log(data)
            }

            var datas = []
            for(var i = 0; i<data.productimg.length;i++){
                
                datas.push([data.id, data.productimg[i]])
            }
            console.log(datas)

            //SQL
            sql = `INSERT INTO image (product_id, imagepath) VALUES ?`
            db.query(sql,[datas], (err,results)=>{
                if(err){
                    for(var i = 0; i < data.productimg.length ; i++){
                        fs.unlinkSync('./public' + data.productimg[i]);
                    }
                    throw err;
                } 
                // console.log(results) // ARR OF OBJ
                res.status(200).send("Success")
            })
            

            
        })
    },
    getReviews : (req, res)=>{
        var sql = `select u.username, r.rating,r.productid, r.description from review r join user u on r.userid = u.userid where r.productid = ${req.params.id}`
        db.query(sql, (err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
        })

    }
    

}