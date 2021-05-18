var Genre = require('../models/genre');

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
exports.genre_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
};

// display Genre create from a GET
exports.genre_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre create GET');
};

// handle Genre create an POST
exports.genre_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre create POST');
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
