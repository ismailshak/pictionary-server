# TotallyNotPictionary API

This API was created to support the [Totally Not Pictionay](http://totallynotpictionary.surge.sh/) application.

A collection of 200 words were seeded in to the database. They are classified as Easy and Medium level words, in a pictionary context.

[Deployed API](https://totallynotpictionary.herokuapp.com/api/games)

## Routes

Rooms:

All URLs begin with /api/rooms

| URL     | PATH | METHOD | ACTION    | DESCRIPTION                 |
|---------|------|--------|-----------|-----------------------------|
| /       | /    | GET    | #index    | Get all rooms               |
| /       | /:id | GET    | #findById | Search for a room by ID     |
| /create | /    | POST   | #create   | Creates a new room          |
| /edit   | /:id | PUT    | #edit     | Edits a room, found by ID   |
| /delete | /:id | DELETE | #delete   | Deletes a room, found by ID |

Users:

All URLs begin with /api/users

| URL       | PATH       | METHOD | ACTION      | DESCRIPTION                                                    |
|-----------|------------|--------|-------------|----------------------------------------------------------------|
| /username | /:username | POST   | #findByName | Get a user by username. (POST because a req.body is passed in) |
| /create   | /          | POST   | #create     | Creates a new user                                             |
| /username | /:username | PUT    | #edit       | Edits a user, found by username                                |
| /username | /:username | DELETE | #delete     | Deletes a user, found by username                              |

Words:

All URLs begin with /api/words

| URL     | PATH | METHOD | ACTION     | DESCRIPTION                             |
|---------|------|--------|------------|-----------------------------------------|
| /random | /    | GET    | #pickAWord | Picks a random word from the collection |

## Frameworks Used

Express, Mongoose, MongoDB, socket.io
