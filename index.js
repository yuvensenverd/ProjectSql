var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = 1998
const { cartRouter,productRouter,shopRouter,userRouter,categoryRouter} = require('./routers')



app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public')) // JADI DEFAULTNYA KE /PUBLIC
app.use(cors())
app.use(bodyParser.json())
app.use('/cart', cartRouter)
app.use('/product', productRouter)
app.use('/shop', shopRouter)
app.use('/user', userRouter)
app.use('/category', categoryRouter)


app.listen(port, ()=> console.log(` Api aktif di port  ${port} `))

























// app.get('/getproduct', (req,res) => {
  

//     var sql = 
//     `SELECT * from product;`;

//     //  AND USIA BETWEEN ${req.query.usiaMin} AND ${req.query.usiaMax};

    
//     // console.log(res) // SERVER RESP
//     db.query(sql, (err,results)=>{
//         if(err) throw err;
//         // console.log(results) // ARR OF OBJ
//         res.status(200).send(results)
   

//     })
// })

// app.get('/users', (req,res)=>{
//     var sql = `SELECT username, password from user`

//     db.query(sql, (err,results)=>{
//         if(err) throw err;
   

//         console.log(results)
//         res.status(200).send(results)
   

//     })
// })

// app.get('/users', (req,res)=>{
//     console.log(req.query.name)
//     console.log(req.query.pass)
//     var sql = `SELECT u.username, u.userid, u.password, r.name as userrole, count(c.userid) as cartlength from user u 
//     left join role r on u.role_id = r.id left join cartproduct c on c.userid = u.userid
//     where username = '${req.query.name}' and password = '${req.query.pass}'`


//     db.query(sql, (err,results)=>{
//         if(err) throw err;
   

            
//         res.status(200).send(results)
   

//     })
// })

// app.post('/users', (req,res)=>{
//     console.log(req.body)
  

//     var sql = `Insert into user set ?`
//     db.query(sql,req.body, (err,result)=>{
    

//         if(err) res.status(500).send(err);

//         console.log(sql)

        
//         console.log("Register Success")
     
//         // console.log("masuk post a")
      
//         // res.status(200).send(result)
//         res.status(200).send(result)
//     })
    

// })

// app.get('/categories', (req,res)=>{
//     var sql = `SELECT * FROM category`
//     db.query(sql, (err,results)=>{
//         if(err) throw err;
   

  
//         res.status(200).send(results)
   

//     })
// })

// app.get('/products', (req,res)=>{
//     var sql = `select p.id, p.name, p.price, p.desc, s.name as shopname, s.description as shopdesc, p.rating, p.image, c.name as category from product p  join category c
//     on p.cat_id = c.id  join shop s on p.shop_id = s.userid   `
    
//     if(req.query.cat){
//         sql += `where c.name = '${req.query.cat}'`
//     }
//     if(req.query.id){
//         sql += `where p.id = '${req.query.id}'`
//     }

//     db.query(sql, (err,results)=>{
//         if(err) res.status(500).send(err);

      
//         res.status(200).send(results)
   

//     })

// })

// app.post('/createshop', (req,res)=>{
//     console.log(req.body)
  
//     var sql = `insert into shop  values ((select userid from user where username = '${req.query.user}'),'${req.body.name}', '${req.body.description}', ${req.body.shopimage})`
    
//     db.query(sql, (err,result)=>{
       

//         if(err) res.status(500).send(err);

        
//         console.log("Register Shop Success")
     
//         // console.log("masuk post a")
      
//         // res.status(200).send(result)
//         res.status(200).send(result)
//     })
// })


// app.post('/addtocart', (req,res)=>{
//     console.log(req.query.user)
//     var sql = `insert into cartproduct (userid, quantity, productid) values ((select userid from user where username = '${req.query.user}'),'${req.body.qty}', '${req.body.productid}')`
//     db.query(sql, (err,result)=>{
       

//         if(err) res.status(500).send(err);

        
//         console.log("Add Cart Success")
     
//         // console.log("masuk post a")
      
//         // res.status(200).send(result)
//         res.status(200).send(result)
//     })
// })

// app.get('/getcart', (req,res)=>{
//     var sql = `select ca.name, p.id, p.image, p.name, p.price,
//     SUM(c.quantity) as qty, p.rating, shop.name as shopname from product p 
//     join cartproduct c on p.id = c.productid join category ca on p.cat_id = ca.id join shop on p.shop_id = shop.userid 
//     join user u on u.userid = c.userid where u.username = '${req.query.user}'
//     group by p.id`

//      db.query(sql, (err,result)=>{
       

//         if(err) res.status(500).send(err);

        
//         console.log("Add Cart Success")
     
//         // console.log("masuk post a")
      
//         // res.status(200).send(result)
//         res.status(200).send(result)
//     })
// })





