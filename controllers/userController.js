var db = require('../database')

module.exports = {
    getUserData : (req,res)=>{
        console.log(req.body.name)
        console.log(req.body.pass)
        var sql = `SELECT u.username, u.userid, u.password, s.name as shopname, r.name as userrole from user u 
        left join role r on u.role_id = r.id  left join shop s on u.userid = s.userid
        where username = '${req.body.name}' and password = '${req.body.pass}'`
    
    
        db.query(sql, (err,results)=>{
            if(err) throw err;
       
    
                
            res.status(200).send(results)
       
    
        })
    },
    registerUser : (req,res)=>{
        console.log(req.body)
      
    
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
    
        
}