var db = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    getUserData : (req,res)=>{
 
        var sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
        left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
        where username = '${req.body.name}' and password = '${req.body.pass}'`
    
    
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
                
            res.status(200).send(results)
       
    
        })
    },
    registerUser : (req,res)=>{

      
    
        var sql = `Insert into user set ?`
        db.query(sql,req.body, (err,result)=>{
        
    
            if(err) res.status(500).send(err);
    
            console.log(sql)
    
            
            console.log("Register Success")
         
            // console.log("masuk post a")
          
            // res.status(200).send(result)
            res.status(200).send(result)
        })
    },
    saveProfile : (req,res) =>{
        try {
            console.log(req.body.data)
            console.log(req.body)
            console.log("Masuk ADD POST")
            const path = '/post/image/user'; //file save path
            const upload = uploader(path, 'AVT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
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

                var sql = `select profileimg from user where (userid = ${data.userid})`
                db.query(sql,  (err1, results1) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    console.log(results1)
                    if(results1[0].profileimg){
                        console.log("ADA PATH LAMA")
                        console.log(results1[0].profileimg)
                        fs.unlinkSync('./public'+results1[0].profileimg)
                        console.log("old file deleted")
                    }
                    
      
                   
                })
                
                sql = `UPDATE USER SET profileimg = '${data.profileimg}' WHERE (userid = ${data.userid});`
                db.query(sql,  (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    
                    console.log("Path image berhasil di update")

                    sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
                            left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
                            where u.userid = '${data.userid}'`
                        
    
                    db.query(sql, (err,results)=>{
                        if(err) throw err;
                
                
                            
                        res.status(200).send(results)
                
                    })
                    
                })

                

            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    }


















    // getProfileUser : (req,res)=>{
 
    //     var sql = `select username, saldo, password, phonenumber, residence from user where userid = ${req.body.id}`
    
    
    //     db.query(sql, (err,results)=>{
    //         if(err)   throw err ;
    //         console.log("Berhasil get")
       
    
                
    //         res.status(200).send(results)
       
    
    //     })
    // }
    
        
}