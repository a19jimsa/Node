var sqlite3 = require("sqlite3").verbose();
const express = require("express");
const router =  express.Router();

let db = new sqlite3.Database("./Weather.db", (err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("conneced to database");
    }
})

const climatecodes = [
    {code: "Af", name: "Tropical rainforest climate Tropical Rainforest", color: "#960000"},
    {code: "Am", name: "Tropical monsoon climate Tropical Monsoon", color: "#FF0000"}
]

router.get("/", function(req, res){
    res.status(200).json(climatecodes);
    console.log("Hämtade ut klimatkoder!");
});

module.exports = router;