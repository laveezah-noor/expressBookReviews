const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let user = users.filter((user)=>{
        return user.username === req.body.username})
    if (user.length != 0){
        return res.status(400).json("Failed to register");
    }
    
    users.push(req.body);
    return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).json({books:books});
// });

public_users.get('/', async function (req, res) {
    try {
      // Wait for the response to be sent
      await res.status(200).json({books:books});
    } catch (err) {
      // Handle any errors
      console.error(err);
      res.status(500).json({message: "Internal server error"});
    }
  });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     let data = Object.entries(books).filter(([key, value]) => {
//         return value.isbn === req.params.isbn;
//     })
//     return res.status(200).json({booksbyisbn:Object.fromEntries(data)});
// });

// Create a promise function that returns a book by ISBN
function getBookByISBN(isbn) {
    // Return a promise object
    return new Promise((resolve, reject) => {
      // Find the book that matches the ISBN
      let data = Object.entries(books).filter(([key, value]) => {
        return value.isbn === isbn;
      });
      // If the book is found, resolve the promise with the book object
      if (data.length > 0) {
        resolve(Object.fromEntries(data));
      } else {
        // If the book is not found, reject the promise with an error message
        reject("Book not found");
      }
    });
  }
  
  // Get book details based on ISBN
  public_users.get("/isbn/:isbn", (req, res) => {
    // Call the promise function with the ISBN from the request parameter
    getBookByISBN(req.params.isbn)
      // Handle the fulfillment of the promise
      .then((book) => {
        // Send a success response with the status code 200 and the book object as the JSON data
        res.status(200).json({ booksbyisbn: book });
      })
      // Handle the rejection of the promise
      .catch((error) => {
        // Send an error response with the status code 404 and the error message as the JSON data
        res.status(404).json({ message: error });
      });
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let data = Object.entries(books).filter(([key, value]) => {
        return value.author === req.params.author;
    })
    if(!data) return res.status(404).json({message:"No book found with this author."})
    return res.status(200).json({booksbyauthor:Object.fromEntries(data)});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let data = Object.entries(books).filter(([key, value]) => {
        return value.title === req.params.title;
    })
    if(!data) return res.status(404).json({message:"No book found with this title."})
    return res.status(200).json({booksbytitle:Object.values(Object.fromEntries(data))[0]});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let review = Object.entries(books).filter(([key, value]) => {
        return value.isbn === req.params.isbn;
    }) 
    if(!review[0]) return res.status(404).json({message:"No book review found with this isbn."})
    return res.status(200).json(Object.values(Object.fromEntries(review))[0].reviews);
});

module.exports.general = public_users;
