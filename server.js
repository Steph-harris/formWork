var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var session = require("express-session");
var PORT = process.env.PORT || 8080;
var mysql = require("mysql");
var Sequelize = require("sequelize");
var sequelize = new Sequelize('users', 'root');

var app = express();
app.use(express.static(process.cwd() + '/public'));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.get("/", function(req, res){
  res.render("forms");
});

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});