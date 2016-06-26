module.exports = function () {

    var mongoose = require("mongoose");

    var UserSchema = require("./user.schema.server")();
    var ProjUser = mongoose.model("ProjUser", UserSchema);

    function addWebsiteIdToUser(websiteId, userId) {
        return ProjUser.findOne({_id: userId},
            function (err, doc) {
                doc.websites.push(websiteId);
                doc.save();
            });
    }

    function removeWebsiteIdFromUser(websiteId, userId) {
        return ProjUser.findOne({_id: userId},
            function (err, doc) {
                doc.websites.pull(websiteId);
                doc.save();
            });
    }

    function createUser(user) {
        return ProjUser.create(user);
    }

    function findUserById(userId) {
        return ProjUser.findById(userId);
    }

    function findUserByCredentials(username, password) {
        return ProjUser.findOne({username: username, password: password});
    }

    function findUserByUsername(username) {
        return ProjUser.findOne({username: username});
    }

    function updateUser(userId, newUser) {
        return ProjUser.update(
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
        return ProjUser.remove({_id: userId});
    }

    function findUserByFacebookId(facebookId) {
        return ProjUser.findOne(
            {
                'facebook.id': facebookId
            }
        );
    }

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
    
};