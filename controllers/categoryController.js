var db = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    getCategories : (req,res)=>{
        var sql = `SELECT * FROM category`
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
      
            res.status(200).send(results)
       
    
        })
    },
    addCategory : (req,res)=>{
        console.log("Masuk category add")
        const path = '/post/image/category'; //file save path
        const upload = uploader(path, 'CAT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

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
            
            data.image = imagePath;

            var sql = `insert into category set ?`
            db.query(sql, data, (err1, results1) => {
                if(err) {
                    console.log(err.message)
                    fs.unlinkSync('./public' + imagePath);
                    return res.status(500).json({ message: "There's an error on uploading files. Please contact the administrator.", error: err.message });
                }
                console.log(results1)
                console.log(sql)

                console.log("berhasil insert")
                // res.status(200).send(results1)

                sql = `select * from category`

                db.query(sql, (err,results2)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    console.log("berhasil")

                    res.status(200).send(results2)
                })

            })
            
        })
    },
    editCategory : (req,res)=>{
        console.log("Masuk category edit")
        console.log(req.params.id)

        
        // select 
        
        //
        console.log("Uploading image...")

        const path = '/post/image/category'; //file save path
        const upload = uploader(path, 'CAT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {
            if(err){
                console.log("Masuk")
                return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
            }
            var editimage = true
            const { image } = req.files;
            console.log(image)
            const imagePath = image ? path + '/' + image[0].filename : null;
            console.log(imagePath)

            console.log(req.body.data)
            const data = JSON.parse(req.body.data);
            if(imagePath){
                data.image = imagePath;
            }else{
                console.log("no image")
                editimage = false
            }
            

            var sql = `select * from category where id = ${req.params.id}`
            db.query(sql, (err,results)=>{
                if(err){
                    console.log(err)
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                }
                console.log("berhasil")
                if(results.length > 0){
                    console.log("ada data")
                    var oldimgpath = results[0].image
                    if(oldimgpath && editimage == true){
                        fs.unlinkSync('./public' + oldimgpath);
                    }
                }
            
            })

            var sql = `update category set ? where id = ${req.params.id}`
            db.query(sql, data, (err1, results1) => {
                if(err) {
                    console.log(err.message)
                    fs.unlinkSync('./public' + imagePath);
                    return res.status(500).json({ message: "There's an error on uploading files. Please contact the administrator.", error: err.message });
                }
                console.log(results1)
                console.log(sql)

                console.log("berhasil update category image")
                // res.status(200).send(results1)

                sql = `select * from category`

                db.query(sql, (err,results2)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    console.log("berhasil")

                    res.status(200).send(results2)
                })

            })
            
        })
    }

}