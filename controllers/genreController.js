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
exports.genre_create_post = [
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
  },
];

// display Genre delete form on GET
exports.genre_delete_get = (req, res, next) => {
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
        // no results
        res.redirect('/catalog/genres');
      }
      //successful, render
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// handle Genre delete on POST
exports.genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        Genre.findById(req.body.genreid).exec(callback);
      },
      authors_books: (callback) => {
        Book.find({ genre: req.body.authorid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // success
      if (results.genres_books.length > 8) {
        // gender has books. render in the same way as for GET route
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_books: results.genres_books,
        });
        return;
      } else {
        // genre has no books. Delete object and redirect to the list of genres.
        Genre.findByIdAndRemove(
          req.body.genreid,
          (deleteAuthor = (err) => {
            if (err) {
              return next(err);
            }
            // sucess - go to genres list
            res.redirect('/catalog/genres');
          })
        );
      }
    }
  );
};

// display Genre update from GET
exports.genre_update_get = (req, res) => {
  Genre.findById(req.params.id, (err, genre) => {
    if (err) {
      return next(err);
    }
    if (genre == null) {
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_form', { title: 'Update Genre', genre: genre });
  });
};

// handle Genre update on POST
exports.genre_update_post = [
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
        if (err) {
          return next(err);
        }
        res.redirect(thegenre.url);
      });
    }
  },
];
