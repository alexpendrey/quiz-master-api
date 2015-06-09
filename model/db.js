module.exports = function(config) {
    var mongoose = require('mongoose');
    var db = mongoose.connection;
    var mongoapi = mongoapi || { };

    //Create a closure for db management
    mongoapi.manage = function() {
        //private methods
        var disconnect = function() {
            db.close(function() {
                console.log('Database connection closed');
            });
        };
        var connect = function(callback, err) {
            mongoose.connect(config.db,
                { server: { keepAlive: 1, auto_reconnect: true } });

            db.on('error', function() {
                err();
            });

            db.once('open', function() {
                callback();
            });

            // When the connection is disconnected
            db.on('disconnected', function () {
                console.log('Mongoose default connection disconnected');
            });

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', function() {
                db.close(function () {
                    console.log('Mongoose default connection disconnected through app termination');
                    process.exit(0);
                });
            });
        };
        //public methods
        return {
            disconnect: function() {
                return disconnect();
            },
            openPersistentConnection: function(callback, err) {
                return connect(callback, err);
            }
        }
    }();

    require('./quiz-schema');

    return {
        mongoapi: mongoapi.manage
    };
};

