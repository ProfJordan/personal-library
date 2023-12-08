/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (_req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
      const books = await Book.find({});
      if (!books) {
        res.json([]);
        return;
      }
      const formattedBooks = books.map((book) => {
        return {
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentCount: book.comments.length,
        };
      });
      res.json(formattedBooks);
      return;
    } catch (err) {
      res.json([]);
    }
    })

    
    .post(async (req, res) => {
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if (!title) {
        res.send('missing title');
        return;
      }
      const newBook = new Book({title, comments: []});
      try {
       const book = await newBook.save();
        res.json({_id: book._id, title: book.title});
      } catch (err) {
        res.send('error saving new book');
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
