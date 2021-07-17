const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maxGroupSize']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  discount: Number,
  summary: {
    type: String,
    trim: true,
  },

});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
