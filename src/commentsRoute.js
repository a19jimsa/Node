const express = require("express");
const router =  express.Router();

const comments = [
    {id: 1, username: "Jimmy", content:"Student"},
    {id: 2, username: "Per", content:"Worker"}
]

router.get("/", function(req, res){
    res.status(200).json(comments);
})

router.post("/", express.json(), function(req, res){
    comments.push(req.body);
    res.status(201).json(req.body);
    console.log("La till kommentar!");
})

module.exports = router;