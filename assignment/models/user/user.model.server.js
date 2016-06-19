module.exports = function () {

    var mongoose = require("mongoose");

    var UserSchema = require("./user.schema.server")();
    var User = mongoose.model("User", UserSchema);

    return {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser,
        addWebsiteIdToUser: addWebsiteIdToUser,
        removeWebsiteIdFromUser: removeWebsiteIdFromUser,
        findUserByFacebookId: findUserByFacebookId
    };

    function addWebsiteIdToUser(websiteId, userId) {
        return User.findOne({_id: userId},
            function (err, doc) {
                doc.websites.push(websiteId);
                doc.save();
            });
    }

    function removeWebsiteIdFromUser(websiteId, userId) {
        return User.findOne({_id: userId},
            function (err, doc) {
                doc.websites.pull(websiteId);
                doc.save();
            });
    }

    function createUser(user) {
        return User.create(user);
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByCredentials(username, password) {
        console.log(username);
        return User.findOne({username: username, password: password});
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function updateUser(userId, newUser) {
        return User.update(
            {_id: userId},
            {
                $set: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email
                }
            }
        )
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function findUserByFacebookId(facebookId) {
        return User.findOne(
            {
                'facebook.id': facebookId
            }
        );
    }
    
};