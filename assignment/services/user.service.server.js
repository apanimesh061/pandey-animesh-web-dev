module.exports = function(app) {
    var dummyUsers = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    ];

    var users = dummyUsers;

    app.get("/api/user", getUsers);
    app.post("/api/user", createUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    String.prototype.hashCode = function() {
        var hash = 0;
        var char;
        if (this.length == 0)
            return hash;
        for (var i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    };

    function getUsers(request, response) {
        var username = request.query['username'];
        var password = request.query['password'];
        if(username && password) {
            findUserByCredentials(username, password, response);
        } else if (username) {
            findUserByUsername(username, response);
        } else {
            response.send(users);
        }
    }

    function createUser(request, response) {
        var newUser = request.body;
        for (var i in users) {
            if(users[i].username === newUser.username) {
                response.status(400)
                    .send("Username " + newUser.username + " is already in use");
                return;
            }
        }
        newUser._id = (newUser.username + newUser.password + (new Date()).getTime().toString()).hashCode().toString();
        users.push(newUser);
        response.json(newUser);
    }

    function deleteUser(request, response) {
        var id = request.params.userId;
        for(var i in users) {
            if(users[i]._id === id) {
                users.splice(i, 1);
                response.sendStatus(200);
                return true;
            }
        }
        response.status(404)
            .send("Unable to remove user with ID " + id);
    }

    function updateUser(request, response) {
        var id = request.params.userId;
        var newUser = request.body;
        for(var i in users) {
            if(users[i]._id == id) {
                users[i].firstName = newUser.firstName;
                users[i].lastName = newUser.lastName;
                users[i].email = newUser.email;
                response.sendStatus(200);
                return true;
            }
        }
        response.status(400)
            .send("User with ID " + id + " not found");
    }

    function findUserByCredentials(username, password, response) {
        for(var i in users) {
            if(users[i].username === username && users[i].password === password) {
                response.send(users[i]);
                return;
            }
        }
        response.sendStatus(403);
    }

    function findUserByUsername(username, response) {
        for(var i in users) {
            if(users[i].username === username) {
                response.send(users[i]);
                return;
            }
        }
        response.status(400)
            .send("User with username " + username + " not found");
    }

    function findUserById(request, response) {
        var userId = request.params.userId;
        for(var i in users) {
            if(users[i]._id === userId) {
                response.send(users[i]);
                return;
            }
        }
        response.status(400)
            .send("User with ID " + userId + " not found");
    }

};