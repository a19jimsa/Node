const { response } = require("express");
const express = require("express");
const router =  express.Router();

const forecasts = [
            {name: "Arjeplog", fromtime: "2020-01-01 00:00:00", totime: "2020-01-01 06:00:00", periodno: "0", periodname: "night", auxdata: {"TUNIT":"celsius","TVALUE":"6.4","ALTUNIT":"fahrenheit","ALTVALUE":"43.52","NUMBER":"4","WSYMB3NUMBER":"6","NAME":"Cloudy","RUNIT":"mm","RVALUE":"0","DEG":"22","CODE":"NNE","NAME":"North-northeast","MPS":"0.4","NAME":"Calm","UNIT":"hPa","VALUE":"837"}},
            {name: "Arjeplog",fromtime:"2020-01-02 00:00:00",totime:"2020-01-02 06:00:00",periodno:"0",periodname:"Night",auxdata:{"TUNIT":"celsius","TVALUE":"-8.2","ALTUNIT":"fahrenheit","ALTVALUE":"17.24","NUMBER":"10","WSYMB3NUMBER":"23","FNAME":"Sleet","RUNIT":"mm","RVALUE":"1.2","DEG":"257","CODE":"SW","NAME":"Southwest","MPS":"14.4","NAME":"Near Gale","UNIT":"hPa","VALUE":"1276"}},
            {name:"Arjeplog",fromtime:"2020-01-03 00:00:00",totime:"2020-01-03 06:00:00",periodno:"0",periodname:"Night",auxdata:{"TUNIT":"celsius","TVALUE":"-8.7","ALTUNIT":"fahrenheit","ALTVALUE":"16.34","NUMBER":"11","WSYMB3NUMBER":"25","FNAME":"Light snow","RUNIT":"mm","RVALUE":"1.7","DEG":"257","CODE":"W","NAME":"West","MPS":"15.3","NAME":"Near Gale","UNIT":"hPa","VALUE":"1267"}},
            {name:"Grums",fromtime:"2020-01-03 00:00:00",totime:"2020-01-03 06:00:00",periodno:"0",periodname:"Night",auxdata:{"TUNIT":"celsius","TVALUE":"-8.7","ALTUNIT":"fahrenheit","ALTVALUE":"16.34","NUMBER":"11","WSYMB3NUMBER":"25","FNAME":"Light snow","RUNIT":"mm","RVALUE":"1.7","DEG":"257","CODE":"W","NAME":"West","MPS":"15.3","NAME":"Near Gale","UNIT":"hPa","VALUE":"1267"}}
        ]

router.get("/", function(req, res){
    res.status(200).json(forecasts);
    console.log("Hämtade ut väderprognoser!");
})

router.get("/:name/:fromtime", function(req, res){
    const forecast = forecasts.find(forecast=>forecast.name==req.params.name&&forecast.fromtime.substring(0, 10)==req.params.fromtime);
    if(forecast){
        res.type("application/json");
        res.status(200).send(forecast);
    }else{
        res.status(404).json({msg: "Hittade ingen kod!"});
    }
})
//Get forcecast from specific city or specific date
router.get("/:name", function(req, res){
    console.log("Specifik stad: " + req.params.name);
    const city = forecasts.slice(-1).find(city=>city.name==req.params.name);
    console.log(city);
    const fromtime = forecasts.find(fromtime=>fromtime.fromtime.substring(0, 10)==req.params.name);
    console.log(req.params.name);
    if(city){
        res.type("application/json");
        res.status(200).send(city);
    }else if(fromtime){
        res.type("application/json");
        res.status(200).send(fromtime);
    }else{
       res.status(404).json({msg: "Hittade ingen med det namnet"});
    }
})

router.get("/:climatecode/:date", function(req, res){
    
})

module.exports = router;