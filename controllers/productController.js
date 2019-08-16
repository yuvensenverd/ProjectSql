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
        var sql = `select p.id, p.name, p.price, p.description, s.name as shopname, s.description as shopdesc, p.rating, 
        GROUP_CONCAT(i.imagepath) AS images, c.name as category from product p  left join category c on p.cat_id = c.id  left join shop s on 
        p.shop_id = s.userid left join image i on p.id= i.product_id `
        
        if(req.query.cat){
            sql += `where c.name = '${req.query.cat}' `
        }
        if(req.query.id){
            sql += `where p.id = '${req.query.id}' `
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
            const { image } = req.files;
            console.log(image)
            var imagepaths =[]
            for(var i = 0; i< image.length; i++){
                var imgpath = image[i] ? path + '/' + image[i].filename : null
                if(imgpath){
                    imagepaths.push(imgpath)
                }
            }
            console.log(imagepaths)
            // const imagePath = image ? path + '/' + image[0].filename : null;
            // console.log(imagePath)
            // console.log(imagepaths)

            console.log(req.body.data)
            const data = JSON.parse(req.body.data);
            data.productimg = imagepaths; // imagepaths is an array now
            console.log(data)
            
            var sql = `INSERT INTO product set name = '${data.name}', price = ${data.price}, cat_id = (select id from category where name = '${data.cat_name}'),
                        shop_id = ${data.shop_id}, Description = '${data.description}', Rating = ${data.rating}`

            db.query(sql, (err, results)=>{
                if(err) res.status(500).send(err)

                console.log("Masuk gak error")
                // get product id baru
                sql = `select id, name from product where name = '${data.name}'`
                db.query(sql, (err,results2)=>{
                    if(err) res.status(500).send(err)

                    console.log(results2)
                    console.log(results2[0].id)
                    
                    // taro imagepath di table image
                    // var dataimg = {
                    //     product_id : results2[0].id,
                    //     imagepath : data.productimg
                    // }
                    var datas = []
                    for(var i = 0; i<data.productimg.length;i++){
                        // datas.push({
                        //     product_id : results2[0].id,
                        //     imagepath : data.productimg[i]
                        // })
                        datas.push([results2[0].id, data.productimg[i]])
                    }

                    console.log(datas)
                


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
                    })
                    
                })
            })
        })
    }
    

}

//  saveProfile : (req,res) =>{
//         try {
//             console.log("Masuk ADD POST")
//             const path = '/post/image/user'; //file save path
//             const upload = uploader(path, 'AVT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
//             upload(req, res, (err) => {
//                 if(err){
//                     console.log("Masuk")
//                     return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
//                 }
             
//                 const { image } = req.files;
//                 console.log(image)
//                 const imagePath = image ? path + '/' + image[0].filename : null;
//                 console.log(imagePath)
    
//                 console.log(req.body.data)
//                 const data = JSON.parse(req.body.data);
               
//                 data.profileimg = imagePath;

//                 var sql = `select profileimg from user where (userid = ${data.userid})`
//                 db.query(sql,  (err1, results1) => {
//                     if(err) {
//                         console.log(err.message)
//                         fs.unlinkSync('./public' + imagePath);
//                         return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
//                     }
//                     console.log(results1)
//                     if(results1[0].profileimg){
//                         console.log("ADA PATH LAMA")
//                         console.log(results1[0].profileimg)
//                         fs.unlinkSync('./public'+results1[0].profileimg)
//                         console.log("old file deleted")
//                     }
                    
      
                   
//                 })
                
//                 sql = `UPDATE USER SET profileimg = '${data.profileimg}' WHERE (userid = ${data.userid});`
//                 db.query(sql,  (err, results) => {
//                     if(err) {
//                         console.log(err.message)
//                         fs.unlinkSync('./public' + imagePath);
//                         return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
//                     }
                    
//                     console.log("Path image berhasil di update")

//                     sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
//                             left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
//                             where u.userid = '${data.userid}'`
                        
    
//                     db.query(sql, (err,results)=>{
//                         if(err) throw err;
                
                
                            
//                         res.status(200).send(results)
                
//                     })
                    
//                 })

                

//             })
//         } catch(err) {
//             return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
//         }
//     }