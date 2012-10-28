var express = require('express'),
    prayers = require('./routes/prayers');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

//app.get('/', prayers.findRandom);
app.get('/prayers', prayers.findAll);
app.get('/prayers/:id', prayers.findByIndex);
//app.post('/prayers', prayers.addPrayer);
//app.put('/prayers/:id', prayers.updatePrayer);
//app.delete('/prayers/:id', prayers.deletePrayer);

app.listen(3000);
console.log('Listening on port 3000...');