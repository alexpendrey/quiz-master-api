var restify = require('restify');
var config = require('./config');
var db = require('./model/db')(config).mongoapi; //mongoose.connection;
var q = require('q');
var api = require('./api');

var server = restify.createServer();

server.use(
    function crossOrigin(req,res,next){
        /* CORS allow all */
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);

server.pre(restify.pre.sanitizePath());
server.get('/questions', getQuestionsResponse);
server.get('/questions/:questiontype', getQuestionsResponse);

db.openPersistentConnection(function() {
    console.log('connected to db');
    server.listen(config.port, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}, function() {
   console.error('Error connecting to db');
});


function getQuestionsResponse(req, res, next) {
    console.log('getQuestionsResponse called ' + new Date(Date.now()).toTimeString());
    if (req.params.questiontype == "random") {
        api.getRandomQuestion().then(function(question) {
            res.send(question);
        })
    }
    else {
        api.getAllQuestions().then(function(quizzes) {
            res.send(quizzes);
        });
    }
    next();
}

