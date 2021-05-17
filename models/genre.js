var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

// Virtual for Genre's url
GenreSchema.virtual('url').get(() => {
  `/catalog/genre/${this._id}`;
});

// Exports model
module.exports = mongoose.model('Genre', GenreSchema);
