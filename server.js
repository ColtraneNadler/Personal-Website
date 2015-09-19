var express 		= require('express')
	, app 			= express()
	, bodyParser 	= require('body-parser')
	, nodemailer 	= require('nodemailer')
	, morgan 		= require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

var timed = {}
//mail
app.post('/', function(req, res) {
	var body = req.body;
	if(!timed[req._remoteAddress]) {
		res.json('good')
		timed[req._remoteAddress] = Date.now() + 60;
		setTimeout(function() {
			delete timed[req._remoteAddress];
		}, 480000)
	} else {
		res.json('notgood')
		//do some shit with the email- return the success: true on the callback of the email
	}
})

app.listen(3000, function() {
	console.log('Running')
})