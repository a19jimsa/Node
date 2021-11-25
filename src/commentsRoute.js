const express = require("express");
const router =  express.Router();

const comments = [
    {id: 1111, location: "Arjeplog", replyto :"null", author: 1, content:"Detta är en kommentar om Arjeplog", posted: "2020-01-02 00:00:00"},
    {id: 1112, location: "Arjeplog", replyto :"1111", author: 2, content:"Detta är ett svar på 1111", posted: "2020-01-02 00:00:01"}
]

router.get("/", function(req, res){
    res.status(200).json(comments);
})

router.get("/:location", function(req, res){
    const citycomments = comments.filter(comment=>comment.location==req.params.location&&comment.replyto=="null").reverse();
    if(citycomments){
        res.status(200).json(citycomments);
    }else{
        res.status(404).json({msg: "No comments found"});
    }
})

router.get("/:location/comment/:id", function(req, res){
    console.log(req.params.location);
    console.log(req.params.id);
    const comment = comments.filter((comment)=>comment.location==req.params.location && comment.replyto==req.params.id);
    if(comment){
        res.status(200).json(comment);
    }else{
        res.status(404).json({msg: "Not found"});
    }
})

router.put("/:location/comment/:id", express.json(), function(req, res){
    const comment = comments.findIndex((comment)=>comment.location==req.params.location&&comment.id==req.params.id);
    console.log(req.body);
    if(comment < 0){
        res.status(404).json({msg: "Comment not found"});
    }else{
        comments.splice(comment, 1, req.body);
        res.status(200).json({msg: "Updated user"});
    }
})

//POST Add comment to specific city
router.post("/:location", express.json(), function(req, res){
    const comment = comments.findIndex((comment)=>comment.location==req.params.location);
    if(comment < 0){
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

module.exports = router;