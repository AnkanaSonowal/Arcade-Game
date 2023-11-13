# Arcade-Game
CRUD operations (Create, Read, Update, Delete) for manipulating games collection in Arcade Database within MongoDB, utilizing ejs files

Problem statement:

--> List all games with thumbnail images (game details in ArcadeGames.json and images are uploaded in public/images with the zip file along with the description).
--> Get the image URLs from MongoDB after uploading the json file. o Read the image from the fetched path and display in a grid along with game title as a hyper link to open the game details page.
--> show an individual game details page and display the image description (you read from Mongodb) as a tooltip when you hover over the image.
--> In case the application is not able to fetch the image in the previous screen, alt text should be loaded with the image description.
--> Add a new game (For the purpose of this assignment, you are not expected to upload an image from file explorer – image path and alt text are input text fields).
--> delete a game – Delete the game from mongodb and display the latest list of games on home screen.
--> Include search (partial search on “title”) and filtering (filter by “type”) functions. Integrate search and filter together (if a type is selected, search for games under selected type). Search and filtering should be available on home page. You can hardcode the list of types for drop down list that match entries in your mongodb.
