var db = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    getBannerImg : (req,res)=>{
        console.log("msk bnner")
        var sql = `SELECT * FROM banner`
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
      
            res.status(200).send(results)
       
    
        })
    },
    addBannerImg : (req,res) => {
        console.log("masuk add banner")

        const path = '/post/image/banner'; //file save path
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

            var sql = `insert into banner set ?`
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

           

                res.status(200).send(results1)
               

            })
            
        })
    },
    getBannerPath : (req,res) => {
        var sql = `select GROUP_CONCAT(image) AS images from banner`
        console.log("Masuk banner path")
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
      
            res.status(200).send(results)
       
    
        })

    },
    deleteBanner : (req,res) => {
        console.log(req.params.id)
        var sql = `select image from banner where idbanner = ${req.params.id}`
        db.query(sql, (err,results1)=>{
            if(err) throw err;

            console.log(results1[0].image)
            fs.unlinkSync('./public' + results1[0].image);
            console.log("Selesai Delete File Lama")
      
            sql = `delete from banner where idbanner = ${req.params.id}`
    
            db.query(sql, (err,results)=>{
                if(err) throw err;
           
        
          
                res.status(200).send(results)
           
        
            })
            
        })

    }

}