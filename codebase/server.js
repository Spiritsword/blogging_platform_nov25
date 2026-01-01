
//initialize Express application
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


//import required packages
const path = require("path");
const sequelize = require("./config/connection");
const routes = require("./routes/index");


const PORT = process.env.PORT || 3001;

//has the --rebuild parameter been passed as a command line param?
const rebuild = process.argv[2] === "--rebuild";

//serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

//handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

//add routes
app.use(routes);

//sync database
sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
