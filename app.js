//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const articlesSchema=new mongoose.Schema({
  title:String,
  content:String
})
const Article=mongoose.model("Article",articlesSchema);
app.route("/articles")
.get(function(req,res){
  Article.find({},function(err,foundRticles){
    if(!err){
        res.send(foundRticles);
    }
    else {
        res.send(err);
    }

  })
})
.post(function(req,res){
const newArticle=new Article({
  title:req.body.title,
  content:req.body.content

})
newArticle.save(function(err){
  if(!err){
    res.send("Successfully added the new Article")
  }else {
    res.send(err);
  }
});
})
.delete(function(req,res){
Article.deleteMany(function(err){
  if(!err){
    res.send("Successfully deleted the articles");}
    else{
      res.send(err);
    }

})

});
//TODO
app.route("/articles/:articleTitle")

.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, article){
    if (article){
      const jsonArticle = JSON.stringify(article);
      res.send(jsonArticle);
    } else {
      res.send("No article with that title found.");
    }
  });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.updateOne(
    {title: articleTitle},
    {content: req.body.newContent},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})
.patch(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    });
})
.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOneAndDelete({title: articleTitle}, function(err){
    if (!err){
      res.send("Successfully deleted selected article.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
