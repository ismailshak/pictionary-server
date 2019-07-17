const Word = require("./models/Word");

const wordData = require("./data.json");

Word.deleteMany({})
  .then(() => {
    Word.create(wordData).then(wordDocs => {
      console.log(wordDocs);
    });
  })
//   .then(_ => process.exit())
  .catch(err => {
    console.log(err);
  });
