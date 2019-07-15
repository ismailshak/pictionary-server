const User = require('../models/User')

module.exports = {
    findByName: (req, res) => {
       User.findOne({name: req.params.username}).then(user => {
           if(user === null) {
                res.sendStatus(404);
           } else {
               if(req.body.password === user.password) {
                   res.sendStatus(200);
               }
           }
       })
        
    },
}