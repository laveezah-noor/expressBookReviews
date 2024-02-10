const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if (users.filter((user)=>user.username === req.body.username)){
        return res.status(400);
    }
    users.push(req.body);
    return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(200).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let data = Object.entries(books).filter(([key, value]) => {
        return value.author === req.params.author;
    })
    return res.status(200).json({booksbyauthor:Object.fromEntries(data)});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let data = Object.entries(books).filter(([key, value]) => {
        return value.title === req.params.title;
    })
    return res.status(200).json({booksbytitle:Object.values(Object.fromEntries(data))[0]});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
