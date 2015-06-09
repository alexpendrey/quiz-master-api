var mongoose = require('mongoose');
var q = require('q');
var random = require("random-js")(); // uses the nativeMath engine

Quiz = mongoose.model('Quiz');

exports.getAllQuestions = function () {
    var deferred = q.defer();
    Quiz.find().exec(function(err, quizzes) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        }
        deferred.resolve(quizzes);
    });
    return deferred.promise;
};

exports.getRandomQuestion = function() {
    //TODO: Refactor using promises. exec() returns a promise
    var deferred = q.defer();

    Quiz.count({}, function(err, result) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        }
        var count = result;
        var rand = random.integer(1, count);
        Quiz.findOne().where('key').equals(rand).exec(function(err, quiz) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            }

            deferred.resolve(quiz);
        });
    });

    return deferred.promise;
};



