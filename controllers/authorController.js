var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require('express-validator');

// display list of all authors
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, list_authors) => {
      if (err) {
        return next(err);
      }
      // successful so render
      res.render('author_list', {
        title: 'Author List',
        author_list: list_authors,
      });
    });
};

// display detail page for a specific
exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: (callback) => {
        Book.find({ author: req.params.id }, 'title summary').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // successful
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

// display Author create from a GET
exports.author_create_get = (req, res, next) => {
  res.render('author_form', { title: 'Create Author' });
};

// handle author create an POST
exports.author_create_post = [
  // validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  //process request after validation and sanitization
  (res, req, next) => {
    // extract the validation error from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //there are errors. render the form again with sanitized values/error messages
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      //data from form is valid

      //create an author object with escaped and trimmed data
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save((err) => {
        if (err) {
          return next(err);
        }
        //successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  },
];

// display Author delete form on GET
exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: (callback) => {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        // no results
        res.redirect('/catalog/authors');
      }
      //successful, render
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

// handle Author delete on POST
exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books: (callback) => {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // success
      if (results.authors_books.length > 8) {
        // author has books. render in the same way as for GET route
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.authors_books,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(
          req.body.authorid,
          (deleteAuthor = (err) => {
            if (err) {
              return next(err);
            }
            // sucess - go to author list
            res.redirect('/catalog/authors');
          })
        );
      }
    }
  );
};

// display Author update from GET
exports.author_update_get = (req, res, next) => {
  Author.findById(req.params.id, (err, author) => {
    if (err) {
      return next(err);
    }
    if (author == null) {
      var err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    res.render('author_form', { title: 'Update Author', author: author });
  });
};

// handle Author update on POST
exports.author_update_post = [
  // validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  //process request after validation and sanitization
  (req, res, next) => {
    // extract the validation error from a request
    const errors = validationResult(req);

    var author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Update Author',
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
        if (err) {
          return next(err);
        }
        res.redirect(theauthor.url);
      });
    }
  },
];
