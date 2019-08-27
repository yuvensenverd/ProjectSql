var db = require('../database')
const fs = require('fs')

module.exports = {
    getProductWaiting : (req,res) =>{
        var id = req.params.id
        console.log(id)
        var sql = `select p.name, ti.price, ti.qty, ti.productid, ti.status,sh.name as shop, st.transactiondate, GROUP_CONCAT(i.imagepath) AS images from product p join image i on 
        i.product_id = p.Id join transactionitem ti on p.Id = ti.productid join shop sh on p.shop_id = sh.userid
        join sumtransaction st on ti.transactionid = st.id where ti.status = 'Unconfirmed' AND st.userid = ${id}
        group by ti.id`
        db.query(sql,(err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
        })
    },
    getConfirmProduct : (req,res) =>{
        var id = req.params.id
        console.log(id)
        var sql = `select p.name as productname, ti.id as transactionid, u.userid, ti.price, ti.qty, ti.productid, ti.status,sh.name,u.username as buyer, st.transactiondate, GROUP_CONCAT(i.imagepath) AS images from product p join image i on 
        i.product_id = p.Id join transactionitem ti on p.Id = ti.productid join shop sh on p.shop_id = sh.userid 
        join sumtransaction st on ti.transactionid = st.id join user u on u.userid = st.userid where ti.status = 'Unconfirmed' AND p.shop_id = ${id}
        group by ti.id`
        db.query(sql,(err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
        })
    },
    confirmProduct : (req,res) =>{
        var id = req.params.id
        var sql = `update transactionitem set status = 'Confirmed' where id = ${id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Product Updated Confirmed")
            res.status(200).send(results)
        })
    },
    successProduct : (req,res) =>{
        var id = req.params.id
        var sql = `update transactionitem set status = 'Success' where id = ${id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Product Updated Success")
            res.status(200).send(results)
        })
    },
    getConfirmedProduct : (req,res) =>{
        var id = req.params.id
        console.log(id)
        var sql = `select p.name, ti.price, ti.qty, ti.id as transactionid, ti.productid, ti.status,sh.name as shop, st.transactiondate, GROUP_CONCAT(i.imagepath) AS images from product p join image i on 
        i.product_id = p.Id join transactionitem ti on p.Id = ti.productid join shop sh on p.shop_id = sh.userid
        join sumtransaction st on ti.transactionid = st.id where ti.status = 'Confirmed' AND st.userid = ${id}
        group by ti.id`
        db.query(sql,(err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
        })
    },
    getNotificationLength : (req,res) =>{
        console.log(req.params.id)
        var sql = `select count(ti.id) as NOTIFLEN from  transactionitem ti join sumtransaction st on ti.transactionid = st.id 
        where (ti.status = 'Confirmed' OR ti.status = 'Unconfirmed') AND st.userid = 1`
        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Product Updated Success")
            res.status(200).send(results)
        })
    }
}