var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
mongoose.connect("mongodb://localhost/photosDB", { useNewUrlParser: true});



// How to store photos into database
var photoSchema = mongoose.Schema({
    PhotoName: String,
    PhotoURL: String,
    Comments: []
});

var Photo = mongoose.model('Photo', photoSchema);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected');
});

/* How to save photos to DB */
var body = {
    PhotoName: 'photo', 
    PhotoURL:'https://www.sideshowtoy.com/wp-content/uploads/2018/04/marvel-avengers-infinity-war-thanos-sixth-scale-figure-hot-toys-feature-903429-1.jpg', 
    Comments:[{User:'Anon', Comment: 'Hello!'}]
};
/*
var newphoto = new Photo(body);
newphoto.save(function(err, post) {
    if (err) return console.error(err);
    console.log(post);
})*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public'});
});

/* GET all photos */
router.get('/photos', function(req, res, next) {
    console.log('GET all photos');
    var toFind = {};
    Photo.find(toFind, function(err, photoList) {
        if (err) {
            return console.error(err);
        }
        console.log(photoList);
        res.json(photoList);
    })
});


router.post('/photos', function(req, res, next) {
    console.log('POST new photo');
    var photo = req.body;
    var imageData = {
        PhotoName: photo.PhotoName,
        PhotoURL: photo.PhotoURL,
        Comments: [{User: photo.Comments[0].User, Comment: photo.Comments[0].Comment}]
    };
    console.log(imageData);
    var newPhoto = new Photo(imageData);
    newPhoto.save(function(err, post) {
        if (err) {
            return console.error(err);
        }
        console.log(post);
        res.sendStatus(200);
    })
});




module.exports = router;
