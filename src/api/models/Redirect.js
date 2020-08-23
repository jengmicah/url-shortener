const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RedirectSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Redirect = mongoose.model('Redirect', RedirectSchema);
