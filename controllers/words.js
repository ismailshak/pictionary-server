const Word = require('../db/models/Word')

module.exports = {
    pickAWord: (req, res) => {
        // Get the count of all words
        Word.countDocuments().exec(function (err, count) {
            // Get a random entry
            var random = Math.floor(Math.random() * count)
          
            // Query all words but only fetch one offset by our random #
            Word.findOne().skip(random).exec(
              function (err, result) {
                // Tada! random word
                res.json(result) 
              })
          })
    },
}