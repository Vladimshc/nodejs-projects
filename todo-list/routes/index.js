var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

// var url = 'mongodb://127.0.0.1:27017/test'; //for local test
var url = 'mongodb://user:123456@ds135689.mlab.com:35689/todolist'; //for production


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'toDoList' });
  res.redirect('/get-data');
});

router.get('/get-data', function (req, res, next) {
  var resultArray = [];
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var cursor = db.collection('userdata').find();
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function () {
            db.close();
            res.render('index', {items: resultArray});
        });
    });
});

router.post('/insert', function (req, res, next) {
  var item = {
    task: req.body.task,
    completed: req.body.completed || false,
    position: req.body.position || 0
  };
  mongo.connect(url, function (err, db) {
      assert.equal(null, err);
      db.collection('userdata').insertOne(item, function (err, result) {
          assert.equal(null, err);
          console.log('Item inserted');
          db.close();
      });
  });
  res.redirect('/get-data');
});

router.post('/update', function (req, res, next) {
    console.log(req.body);
    var item = {
        task: req.body.task,
        completed: req.body.completed || false
    };
    var id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('userdata').updateOne({"_id": objectId(id)}, {$set: item}, function (err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            db.close();
        });
    });
    res.redirect('/get-data');
});

router.post('/moveup', function (req, res, next) {
    var bodyData = req.body;
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
            for (var i = 0; i < bodyData.length; i++) {
                var toBaseId = objectId((bodyData[i].id));
                var item = {
                    task: bodyData[i].task,
                    completed: bodyData[i].completed || false,
                    position: bodyData[i].position || 0
                };
                db.collection('userdata').updateOne({"_id": toBaseId}, {$set: item}, function (err, result) {
                    assert.equal(null, err);
                });
            }
        db.close();
        });
    res.redirect('/get-data');
});

router.post('/delete', function (req, res, next) {
    var id = req.body.id;
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('userdata').deleteOne({"_id": objectId(id)}, function(err, result) {
            assert.equal(null, err);
            console.log('Item deleted');
            db.close();
        });
    });
});

router.post('/deldone', function (req, res, next) {
    var bodyData = req.body;
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        for (var i = 0; i < bodyData.length; i++) {
            var toBaseId = objectId((bodyData[i].id));
            db.collection('userdata').deleteOne({"_id": toBaseId}, function(err, result) {
                assert.equal(null, err);
                console.log('Item done deleted');
                db.close();
            });
        }
        db.close();
    });
    res.redirect('/get-data');
});

module.exports = router;
