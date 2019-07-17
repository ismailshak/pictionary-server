const Word = require("./models/Word");

const wordData = require("./data.json");

Word.deleteMany({})
  .then(() => {
    Game.create(wordData).then(wordDocs => {
      console.log(wordDocs);
    });
  })
  .catch(err => {
    console.log(err);
  });
