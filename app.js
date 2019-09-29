const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const expressSanitizer = require('express-sanitizer')
const PORT = process.env.PORT || 3000

// APP mongoose CONFIG
mongoose.connect("mongodb://localhost/blog-app", { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
// MOngoose / Model Schema CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:
        { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);


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

// New ROUTES
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

// create Blog
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    
    Blog.create(req.body.blog, (err, newBlog) => {
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

// Edit ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    const blogId = req.params.id
    Blog.findById(blogId, (err, editBlog) => {
        if (err) {
            aler(err)
            res.redirent("/blogs")
        } else {
            res.render("edit",{ blog: editBlog} )
        }
    })

})

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    const updatedBlogId = req.params.id
    const updatedInfo = req.body.blog
    req.body.blog.body = req.sanitize(req.body.blog.body)

    Blog.findOneAndUpdate(updatedBlogId, updatedInfo, (err, updatedBlog) => {
        if (err) {
            alert(err)  
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/'+ updatedBlogId)
        }
    })
});

// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    const deleteId = req.params.id
    Blog.findOneAndDelete(deleteId, (err) => {
        if (err) {
            alert('Something went wrong try again')
        }else {
            res.redirect('/blogs')
        }
    })
})


app.listen(PORT, () => {
    console.log("Server Started at Port", PORT)
})