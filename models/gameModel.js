const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  minimumAge: Number,
  pricing: {
    hourly: String,
    perGame: String,
  },
  image: {
    description: String,
    path: String,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
