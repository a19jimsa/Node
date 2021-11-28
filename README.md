# Node

Här skapas ett REST API med express.js och Node. Sidan använder JSON för att hämta och skapa data till hemsidan.

```javascript
const { application } = require("express");
const express = require("express");

const app = express();

app.use('/', express.static('src'))
app.use('/components', express.static('components'))

const usersRoute = require("./usersRoute")
app.use("/users", usersRoute)

const climatecodesRoute = require("./climatecodesRoute")
app.use("/climatecodes", climatecodesRoute)

const commentsRoute = require("./commentsRoute")
app.use("/comments", commentsRoute);

const forecastRoute = require("./forecastRoute")
app.use("/forecast", forecastRoute);

//Hämtar ut startup.html när localhost:3000 körs.
app.get('/', function(req, res){
    res.sendFile('src/startup.html',{root: '.'})
    console.log("Start");
})

app.listen(3000, function (){
    console.log("Server started")
})
```

Här används ett antal routes för att dela upp och skapa olika endpoints i olika filer.
Så istället för att behöva säga vilken endpoints som skall ändras så finns de istället olika routes som specificerar vilken endpoint som berörs.

## Routes - Endpoints

Just i denna stund används arrayer för att skapa och hämta ut data till och från. Vilket senare kommer bytas ut mot en databas. Detta mest för att testa endpointsen.

Det finns ett antal olika endpoints för att hämta ut data från exempelvis en forecast.

```javascript
// GET latest forecast from date and city. G
router.get("/:city/:date", function(req, res, next){
    const cityanddate = forecasts.slice(-1).find(forecast=>forecast.name==req.params.city&&forecast.fromtime.substring(0, 10)==req.params.date);
    if(cityanddate){
        res.type("application/json");
        res.status(200).send(cityanddate);
    }else{
        console.log("hittade inget på stad och datum");
        next();
    }
})

//GET All forecast with code and date or date. VG
router.get("/:code/:date", function(req, res){
    const codeanddate = forecasts.filter(codeanddate=>codeanddate.fromtime.substring(0, 10) == req.params.date&&codeanddate.code==req.params.code);
    console.log(req.params.date);
    const date = forecasts.filter(forecast=>forecast.fromtime.substring(0,10) == req.params.date);
    console.log(date);
    if(codeanddate.length > 0){
        res.type("application/json");
        res.status(200).send(codeanddate);
    }else if(date.length > 0){
        res.type("application/json");
        res.status(200).send(date);
    }else{
        res.status(404).json({msg:"Hittade inget!"});
    }
})

//Get last forcecast from specific city or specific date
router.get("/:name", function(req, res){
    const city = forecasts.reverse().find(city=>city.name==req.params.name);
    const fromtime = forecasts.find(fromtime=>fromtime.fromtime.substring(0, 10)==req.params.name);
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
```

Här hämtas olika sorts data ut från en forecast. Genom sedan att anropa dessa endpoints så hämtas specifik data ut beroende på vad som skrevs in.
Det sker olika filrtreringa beroende på vad som skickas in och vad som skall fås ut. T ex en specifik forecast eller alla forecast för en stad.




