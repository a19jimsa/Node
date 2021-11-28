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

## Comments

```javascript
//GET all comments
router.get("/", function(req, res){
    res.status(200).json(comments);
})

//GET all comments on a city
router.get("/:location", function(req, res){
    var citycomments = comments.filter(comment=>comment.location==req.params.location).reverse();
    if(req.query.id){
        citycomments = citycomments.filter(comment=>comment.replyto==req.query.id);
    }
    if(citycomments){
        res.status(200).json(citycomments);
    }else{
        res.status(404).json({msg: "No comments found"});
    }
})

//GET specific comments on specific location
router.get("/:location/comment/:id", function(req, res){
    const comment = comments.find((comment)=>comment.location==req.params.location && comment.id==req.params.id);
    if(comment){
        res.status(200).json(comment);
    }else{
        res.status(404).json({msg: "No comment found"});
    }
})

//PUT change specific comment
router.put("/:location/comment/:id", express.json(), function(req, res){
    const comment = comments.findIndex((comment)=>comment.location==req.params.location&&comment.id==req.params.id);
    if(comment < 0){
        res.status(404).json({msg: "Comment not found"});
    }else{
        comments.splice(comment, 1, req.body);
        res.status(200).json({msg: "Updated comment"});
    }
})

//POST Add comment to specific city
router.post("/:location", express.json(), function(req, res){
    if(comments.length <= 0){
        req.body.id = 1111;
    }
    comments.push(req.body);
    res.status(201).json(req.body);
    console.log("La till kommentar!");
})

// POST Add answer on specific comment on a city
router.post("/:location/comment/:commentid", express.json(), function(req, res){
    const comment = comments.find(comment=>comment.location==req.params.location&&comment.id==req.params.commentid);
    console.log(req.params.commentid);
    console.log(req.params.location);
    if(comment){
        comments.push(req.body);
        res.status(201).json({msg: "Created answer comment"});
    }else{
        res.status(404).json({msg: "Could not answer that comment"});
    }
})

//DELETE remove comment from specific city
router.delete("/:commentid", express.json(), function(req, res){
    const comment = comments.findIndex((comment)=>comment.id==req.params.commentid);
    if(comment < 0){
        res.status(404).json({ms: "Could not delete"});
    }else{
        comments.splice(comment,1);
        res.status(200).json({msg: "Removed comment"});
    }
})
```
Här så fungerar det på samma sätt för kommentarer på sidan som används för en chatt om en specifik stad. Här går det hämta ut kommentarer för en ort eller specifika kommentarer för en ort. Som det går att svara på. Här används även frågor(query) i API:t för att kunna filtrera på olika kommentarer. Genom att använda express.js parameter req.query så går det även att skicka med specifika parametrar för att endast hämta ut särskilda kommentarer på en kommentar.

## Climatecodes

```javascript
router.get("/", function(req, res){
    res.status(200).json(climatecodes);
    console.log("Hämtade ut klimatkoder!");
});
```
På samma sätt här så hämtas alla klimatkoder och datan i arrayerna ut på sidan.

## Users

```javascript
router.get("/", function(req, res){
    const usernames = users.map(({username})=>({username}));
    res.status(200).json(usernames);
})

//GET specific user of name
router.get("/:name", function(req, res){
    console.log("Specifik user: " + req.params.name);
    const user = users.find(user=>user.username==req.params.name);
    if(user){
        res.type("application/json");
        res.status(200).send(user);
    }else{
       res.status(404).json({msg: "user not found"});
    }
})

//Update specific user with body parameter
router.put("/:id", express.json(), function(req, res){
    const user = users.findIndex((user)=>user.id==req.params.id);
    console.log(req.body);
    if(user < 0){
        res.status(404).json({msg: "User not found"});
    }else{
        users.splice(user, 1, req.body);
        res.status(200).json({msg: "Updated user"});
    }
})

//POST new user
router.post("/", express.json(), function(req, res){
    users.push(req.body);
    res.status(201).json(req.body);
})

//DELETE specific user of name
router.delete("/:name", function(req, res){
    const rem = users.findIndex((u)=>u.username == req.params.name);
    if(rem < 0){
        res.status(404).json({msg: "User not found"})
    }else{
        users.splice(rem, 1)
        res.status(200).json({msg: "User removed"})
    }
})
```
Här så går det hämta ut alla användare. Även uppdatera, skapa och ta bort specifika användare.

# React webbapplikation

Datan som hämtas från rest-apiet ritas även ut på hemsidan. Det går att lägga till och hämta ut användare. Skapa kommentarer om varje ort och även svara på dessa i chattrutan.
Endpoints används i React via fetch som hämtar och lägger till JSON-data till och från arrayerna specificerade i varje route.

![image](https://user-images.githubusercontent.com/81629599/143773353-899e6b86-4eef-4859-8c79-3722ef74d9c6.png)



