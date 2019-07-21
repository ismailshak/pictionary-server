const Room = require('../db/models/Room')

module.exports = {
    index: (req, res) => {
        Room.find().then(rooms => res.json(rooms))
    },
    findById: (req, res) => {
       Room.findById({ _id: req.params.id }).then(room => {
          res.json(room)
       })
       .catch(err => console.log(err))
    },
    create: (req, res) => {
        Room.create(req.body).then(room => {
            res.json(room)
        })
    },
    edit: (req, res) => {
        Room.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(room => {
            res.json(room)
        })
        .catch(err => res.json(err))
    },
    delete: (req, res) => {
        Room.findOneAndDelete({ _id: req.params.id }).then(room => res.json(room));
    }
}