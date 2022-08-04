const express = require("express");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const config = require("config");
const mongoURI = config.get("mongoURI");
const connectDB = require("./config/db");


const appController = require("./appController");
const isAuth = require("./middleware/is-auth");



const app = express();


connectDB();

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "mySessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//=================== Routes
// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);

app.post("/logout", appController.logout_post);

app.get('/showtask', appController.showallTask);

app.post('/addtask', appController.addTask_post);

//  Delete task
app.post('/delete', appController.deleteTask);



app.listen(5000, console.log("App Running on http://localhost:5000"));
