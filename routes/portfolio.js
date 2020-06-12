var express = require('express');
var router = express.Router();
var path = require('path');

var Project = require('../model/project');
// ---------------------------------------------------
var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
const mongoDB = require('monk')('mongodb+srv://prachya:prachya123@cluster0-axeuw.mongodb.net/test?retryWrites=true&w=majority')


const projectDB = mongoDB.get("projects")
const userDB = mongoDB.get("users")
const Information = mongoDB.get("informations")
// -----------------------------------------

const multer = require('multer');
var mkdirp = require('mkdirp');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


// -----------------------
// function
function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}


// ---------------------------------



router.get('/testdata', async (req, res, next) => {

  const Project = Information
  Project.insert({
    name: "req.body.name,",
    description: "req.body.description,",
    auther: "req.body.auther,"

  })

  res.json(await Project.find({}))
});





router.get('/testmakenewdata', async (req, res, next) => {
  const Project = Information
  Project.insert({
    name: "name",
  })
  res.json(await Project.find({}))
});



router.get('/updatedata', async (req, res, next) => {
  const Project = Information
  var data = {
    name: "req.body.name,",
    description: "req.body.description,",
    auther: "req.body.auther,"
  }
  await Project.update({ _id: "5ed72216eae95149d04c6493" }, { $push: { newInformation: data } })
  res.json(await Project.find({}))
});












// ---------------------------test---------------------------------------



//  function add picture
var _img = [];
const storage = multer.diskStorage({
  destination: async (request, file, callback) => {
    console.log(request.body);

    console.log(request.body);
    console.log("upload picture fail")
    console.log("hello2")
    await mkdirp('public' + '/userImages/' + request.user._id).then(made => {
      if (made == undefined) {
        console.log(`It have already folder`)
      }
      else {
        console.log(`made directories, starting with ${made}`)
      }
    })
    console.log("hello3")
    console.log("upload picture")
    callback(null, path.join('public/userImages' + '/' + request.user._id));
  },
  filename: (request, file, callback) => {
    _img.push(file.originalname);
    console.log(file.originalname);
    callback(null, file.originalname)
    console.log("hello4")
  }
});
const upload = multer({ storage: storage })





//  render main page
router.get('/mainport', enSureAuthenticated, async (req, res, next) => {
  Project.getPost(
    function (err, project) {
      console.log(project)
      res.render('port', { project: project });
    })

});

// render addproject page 
router.get('/add', enSureAuthenticated, async (req, res, next) => {
  await res.render('addproject');
});



//  -----------------------------------
router.post('/addInputInformation/', enSureAuthenticated, async (req, res, next) => {
  const {
    userInformation,
    userId,
    projectName
  } = req.body;
  console.log(userId)
  console.log("inApi")
  const Project = Information
  await Project.update({ userID: userId, projectName: projectName }, { $set: { addInputInformation: userInformation } })

  res.send(userInformation)

})



router.get('/updatedata/:id', enSureAuthenticated, async (req, res, next) => {
  const Project = Information
  var data = {
    name: "req.body.name,",
    description: "req.body.description,",
    auther: "req.body.auther,"
  }
  await Project.update({ _id: "5ed72216eae95149d04c6493" }, { $push: { newInformation: data } })
  res.json(await Project.find({}))
});








// ------------------------------------------



router.get('/addInputInformation/:projectName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  res.render('inputinformationform', { projectName: projectName });
});





router.get('/showinformation/:id/:projectName', enSureAuthenticated, async (req, res, next) => {

  id = req.params.id
  projectName = req.params.projectName
  var myId = mongoose.Types.ObjectId(id);
  findData = { userID: id, projectName: projectName }
  portInformation = await Information.find(findData)
  console.log(portInformation)
  res.render('showInformation', { portInformation: portInformation });

});
router.get('/showinformationjson/:id/:projectName', enSureAuthenticated, async (req, res, next) => {

  id = req.params.id
  projectName = req.params.projectName
  var myId = mongoose.Types.ObjectId(id);
  findData = { userID: id, projectName: projectName }
  portInformation = await Information.find(findData)
  console.log(portInformation)
  res.send(portInformation);
});






