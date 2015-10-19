//
	// * FEEL FREE TO USE ALL THE CODE ON HERE HOWEVER YOU WANT! 
	// * ALL THE CODE IS OPEN SOURCE, AND IS VIEWABLE ON GITHUB
	// * BY CLICKING THE 'FORK ME ON GITHUB' BUTTON ON THE TOP 
	// * RIGHT OF THIS PAGE! 
	// * 
	// * KANYE WEST 2020
	// *
	// * Coltrane Nadler © 2015
//


var express 		= require('express')
	, app 			= express()
	, bodyParser 	= require('body-parser')
	, nodemailer 	= require('nodemailer')
	, morgan 		= require('morgan')
	, mongo			= require('mongodb')
	, conf			= require('./config/conf');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'))

//mongo
mongo.connect(conf.db, function(err, db) {
	if(err) return console.log(err);
	console.log('Connected to Mongo')
	global.posts = db.collection('post');
})

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

app.get('/api/posts', function(req, res) {
	var options = {
		skip: 3 * (parseInt(req.query.num) - 1),
		limit: 3,
		sort: [['date', 'descending']]
	}

	posts.find({}, options).toArray(function(err, postlist) {
		if(err) return console.log(err);
		posts.find().count(function(err, num) {
			if(req.query.num) {
				if(3 * req.query.num >= num) {
					res.json({posts: postlist, next: false})
				} else {
					res.json({posts: postlist, next: true})
				}
			} else {
				if(num > 3) {
					res.json({posts: postlist, next: true})
				} else {
					res.json({posts: postlist, next: false})
				}
			}
		})
	})
})

app.get('/api/post', function(req, res) {
	posts.findOne({'date': parseInt(req.query.post)}, function(err, post) {
		if(err) return console.log(err);
		if(post) {
			res.json(post);
		} else {
			res.json(null)
		}
	})
})

app.get('/api/post/del', function(req, res) {
	if(req.query.id === conf.id) {
		posts.findOne({'date': parseInt(req.query.post)}, function(err, post) {
			if(err) return console.log(err);
			if(post) {
				posts.remove({'date': parseInt(req.query.post)}, function(err, info) {
					if(err) return console.log(err);
					if(info) {
						res.json({success: true})
					} else {
						res.json({success: false})
					}

				})
			} else {
				res.json({success: false})
			}
		})
	} else {
		res.json('SAY WHAT?')
	}
})

app.get('*', function(req, res) {
	res.redirect('/#/home')
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
		    subject: 'New contact inquiry from ' + body.name, // Subject line 
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

app.post('/api/newpost', function(req, res) {
	req.body.date = Date.now();
	posts.insert(req.body, function(err, info) {
		if(err) return console.log(err);
		res.json('successful')
	})
})

app.post('/api/post/update', function(req, res) {
	if(req.body.id === conf.id) {
		posts.findOne({'date': parseInt(req.body.date)}, function(err, post) {
			if(err) return console.log(err);
			if(post) {
				post.body = req.body.body;
				post.raw = req.body.raw;

				posts.save(post, {w: 1}, function(err, post) {
					if(err) return console.log(err);
					res.json({success: true})
				})
			} else {
				res.json({success: false})
			}
		})
	}
})

app.post('/api/auth', function(req, res) {
	if(req.body.username === conf.username && req.body.password === conf.password) {
		res.json({success: true, id: conf.id});
	} else {
		res.json({success: false});
	}
})

app.listen(conf.port, function() {
	console.log('Running')
})
