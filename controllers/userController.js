var db = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')
const {encrypt}=require('../helpers/encrypts')
const transporter= require('../helpers/mailer')
const { createJWTToken } = require('../helpers/jwt')

module.exports = {
    getUserData : (req,res)=>{
        // evnrypt
      
        var hashpassword = encrypt(req.body.pass)
       
        
        var sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.status, u.password, s.name as shopname, r.name as userrole from user u 
        left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
        where username = '${req.body.name}' and password = '${hashpassword}'`
        
        
        
    
        db.query(sql, (err,results)=>{
            if(err){
                throw err
            } 
            if(results.length === 0){
                return res.status(500).send({status : 'error', err : 'USERNAME OR PASSWORD INCORRECT'})
            }
       
    
            const token = createJWTToken({username : results[0].username, password : results[0].password})
            results.push(token)
            res.status(200).send(results)
       
    
        })
    },
    checkRegisterUser : (req,res)=>{
        var sql = `select u.userid from user u where u.username = '${req.body.name}' `
        db.query(sql, (err,results)=>{
            if(err) throw err;
    
    
                
            res.status(200).send(results)
    
        })
    },
    registerUser : (req,res)=>{
        

        var encrypted = encrypt(req.body.password)
        req.body.password = encrypted
      

        var sql = `Insert into user set ?`
        db.query(sql,req.body, (err,result)=>{
        
    
            if(err) res.status(500).send(err);
    
      
    
            
   
            sql = `SELECT username, password from user where username = '${req.body.username}'`
            db.query(sql, (err, result2)=>{
           

                var linkVerifikasi = `http://localhost:3000/verified?username=${req.body.username}&password=${encrypted}`
                var mailOptions = {
                    from : 'App <yuvensenverd@yahoo.com>',
                    to: req.body.email,
                    subject: 'Email Verification',
                    html : `Please Click This Link for Verification
                    <a href="${linkVerifikasi}">Join</a>`
                }

                transporter.sendMail(mailOptions, (err2,res2)=>{
                    if(err2){
                        console.log(err2)
                        return res.status(500).send({status : 'error', err : err2})
                    }
                    
             
                    return res.status(200).send(result2)
                })

                
            })
            // console.log("masuk post a")
          
            // res.status(200).send(result)
           
        })
    },
    saveProfile : (req,res) =>{
        try {
          
            const path = '/post/image/user'; //file save path
            const upload = uploader(path, 'AVT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    console.log("Masuk")
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
             
                const { image } = req.files;
            
                const imagePath = image ? path + '/' + image[0].filename : null;
              
                const data = JSON.parse(req.body.data);
               
                data.profileimg = imagePath;

                var sql = `select profileimg from user where (userid = ${data.userid})`
                db.query(sql,  (err1, results1) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                
                    if(results1[0].profileimg){
                      
                        fs.unlinkSync('./public'+results1[0].profileimg)
                     
                    }
                    
      
                   
                })
                
                sql = `UPDATE USER SET profileimg = '${data.profileimg}' WHERE (userid = ${data.userid});`
                db.query(sql,  (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    
              

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
    },
    emailVerification : (req,res) =>{
        var { username, password} = req.body;
        var sql = `Select username,email from user where username = '${username}'`
    

        db.query(sql, (err, results)=>{
            if(err) return res.status(500).send({status : 'error', err })

            if(results.length === 0){
                return res.status(500).send({ status : 'error', err : 'Users Not Found'})
            }
          

            sql = `Update user set status='Verified' where username = '${username}' and password='${password}'`
            db.query(sql, (err,results1)=>{
                if(err) return res.status(500).send({status : 'error', err })

                return res.status(200).send(results)
            })
        })
    },
    resendEmailVer : (req,res) =>{
        var {username, email}= req.body
       
        var sql = `select username, password, email from user where username = '${username}' and email = '${email}'`
        db.query(sql, (err,results)=>{
            if(err){
                console.log(err)
                return res.status(500).send({status : 'error', err })
            }

            if(results.length === 0) {
                return res.status(500).send({status : 'error', err : 'user not found'})
            }

            var linkVerifikasi = `http://localhost:3000/verified?username=${req.body.username}&password=${results[0].password}`
            var mailOptions = {
                from : 'App <yuvensenverd@gmail.com>',
                to: email,
                subject: 'Email Verification',
                html : `Please Click This Link for Verification
                <a href="${linkVerifikasi}">Join</a>`
            }

            transporter.sendMail(mailOptions, (err2,res2)=>{
                if(err2){
                    console.log(err2)
                    return res.status(500).send({status : 'error', err : err2})
                }
                
              
                return res.status(200).send(results)
            })


         })

    },
    adminGetUser : (req,res) =>{
        var sql = `select u.username, u.email, u.saldo, r.name as role,u.userid, u.status  from user u join role r on u.role_id = r.id`
        db.query(sql, (err,results)=>{
            if(err) throw err;
    
    
                
            res.status(200).send(results)
    
        })
    },
    loginToken : (req,res) => {
     

        
        var sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.status, u.password, s.name as shopname, r.name as userrole from user u 
        left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
        where username = '${req.user.username}' and password = '${req.user.password}'`
        
        
        
    
        db.query(sql, (err,results)=>{
            if(err) throw err;
            
            if(results.length === 0){
                return res.status(500).send({status : 'error', err : 'Token Invalid , Please Relog in the Login Page'})
            }
    
       
            const token = createJWTToken({username : results[0].username, password : results[0].password})
            results.push(token)
            res.status(200).send(results)
       
    
        })
    },
    changeResidence : (req,res) =>{
 
        var sql = `update user set residence = '${req.body.residence}' where userid = ${req.body.id}`
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
            sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
                            left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
                            where u.userid = ${req.body.id}`
                        
    
            db.query(sql, (err,results2)=>{
                if(err) throw err;
        
        
                    
                res.status(200).send(results2)
        
            })
       
    
        })

    },
    onUserTransaction : (req,res) =>{
   
        req.body.balance = parseInt(req.body.balance)
  
        var sql = `UPDATE user u set u.saldo = u.saldo+${req.body.balance} where u.userid = ${req.body.userid}`
        db.query(sql, (err,results)=>{
            if(err) throw err;

            sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
            left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
            where u.userid = ${req.body.userid}`

            db.query(sql, (err,results2)=>{
                if(err) throw err;
        
        
                    
                res.status(200).send(results2)
        
            })
        

            
    
        })
    },
    onChangePassword : (req,res) =>{
        var sql = `select u.password from user u where u.userid = ${req.body.userid}`
        db.query(sql, (err,results)=>{
            if(err) throw err;
            
       
            if(results[0].password === encrypt(req.body.oldpass)){ // confirm pass lama
                var encrypted = encrypt(req.body.password)
                req.body.password = encrypted
           
                var sql = `update user u set u.password = '${req.body.password}' where u.userid = ${req.body.userid}`
                db.query(sql, (err,results2)=>{
                    if(err) throw err;
            
                    sql = `SELECT u.username,u.saldo,u.profileimg, u.phonenumber,u.email, u.residence, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
                    left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
                    where u.userid = ${req.body.userid}`
                
        
                    db.query(sql, (err,results3)=>{
                    if(err) throw err;
        
        
            
                    res.status(200).send(results3)
        
                    })
                        
                })


            }else{
                res.status(500).send({status : 'error', err : 'OLD Password incorrect!'})
            }
    
    
        })


  
    },
    adminEditUser : (req,res) =>{
      
        var sql = `select * from role`
        db.query(sql,req.body, (err,results2)=>{
            if(err) throw err;
            var find = false
            for(var i = 0 ; i<results2.length ; i++){
                if(results2[i].name === req.body.role){
                    req.body.role_id = results2[i].id
                    find = true
            
                    delete req.body.role
                    break;
                }
            }
            if(find === false){
                return res.status(500).send({status : 'error', err : 'Role Not Found!'})
            }
       
            sql = `update user u set ? where u.userid = ${req.params.id}`
            db.query(sql,req.body, (err,results)=>{
                if(err) throw err;



                res.status(200).send(results)

            })

    
       

        })
        
    }
}