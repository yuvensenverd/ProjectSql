var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var mysql = require('mysql')
var port = 1998


var db = mysql.createConnection({
    host : 'localhost',
    user : 'enverd',
    password : '123123123',
    database : 'projectjc',
    port : 3306
})

db.connect(function(err) {
    if (err) throw err;

    console.log("Connected!");
  });

app.use(cors())
app.use(bodyParser.json())

app.get('/getproduct', (req,res) => {
  

    var sql = 
    `SELECT * from product;`;

    //  AND USIA BETWEEN ${req.query.usiaMin} AND ${req.query.usiaMax};

    

    db.query(sql, (err,results)=>{
        if(err) throw err;
        console.log("error kodong");

        console.log(results)
        res.status(200).send(results)
   

    })
})

// app.get('/users', (req,res)=>{
//     var sql = `SELECT username, password from user`

//     db.query(sql, (err,results)=>{
//         if(err) throw err;
   

//         console.log(results)
//         res.status(200).send(results)
   

//     })
// })

app.get('/users', (req,res)=>{
    console.log(req.query.name)
    console.log(req.query.pass)
    var sql = `SELECT username, password from user where username = '${req.query.name}' and password = '${req.query.pass}'`
    console.log(sql)

    db.query(sql, (err,results)=>{
        if(err) throw err;
   

        console.log(results)
        res.status(200).send(results)
   

    })
})

app.post('/users', (req,res)=>{
    console.log(req.body)

    var sql = `Insert into user set ?`
    db.query(sql,req.body, (err,result)=>{

        if(err) res.status(500).send(err);

        
        console.log("Register Success")
     
        // console.log("masuk post a")
        console.log(result)
        // res.status(200).send(result)
        res.status(200).send(result)
    })
    
    // COPYAN
    // var data = req.body
    // console.log(data)


    // var sql = `Insert into category set ?`
    // db.query(sql, req.body, (err,results)=>{
    //     if(err) res.status(500).send(err);

    //     // console.log(results)
    //     // res.status(202).send(results)
    //     sql = `SELECT * from category`


    //     db.query(sql, (err,results)=>{
    //         if(err) res.status(500).send(err);
    
    //         console.log(results)
    //         res.status(200).send(results)
       
    
    //     })
    // })
})

app.get('/categories', (req,res)=>{
    var sql = `SELECT * FROM category`
    db.query(sql, (err,results)=>{
        if(err) throw err;
   

        console.log(results)
        res.status(200).send(results)
   

    })
})

app.get('/products', (req,res)=>{
    var sql = `select p.name, p.price, p.image, c.name as category from product p join category c
    on p.cat_id = c.id `
    
    if(req.query.cat){
        sql += `where c.name = '${req.query.cat}'`
    }

    db.query(sql, (err,results)=>{
        if(err) res.status(500).send(err);

        console.log(results)
        res.status(200).send(results)
   

    })

})




app.listen(port, ()=> console.log(` Api aktif di port  ${port} `))