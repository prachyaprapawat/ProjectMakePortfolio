var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://prachya:prachya123@cluster0-axeuw.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb Connect Error'));

var projectSchema = mongoose.Schema({

    link: {
        type: String
    },
    project: {
        type: String
    },
    picturename: {
        type: String
    },
    tag: [{
        type: String
    }],

    
});

var Project = module.exports = mongoose.model('project', projectSchema)

module.exports.getPost = function (callback) {
    // --------------------find-----------------------------------
console.log("hello")
    Project.find(callback)
    // -------------------------------------------------------s
}
module.exports.findPost = function (callback) {
    var nameds = { name: "project" }
    project.find(nameds, callback);
    console.log("end");
}


module.exports.countNumber01 = function (callback) {
    project.count(callback)
 
 }
 
module.exports.deletePicture = async function (myId,callback) {
    await project.find({_id : myId}).then((data) =>{
        console.log(data)
    data[0].invimage.forEach(element => {
        fs.unlink(path.join(__dirname+'/../uploads/'+element),()=>{})
         });
    })
    console.log("OK")
    console.log(callback)
}