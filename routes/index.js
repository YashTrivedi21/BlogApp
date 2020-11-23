const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const sanitizer = require('express-sanitizer')
router.use(sanitizer())
mongoose.connect('mongodb://localhost:27017/BlogApp',{useNewUrlParser: true,useUnifiedTopology:true})

const blogSchema = new mongoose.Schema({
  name: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now()}
})

let Blog = mongoose.model('Blog',blogSchema)

/* GET home page. */
router.get('/', (req,res) => {
  res.redirect('/blogs')
})

router.get('/blogs', function(req, res) {
  Blog.find({}, (err,blogs) => {
    if(!err) {
      //console.log(blogs)
      res.render('index', { title: 'Blogger', blogs:blogs });
    }
  })
});

router.post('/blogs', (req,res) => {
  req.body.body = req.sanitize(req.body.body)
  let name = req.body.name
  let image = req.body.image
  let body = req.body.body
  Blog.create({name:name,image:image,body:body}, (err) => {
    if(!err){
      //console.log("new blog added!!!",blog)
      res.redirect('/blogs')
    } else console.log(err)
  })
})

router.get('/blogs/new', (req,res) => {
  res.render('new')
})

router.get('/blogs/:id', (req,res) => {
  Blog.findById(req.params.id, (err,blog) =>{
    if (!err) res.render('show',{blog:blog})
  })
})

router.get('/blogs/:id/edit', (req,res) => {
  Blog.findById(req.params.id, (err,blog) => {
    if (!err) res.render('edit',{blog:blog})
  })
})

router.post('/blogsupd/:id', (req,res) => {
  req.body.body = req.sanitize(req.body.body)
  console.log(req.params.id)
  console.log(req.params.name)
  console.log(req.body.name)
  Blog.findByIdAndUpdate(req.params.id,{name : req.body.name, image : req.body.image, body : req.body.body}, (err,blog) => {
    if(!err) {
      console.log(blog)
      res.redirect('http://localhost:4000')
    } else console.log(err)
  })
})

router.get('/blogs/:id/delete', (req,res) => {
  Blog.findByIdAndDelete(req.params.id,  (err,blog) => {
    if(!err) console.log("Deleted:",blog)
    else console.log(err)
    res.redirect('http://localhost:4000')
  })
})
module.exports = router;
