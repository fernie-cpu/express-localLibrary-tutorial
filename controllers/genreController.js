var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require('express-validator');

// display list of all Genre
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, list_genres) => {
      if (err) {
        return next(err);
      }
      // sucessful render
      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genres,
      });
    });
};

// display detail page for a specific
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre: (callback) => {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: (callback) => {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      // successful render
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// display Genre create from a GET
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' });
};

// handle Genre create an POST
exports.genre_create_post = (req, res, next) => {
  // Validate and sanitize the name field
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    // process request after validation and sanitization
    (req, res, next) => {
      // extract the validation error from a request
      const errors = validationResult(req);

      // create a genre object with escaped and trimmed data
      var genre = new Genre({
        name: req.body.name,
      });

      if (!errors.isEmpty()) {
        //there are errors. render the form again with sanitized values/error messages
        res.render('genre_form', {
          title: 'Create Genre',
          genre: genre,
          errors: errors.array(),
        });
        return;
      } else {
        // data from form is valid
        // check if genre with same name already exists
        Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
          if (err) {
            return next(err);
          }

          if (found_genre) {
            // genre exists, redirect to its detail page
            res.redirect(found_genre.url);
          } else {
            genre.save((err) => {
              if (err) {
                return next(err);
              }
              // genre saved. redirect to genre detail page
              res.redirect(genre.url);
            });
          }
        });
      }
    };
};

// display Genre delete form on GET
exports.genre_delete_get = (req, res) => {
  ress.send('NOT IMPLEMENTED: Genre delete GET');
};

// handle Genre delete on POST
exports.genre_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// display Genre update from GET
exports.genre_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// handle Genre update on POST
exports.genre_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
