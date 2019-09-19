const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000

// APP mongoose CONFIG
mongoose.connect("mongodb://localhost/blog-app", { useNewUrlParser: true });
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

// Creating the Model 
const Blog = mongoose.model('Blog', blogSchema);


app.listen(PORT, () => {
    console.log("Server Started at Port", PORT)
})