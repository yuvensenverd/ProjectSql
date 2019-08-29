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
    cancelProduct : (req,res) =>{
        var id = req.params.id
        var sql = `update transactionitem set status = 'Cancelled' where id = ${id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Cancel Product")
            res.status(200).send(results)
        })
    },
    successProduct : (req,res) =>{
        var id = req.params.id
        var data = req.body
        var sql = `update transactionitem set status = 'Success' where id = ${id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;
            console.log("Update Success")
            sql = `insert into review set ?`
        
            db.query(sql,data, (err,results)=>{
                if(err) throw err;
    
                console.log('Insert Review Product Success')
    
                console.log("Cancel Product")
                res.status(200).send(results)
            })
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
        console.log("Masuk notiflen")
        var sql = `select count(ti.id) as NOTIFLEN from  transactionitem ti join sumtransaction st on ti.transactionid = st.id 
        where (ti.status = 'Confirmed' OR ti.status = 'Unconfirmed') AND st.userid = ${req.params.id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Product Updated Success")
            res.status(200).send(results)
        })
    },
    getUserTransactionHistory : (req,res) =>{
        console.log(req.params.id)
        var sql = `select st.transactiondate, st.totalprice, st.userid, st.id as transid from sumtransaction st 
        where st.userid = ${req.params.id} AND st.deleted = 0
        order by transid `

        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Get History Success")
            res.status(200).send(results)
        })
    },
    getTransactionDetail : (req,res) =>{
        console.log(req.params.id)
        console.log(req.params.tid)
        //and (ti.status = 'Confirmed' OR ti.status = 'Success')
        var sql = `select p.name as productname, ti.status, ti.transactionid, ti.price, ti.qty, GROUP_CONCAT(i.imagepath) as images, s.name from transactionitem ti
        join product p on ti.productid = p.Id join image i on i.product_id = p.Id join shop s on p.shop_id =  s.userid join sumtransaction st
        on st.id = ti.transactionid where st.userid = ${req.params.id} and ti.transactionid = ${req.params.tid}
        group by ti.id`

        db.query(sql,(err,results)=>{
            if(err) throw err;

            console.log(sql)

            console.log("Get Detail Success")
            res.status(200).send(results)
        })
    },
    getHistoryShop : (req,res) =>{
        console.log(req.params.id)
        var sql = `select ti.id as transid, st.id as sumid, st.transactiondate, u.username as buyer, ti.status, p.name, ti.qty, ti.price, GROUP_CONCAT(i.imagepath) as images
        from sumtransaction st join transactionitem ti on st.id = ti.transactionid join product p on ti.productid = p.Id join
        image i on i.product_id = p.Id join user u on st.userid = u.userid where p.shop_id = ${req.params.id} and (ti.status = 'Confirmed' OR ti.status = 'Success' OR ti.status = 'Cancelled')
        and ti.deleted = 0
        group by ti.id `
        db.query(sql,(err,results)=>{
            if(err) throw err;


            console.log("Get Product Shop History Success")
            res.status(200).send(results)
        })
    },
    deleteUserTransaction : (req,res) =>{
        console.log(req.params.id)
        var sql = `update sumtransaction st set st.deleted = 1 where st.id = ${req.params.id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;


            console.log("Update Status Delete Transaction Success")
            res.status(200).send(results)
        })
    },
    transactionItemDelete : (req,res) =>{
        console.log(req.params.id)
        var sql = `update transactionitem ti set ti.deleted = 1 where ti.id = ${req.params.id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;


            console.log("Update Status Delete Transaction Shop Success")
            res.status(200).send(results)
        })
    }
}