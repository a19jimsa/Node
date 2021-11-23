const express = require("express");
const router =  express.Router();

const comments = [
    {id: 1, location: "Arjeplog", replyto :"2", author: 1, content:"Detta är en kommentar om Arjeplog", posted: "2020-01-02 00:00:00"},
    {id: 2, location: "Grums", replyto :"1", author: 2, content:"Detta är en annan kommentar om Grums", posted: "2020-01-02 00:00:01"}
]

router.get("/", function(req, res){
    res.status(200).json(comments);
})

router.get("/:location", function(req, res){
    const citycomments = comments.filter(comment=>comment.location==req.params.location);

    if(citycomments){
        res.status(200).json(citycomments);
    }
})

router.post

router.post("/", express.json(), function(req, res){
    comments.push(req.body);
    res.status(201).json(req.body);
    console.log("La till kommentar!");
})

module.exports = router;