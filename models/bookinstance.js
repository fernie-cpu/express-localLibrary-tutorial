var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's url
BookInstanceSchema.virtual('url').get(() => {
  `/catalog/bookinstance/${this._id}`;
});

// Exports model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
