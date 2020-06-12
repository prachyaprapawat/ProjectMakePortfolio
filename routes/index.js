var express = require('express');
var router = express.Router();
var path = require('path');
// -----------------------------------------
const multer = require('multer');
var Project = require('../model/project');

// -----------------------------------------
var User = require('../model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// -----------------------------------------

var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
const mongoDB = require('monk')('mongodb+srv://prachya:prachya123@cluster0-axeuw.mongodb.net/test?retryWrites=true&w=majority')


const projectDB = mongoDB.get("projects")
const userDB = mongoDB.get("users")
const Information = mongoDB.get("informations")
console.log("connect Mongodb again")
// ----------------------------------------------------------------------


var mkdirp = require('mkdirp');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// ----------------------------------------------------------------------


// --------------------------api upload---------in path------------------------------------------



// -----------------upload picture and make folder---------------------
var _img = [];
const storage = multer.diskStorage({
  destination: async (request, file, callback) => {
    console.log(request.body);
    if (_img.length == 0) {
      console.log(request.body);
      console.log("upload picture fail")
    }
    await mkdirp('public' + '/userImages/' + request.user._id).then(made => {
      if (made == undefined) {
        console.log(`It have already folder`)
      }
      else {
        console.log(`made directories, starting with ${made}`)
      }
    })
    console.log("upload picture")
    callback(null, path.join('public/userImages' + '/' + request.user._id));
  },
  filename: (request, file, callback) => {
    _img.push(file.originalname);
    console.log(file.originalname);
    callback(null, file.originalname)
  }
});
const upload = multer({ storage: storage })
// ------------------------------------------------------------------------




router.post('/upload/:projectName', upload.any(), async (req, res) => {
 var projectName = req.params.projectName
 var userId = req.user._id.toString()
 var userImages = _img
  console.log("---------"+userId+"------hello------------------------"+projectName)
console.log("---------------hello------------------------"+userImages)
  const Project = Information
  await Project.update({ userID: userId, projectName: projectName }, { $: { userImages: userImages } })
  console.log({ userID: userId, projectName: projectName })


_img = []
  res.send(userImages);
})






const {
  check,
  validationResult
} = require('express-validator');






// ----------------pasport-------------------------
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByName(username, function (err, user) {
    if (err) throw error;
    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) return err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
}));


// -----------------------------------------



// ------------register-----------------------------
router.post('/register', [
  check('email', 'กรุณาป้อนอีเมล').isEmail(),
  check('name', 'กรุณาป้อนชื่อของท่าน').not().isEmpty(),
  check('password', 'กรุณาป้อนรหัสผ่าน').not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  //Validation Data
  if (!result.isEmpty()) {
    //Return error to views
    res.render('register', {
      errors: errors
    })
  } else {
    //Insert  Data
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var newUser = new User({
      name: name,
      password: password,
      email: email
    });
    User.createUser(newUser, function (err, user) {
      if (err) throw err
    });
    res.location('/');
    res.redirect('/');
  }
});

// -----------------------------------------




// -----------------login------------------------
router.post('/login', passport.authenticate('local', {


  failureRedirect: '/login',
  failureFlash: true
}),
  function (req, res) {
    req.flash("success", "ลงชื่อเข้าใช้เรียบร้อยแล้ว");
    res.redirect('/');
  });
// -----------------------------------------




// -----------------login------------------------
router.get('/', enSureAuthenticated, async (req, res, next) => {
  _userId = req.user._id
  findData = { userID: _userId.toString() }
  portInformation = await Information.find(findData)
  res.render('index', { portInformation: portInformation });
});
function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}
// -----------------------------------------


// ---------------other--------------------------
router.get('/register', function (req, res, next) {
  res.render('register');
});
router.get('/login', function (req, res, next) {




  res.render('login');
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

// -----------------------------------



























module.exports = router;
