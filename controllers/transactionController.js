var db = require('../database')
const fs = require('fs')

module.exports = {
    getProductWaiting : (req,res) =>{
        var id = req.params.id
        console.log(id)
        var sql = `select p.name, ti.price, ti.qty, ti.productid, ti.status from product p join transactionitem ti on p.Id = ti.productid
        join sumtransaction st on ti.transactionid = st.id where ti.status = 'Unconfirmed' AND st.userid = ${id}`
        db.query(sql,(err,results)=>{
            if(err) throw err;
            // console.log(results) // ARR OF OBJ
            res.status(200).send(results)
        })
    }
}