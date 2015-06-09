var mongoose = require('mongoose');

var quizSchema = new mongoose.Schema( {
    question: String,
    category: String,
    options: String,
    answer: String
});

var Quiz = module.exports = mongoose.model('Quiz', quizSchema);

