const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {id: 1, username:"admin", password:"password"},
];

const isValid = (username)=>{ //returns boolean
    return users.filter((user)=>user.username===username) ? true : false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let user = users.filter(usr => usr.username === username && usr.password === password)
  return user.length != 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let userInfo = req.body;
  if(authenticatedUser(userInfo.username, userInfo.password)) {
    // Generate an access token for the user
    const token = jwt.sign({ username: userInfo.username}, "access", {expiresIn: "1h"});

    // Store the token and the user information in the session
    req.session.authorization = {
      accessToken: token,
      user: {
        username: userInfo.username
      }
    };
    return res.status(200).json("Customer successfully logged in");
  }
  return res.status(400).json("Customer failed to logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let bookReview = req.query.review;
  let book = Object.entries(books).filter(([key, value]) => {
    return value.isbn === req.params.isbn;
  })
  if(!book.length){return res.status(404).send('No such book found')};
  book[0][1].reviews[req.session.authorization.user.username]=(bookReview);
  books[parseInt(Object.keys(book)[0][0])]=book[0][1];
  return res.status(200).json(`The review for the book with ISBN ${req.params.isbn} has been added/updated`);
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = Object.entries(books).filter(([key, value]) => {
    return value.isbn === req.params.isbn;
  })
  if(!book.length){return res.status(404).send('No such book found')};
  book[0][1].reviews[req.session.authorization.user.username]={};
  books[parseInt(Object.keys(book)[0][0])]=book[0][1];
  console.log(books);
  return res.status(200).json(`The review for the book with ISBN ${req.params.isbn} has been deleted by the user ${req.session.authorization.user.username}`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
