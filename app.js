const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const Game = require('./models/gameModel');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Arcade', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.redirect('/games');
  });

// Home Page
app.get('/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.render('index', { title: 'Arcade Games', games });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// New (Show new game form)
app.get('/games/new', (req, res) => {
    res.render('newGame', { title: 'New Game' });
  });
  
  // Create (Create new game)
app.post('/games', async (req, res) => {
    try {
      // Extract form data from req.body
      const { name, description, type, minimumAge, hourlyPricing, perGamePricing, imagePath, imageAlt } = req.body;
  
      // Create a new Game document
      const newGame = new Game({
        name,
        description,
        type,
        minimumAge,
        pricing: {
          hourly: hourlyPricing,
          perGame: perGamePricing,
        },
        image: {
          description: imageAlt,
          path: imagePath,
        },
      });
  
      // Save the new game to the database
      await Game.collection.insertOne(newGame);
  
      // Redirect to the index page after creating the new game
      res.redirect('/games');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Handle filter form submission
app.get('/games/search', async (req, res) => {

    console.log('GET request to /games/search');
    try {
      const { title, type } = req.query;
      console.log('Query Params:',title,':',type);
  
      // Build the MongoDB query based on the form data
      const query = {};
      if (title && title !== '') {
        query.name = { $regex: new RegExp(title, 'i') } 
        //   { description: { $regex: new RegExp(searchText, 'i') } },
        
      }
      if (type && type !== 'No Filter') {
        query.type = type;
      }
  
      // Fetch games based on the query from the database
      const filteredGames = await Game.find(query);
  
      // Render a partial view with the updated game data
      res.render('partials/gameGrid', { games: filteredGames }, (err, html) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.send(html);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  

  // Show Game Details
app.get('/games/:id', async (req, res) => {
    try {
      const gameId = req.params.id;
      const game = await Game.findById(gameId);
      res.render('gameDetails', { title: 'Game Details', game });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

// Edit Game Page
app.get('/games/:id/edit', async (req, res) => {
    try {
      const gameId = req.params.id;
      const game = await Game.findById(gameId);
      res.render('editGame', { title: 'Edit Game', game });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Update Game
  app.put('/games/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        const updatedGame = {
          name: req.body.title,
          description: req.body.description,
          type: req.body.type,
          minimumAge: parseInt(req.body.minAge), // Ensure it's parsed as a number
          pricing: {
            hourly: req.body.pricingHourly,
            perGame: req.body.pricingPerGame,
          },
          image: {
            path: req.body.imagePath,
            description: req.body.imageAlt,
          },
        };
        console.log(updatedGame)
    
        const result = await Game.findOneAndUpdate(
          { _id: gameId },
          { $set: updatedGame },
          { new: true }
        );
    
        if (!result) {
          return res.status(404).send('Game not found');
        }
    
      // Redirect to the home screen after the update
      res.redirect(`/games/${gameId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Add this route at the end of your app.js file
app.delete('/games/:id', async (req, res) => {
    try {
      const gameId = req.params.id;
      console.log("DELETE INVOKED")
  
      // Find and remove the game from MongoDB
      const result = await Game.findOneAndDelete({ _id: gameId });
  
      if (!result) {
        // Game with the given ID not found
        return res.status(404).send('Game not found');
      }
  
      // Redirect to the home screen after the deletion
    //   res.redirect('/games');
    res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
