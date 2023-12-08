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
      const formatBooks = books.map((book) => {
        return {
          _id: book._id,
          title: book.title,
          comment: book.comments,
          commentcount: book.comments.length,
        };
      });
      res.json(formatBooks);
      return;
    } catch (err) {
      res.json([]);
    }
    })

    
    .post(async (req, res) => {
      //response will contain new book object including at least _id and title
      let title = req.body.title;
      if (!title) {
        res.send('missing required field title');
        return;
      }
      const newBook = new Book({ title, comments: [] });
      try {
       const book = await newBook.save();
        res.json({_id: book._id, title: book.title,});
      } catch (err) {
        res.send('error saving new book');
      }
    })
    
    .delete(async (req, res) =>{
      //if successful response will be 'complete delete successful'
      try {
        const deleted = await Book.deleteMany({});
        console.log('deleted :>> ', deleted);
        res.send('complete delete successful');
      } catch (err) {
        res.send('error deleting books');
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send('no book exists');
          return;
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length,
        });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      //json res format same as .get
    try {
      let book = await Book.findById(bookid);
      book.comments.push(comment);
      book = await book.save();
      res.json({    
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length,
        comments: book.comments,
      });
    } catch (err) {
      res.send('no book exists');
    }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        console.log("deleted :>> ", deleted);
        if (!deleted) throw new Error("no books exists");
        res.send('delete successful');
      } catch (err) {
          res.send('no book exists');
        }
      });
      };
