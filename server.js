var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var session = require("express-session");
var PORT = process.env.PORT || 8080;
var bcrypt = require("bcryptjs");
var Sequelize = require("sequelize");
var sequelize = new Sequelize('users', 'root');

var User = sequelize.define('user', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var app = express();

app.use(express.static(process.cwd() + '/public'));
app.use(session({
  secret: "my super secret",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 *30
  },
  saveUninitialized: true,
  resave: false
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.get("/", function(req, res){
  res.render("forms", {
    msg: req.query.msg
  });
});

app.get("/success", function(req, res){
  res.render("success", {
    msg: req.query.msg
  });
});
//once user registers, create new user row in db
app.post("/register", function(req, res){
  var password = req.body.password;
  var email = req.body.email;

  if(password !== "" && email !== ""){
    //use bcryptjs to hash password
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, function(err, hash){
        User.create(req.body).then(function(user){
          req.session.authenticated = user;
          res.redirect('/success');
        }).catch(function(err){
          res.redirect("/?msg=" + err.message);
        });
      })
    })
  } else {
    res.redirect("/?msg=Please fill in all fields");
  }
});

app.post("/login", function(req, res){
  console.log(req.body);
});

sequelize.sync().then(function(){
  app.listen(PORT, function(){
    console.log("Listening on port %s", PORT);
  });
});

