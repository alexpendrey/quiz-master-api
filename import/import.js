
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizmaster');
var db = mongoose.connection;
var csv = require('fast-csv');

var quizSchema = new mongoose.Schema( {
    question: String,
    category: String,
    options: String,
    answer: String,
    key: Number
});

var counter = 0;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected');

    var stream = fs.createReadStream("Questions.csv", { encoding: 'utf8'} );
    var csvStream = csv()
        .on("data", function(data){
            createQuestion(data);
        })
        .on("end", function(){
            console.log("done");
        });

    stream.pipe(csvStream);

    console.log('Finished');
    //process.exit(0);
});

function createQuestion(questionObj) {
    counter++;
    var Quiz = mongoose.model('Quiz', quizSchema);

    var q = questionObj[0].trim();
    if (q.substr(q.length-1, 1) != '?') {
        q += '?';
    }
    q = q.replace(/^[0-9]+\./, '').trim(); //Remove leading numbers with full stop
    var answer = questionObj[3];
    answer = answer.replace(/^[0-9]+\./, '').trim(); //and again

    var quiz = new Quiz({ question: q,
        category: questionObj[1], options: questionObj[2],
        answer: answer, key: counter});

    quiz.save(function (err, question) {
    if (err) return console.error(err);
        console.log('Question ' + question + ' saved');
    });

}

