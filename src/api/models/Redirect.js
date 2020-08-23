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

RedirectSchema.index({ slug: 1 }, { unique: true })

module.exports = Redirect = mongoose.model('Redirect', RedirectSchema);
