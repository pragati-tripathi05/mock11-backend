const { User } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignup = async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.send("User already exists");
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send("Something went wrong, please signup later");
      } else {
        const user = new User({ email, password: hash });
        await user.save();
        res.send("User SignUp Successful");
      }
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user === null) {
    res.status(401).send("Invalid Credentials");
  } else {
    const hash = user.password;
    const name = user.name;
    const userId = user._id;
    bcrypt.compare(password, hash, function (err, result) {
      if (result) {
        const token = jwt.sign({ id: userId }, process.env.secret_key);
        res.send({ msg: "Login Successful", name, token: token });
      } else {
        res.status(401).send("Invalid Credentials");
      }
    });
  }
};

module.exports = { userSignup, userLogin };
