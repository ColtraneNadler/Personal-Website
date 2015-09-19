var express 		= require('express')
	, app 			= express()
	, bodyParser 	= require('body-parser')
	, nodemailer 	= require('nodemailer')
	, morgan 		= require('morgan')
	, conf			= require('./config/conf');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'))

//mail setup
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: conf.email,
        pass: conf.pass
    }
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

var timed = {}
//mail
app.post('/', function(req, res) {
	var body = req.body;
	if(!timed[req._remoteAddress]) {
		timed[req._remoteAddress] = Date.now() + 60;
		setTimeout(function() {
			delete timed[req._remoteAddress];
		}, 480000)
		var mailOptions = {
		    from: body.name + ' <' + body.email + '>', // sender address 
		    to: conf.email, // list of receivers 
		    subject: 'New contact inquiery from ' + body.name, // Subject line 
		    html: '<b>Name: </b>' + body.name + '<br><b>Email: </b> ' + body.email + '<br><b>Subject: </b>' + body.subject + '<br><p>' + body.message + '</p>' // html body 
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		    	res.json('error')
		        return console.log(error);
		    }
			res.json('good')
		});
	} else {
		res.json('notgood')
		//do some shit with the email- return the success: true on the callback of the email
	}
})

app.listen(conf.db, function() {
	console.log('Running')
})
