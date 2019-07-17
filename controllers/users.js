const User = require('../db/models/User')

module.exports = {
    findByName: (req, res) => {
       User.findOne({ username: req.params.username }).then(user => {
           if(user === null) {
                res.sendStatus(404);
           } else {
               if(req.body.password === user.password) {
                   res.json(user.username);
               }
           }
       })
    },
    create: (req, res) => {
        User.create(req.body).then(user => {
            res.json(user.username)
        })
    },
    edit: (req, res) => {
        User.findOneAndUpdate({ username: req.params.username }, req.body, {
            new: true
        }).then(user => res.json(user.username));
    },
    delete: (req, res) => {
        User.findOneAndDelete({ username: req.params.username }).then(user => res.json(user.username));
    }
}