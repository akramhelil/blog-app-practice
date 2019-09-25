const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000

// APP mongoose CONFIG
mongoose.connect("mongodb://localhost/blog-app", { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MOngoose / Model Schema CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:
        { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title: 'Test Blog',
//     image: 'https://images.unsplash.com/photo-1568893472376-821efb43f1ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//     body: 'CREATED the BLOG',

// })

// RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

// Index Route
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Theres, ERROOOOOR")
        } else {
            res.render('index', {blogs: blogs})
        }
    })

})

// CREATE ROUTES
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

app.post('/blogs', (req,res) => {
    // create Blog
    const data = req.body.blog
    Blog.create(data, (err, newBlog) => {
        if (err) {
            res.rebder('new')
        } else {
            res.redirect('/blogs')
        }
    })
    // redirect
})
// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    // res.render('show')
    const blogId = req.params.id
    Blog.findById(blogId, (err, foundBlog) => {
        if (err) {
          res.redirect('/blogs') 
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})



app.listen(PORT, () => {
    console.log("Server Started at Port", PORT)
})