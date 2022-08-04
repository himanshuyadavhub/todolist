const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Task = require("./models/task");


exports.landing_page = (req, res) => {
  res.render("landing");
};

exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.login_post = async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName });

  if (!user) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.username = user.userName;
  res.redirect("/dashboard");
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  const { userName, password } = req.body;

  let user = await User.findOne({ userName });

  if (user) {
    req.session.error = "User Name already exists";
    return res.redirect("/register");
  }

  const hasdPsw = await bcrypt.hash(password, 12);

  user = new User({
    userName,
    password: hasdPsw,
  });

  await user.save();
  res.redirect("/login");
};

exports.dashboard_get = async(req, res) => {
  const userName = req.session.username;
  res.render("dashboard", { name: userName });
};

exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/login");
  });
};

exports.showallTask = async(req, res) => {
  var data = await Task.find({},{"Tittle":1,"Description":1,"_id":0});
  res.send(data)

};

exports.addTask_post = (req, res) => {
    const tittle = req.body.tittle
    const desc = req.body.desc
    const userName = req.session.username;


    var todo = new Task({
      userName,
      Tittle:tittle,
      Description:desc
    })

    todo.save(function (err) {
        if (err) return handleError(err);
    });
    

    res.redirect("/dashboard")
};

exports.deleteTask = async(req,res) => {
  const userName = req.session.username;
  const tittle = req.body.tittle;

  const task = await Task.findOneAndDelete({Tittle:tittle,userName});

  res.redirect("/dashboard")

}