router.post('/createDB', enSureAuthenticated, async (req, res, next) => {
  const Project = Information
  const {
    userID,
    projectName
  } = req.body;
  Project.insert({
    userID: userID,
    projectName: projectName
  })

  res.redirect('/portfolio/selectForm/' + projectName);
});


// router.get('/selectform/:projectName', async (req, res, next) => {
//   projectName = req.params.projectName

//   res.render("selectForm", { projectName: projectName });
// });


router.post('/addSection', enSureAuthenticated, async (req, res, next) => {
  const {
    sectionPort,
    userId,
    projectName
  } = req.body;
  console.log(userId)
  console.log("inApi")
  const Project = Information
  await Project.update({ userID: userId, projectName: projectName }, { $set: { sectionPort: sectionPort } })

  res.send(sectionPort)

})


router.get('/selectform/:projectName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  res.render("selectForm", { projectName: projectName });
});


router.get('/chooseSectionEdit/:projectName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  userId = req.user._id

  console.log(projectName)
  console.log(userId)
  findData = { userID: userId.toString(), projectName: projectName }
  console.log(findData)

  chooseSection = await Information.find(findData)
  console.log(await Information.find({ findData }))
  res.render("chooseSectionEdit", { chooseSection: chooseSection });
});


router.get('/addInputIntroduce/:projectName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  res.render('inputIntroduce', { projectName: projectName });
});

router.post('/upload/', enSureAuthenticated, upload.any(), async (req, res, next) => {
  console.log("upload")
  res.send("upload")
})


router.post('/addInputIntroduce', upload.any(), async (req, res, next) => {
    const {
  //     introduceInformation,
      userId,
      projectName,
      hello, introduceName, institution,
    } = req.body;
  var newData = {}
  // const image = _img
  newData.hello = hello
  newData.introduceName = introduceName
  newData.institution = institution
  newData.userImage = _img[0]

  console.log(_img)
  console.log("hello 1")
  console.log("inApi-------------------------------" + newData.userImage)
  console.log("inApi----------addInputIntroduce-----------------------")
  const Project = Information
  await Project.update({ userID: userId, projectName: projectName }, { $set: { addInputIntroduce: newData } })

  _img = []
  res.json(newData)

})


router.get('/pang', upload.any(), function (req, res, next) {
  var newData = {}
  console.log("hello1")
  newData.hello = "hello"
  newData.introduceName = "introduceName"
  console.log(_img)
  newData.userImages = _img

  Project.update({ userID: "5ed66b2b34021828dc48a284", projectName: "saddsaasd" }, { $set: { addInputIntroduce: newData } })

  _img = []
  res.json(newData)

})








router.get('/addInputGoal/:projectName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  res.render('inputGoal', { projectName: projectName });
});



router.post('/addgoal', upload.any(), enSureAuthenticated, async (req, res, next) => {
  const {
    goal,
    passion,
    userId,
    projectName
  } = req.body;
  var goalData = {}
  goalData.goal = goal
  goalData.passion = passion
  goalData.userImage = _img[0]
  console.log(userId)
  console.log("inApi")
  const Project = Information
  await Project.update({ userID: userId, projectName: projectName }, { $set: { addInputGoal: goalData } })

  res.send(goalData)

})



router.get('/deletePortfolio/:projectName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  userId = req.user._id.toString()
  const Project = Information

  await Project.remove({ userID: userId, projectName: projectName })
  console.log(userId)
  console.log(projectName)

  portInformation = await Project.find({ userID: userId })
  res.redirect('/');
});


router.get('/deleteSection/:projectName/:sectionName', enSureAuthenticated, async (req, res, next) => {
  projectName = req.params.projectName
  sectionName = req.params.sectionName
  userId = req.user._id.toString()
  const Project = Information

  await Project.findOneAndUpdate({ userID: userId, projectName: projectName }, { $pull: { sectionPort: sectionName } })
  console.log(userId)
  console.log(projectName)

  portInformation = await Project.find({ userID: userId })
  res.redirect('/');
});





router.get('/makePortfolio', enSureAuthenticated, async (req, res, next) => {
  res.render('makePortfolio');
});



module.exports = router;
