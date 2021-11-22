const express = require("express");
const router =  express.Router();

const forecasts = [
    {code: "Af", name: "Tropical rainforest climate Tropical Rainforest", color: "#960000"},
    {code: "Am", name: "Tropical monsoon climate Tropical Monsoon", color: "#FF0000"}
]

router.get("/", function(req, res){
    res.status(200).json(forecasts);
    console.log("Hämtade ut väderprognoser!");
})

router.get("/:name", function(req, res){
    console.log("Specifik stad: " + req.params.name);
    const forecast = forecasts.find(forecast=>forecast.code==req.params.name);
    if(forecast){
        res.type("application/json");
        res.status(200).send(forecast);
    }else{
       res.status(404).json({msg: "Hittade ingen stad med det namnet"});
    }
})

module.exports = router;