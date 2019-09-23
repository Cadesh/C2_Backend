const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()
const port = 3001
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//----------------------------------------------------------
// SOME GLOBAL PARAMETERS
//----------------------------------------------------------
c2DB = 'c2' // name of the database
eventTbl = 'eventTbl' // collection that holds static events
pathTbl = 'pathTbl' // collection that hold the coordinates of moving events

//ckOutputInterval = 10000 //check for outputs every X miliseconds
//----------------------------------------------------------

//------------------------------------------------
// CREATE MONGO DB MODEL
//------------------------------------------------
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//MongoClient.connect(url, function(err, db) {
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },  function(err, db) {
  if (err) throw err;
  var dbo = db.db(c2DB);
  dbo.createCollection(eventTbl, function(err, res) {
    if (err) throw err;
    console.log("eventTbl created!");
    db.close();
  });
  dbo.createCollection(pathTbl, function(err, res) {
    if (err) throw err;
    console.log("pathTbl created!");
    db.close();
  });
});
//-----------------------------------------------

app.get('/', (req, res) => res.send('Sorry, nothing here!'))
app.get('/test', (req, res) => res.send('The server is alive.'))

//---------------------------------------------------------------
// Get all events from the table
//---------------------------------------------------------------
app.get('/getallevents', (req, res) => { 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(c2DB);
        dbo.collection(eventTbl).find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send (result)       
        db.close();
        });
      });   
})
//---------------------------------------------------------------

//----------------------------------------------------------
// RECEIVES REQUESTS TO CATEGORIZE VIDEO AND SAVE THEM IN DATABASE
// //----------------------------------------------------------
// app.post('/newevent', (req,res) => {

//     var videos = req.body

    
//     if (validateBody(videos) == false) {
//         res.send ('request body not valid (invalid format).')
//         return
//     }

//     for(var i = 0; i < videos.length; i++) {
//         videos[i].categorized = false
//     }
//         MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
//             if (err) throw err;
//             var dbo = db.db(c2DB);
//             dbo.collection(requestTbl).insertMany(videos, function(err, res) {
//             if (err) throw err;
//             console.log("video inserted");
//             db.close();
//             });
//         });
    
//     //res.send(JSON.stringify (req.body))
//     res.send ('new event added.')
// } )
//----------------------------------------------------------

//----------------------------------------------------------
// CREATES SAMPLE EVENTS
//----------------------------------------------------------
app.get('/createsampleevents', (req,res) => {

    sampleEvents = [
        {
        "type" : "car accident",
        "description" : "car crash",
        "color" : "blue",
        "createdDate" : "2019-09-10T14:40:06.658Z",
        "coordX" : "43.713512",
        "coordY" : "-79.399809"
        },
        {
        "type" : "robbery",
        "description" : "robbery",
        "color" : "red",
        "createdDate" : "2019-09-10T15:40:06.658Z",
        "coordX" : "43.714110",
        "coordY" : "-79.408361"
        }
    ]
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(c2DB);
            dbo.collection(eventTbl).insertMany(sampleEvents, function(err, res) {
            if (err) throw err;
            console.log("events inserted");
            db.close();
            });
        });
    
    //res.send(JSON.stringify (req.body))
    res.send ('new event added.')
} )
//----------------------------------------------------------

//---------------------------------------------
// CHECKS IF /video ROUTE IS RECEIVING THE VALID JSON BODY
//---------------------------------------------
//  function validateBody(videos) {
//      for(var i = 0; i < videos.length; i++) {
//         if (videos[i].hasOwnProperty('id') && videos[i].hasOwnProperty('url') && 
//         videos[i].hasOwnProperty('minScore') && videos[i].hasOwnProperty('numFrames')) {
//             console.log ('new valid video')
//         } 
//         else {
//             return false;
//          }
//     }
//      return true;
//  }
//---------------------------------------------

//---------------------------------------------
// SETS TIMER TO SEND OUTPUT EVERY X SECONDS
//---------------------------------------------
// function runTimerToSendOutput(arg) {
//     setTimeout(runTimerToSendOutput, 10000);
// } 
// setTimeout(runTimerToSendOutput, 10000);
//---------------------------------------------

app.listen(port, () => console.log(`App listening on port ${port}!`))
