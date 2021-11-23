const express = require("express");
const router =  express.Router();

const users = [
    {id: 1, username: "Jimmy", email :"Student"},
    {id: 2, username: "Per", email :"Worker"}
]

router.get("/", function(req, res){
    res.status(200).json(users);
})

router.get("/:name", function(req, res){
    console.log("Specifik user: " + req.params.name);
    const user = users.find(user=>user.name==req.params.name);
    if(user){
        res.type("application/json");
        res.status(200).send(user);
    }else{
       res.status(404).json({msg: "user not found"});
    }
})

router.put("/:name", function(req, res){
    const rem = users
})

router.post("/", express.json(), function(req, res){
    users.push(req.body);
    res.status(201).json(req.body);
})

router.delete("/:userid", function(req, res){
    const rem = users.findIndex((u)=>u.name == req.params.userid);
    if(rem < 0){
        res.status(404).json({msg: "User not found"})
    }else{
        users.splice(rem, 1)
        res.status(200).json({msg: "user removed"})
    }
})


module.exports = router;