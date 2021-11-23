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
    }else{
        res.status(404).json({msg: "No comments found"});
    }
})

router.post("/location", express.json(), function(req, res){
    comments.push(req.body);
    res.status(201).json(req.body);
    console.log("La till kommentar!");
})

router.get("/:location/comment/:id", function(req, res){
    console.log(req.params.location);
    console.log(req.params.id);
    const comment = comments.find((comment)=>comment.location==req.params.location && comment.id==req.params.id);

    if(comment){
        res.status(200).json(comment);
    }else{
        res.status(404).json({msg: "Comment not found"});
    }
})

router.put("/:location/comment/:replyto", express.json(), function(req, res){
    const comment = comments.findIndex((comment)=>comment.location==req.params.location&&comment.replyto==req.params.replyto);
    console.log(req.body);
    if(user < 0){
        res.status(404).json({msg: "User not found"});
    }else{
        users.splice(user, 1, req.body);
        res.status(200).json({msg: "Updated user"});
    }
})

module.exports = router;