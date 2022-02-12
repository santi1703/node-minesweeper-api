var http = require('http');
var mongo = require('mongodb');
var url = require('url');
const { parse } = require('querystring');
const { ObjectId } = require('mongodb');
var { MineField } = require('./mines.js');

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/";
const mongoBase = "minesweeper";
const mongoCollection = "minefields";

// This attribute should determine if the fetched MineField was just created or if it is loaded from storage
var fresh = {isFresh: true};
var status = {status: "unmodified"};

http.createServer(function (req, res) {
  const { method } = req;
  res.writeHead(200, {'Content-Type': 'application/json'});
  
  // Gets the id of the minefield to load or save
  var urlId = url.parse(req.url).pathname.replace(/^\//, '');
  var documentId = urlId === null || urlId === '' ? null : ObjectId(urlId);

  let body = [];

  if(method === 'GET') {
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', () => {
      MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mongoBase);

      // Creates the minefield instance
      var field = new MineField();

      if(documentId) {
        dbo.collection(mongoCollection).findOne({_id: documentId}).then((dbDocument) => {
            // If no document is found with the given id, it saves the minefield instance into the DB
            if(dbDocument === null) {
              field = getNewDocument(db, dbo, field);
              fresh.isFresh = true;
              status.status = 'created';              
            } else {
              // I had to do this to have JS to take field as an instance of class MineField
              Object.setPrototypeOf(dbDocument, field);
              field = dbDocument;
              fresh.isFresh = false;
              status.status = 'unmodified';
            }

            var response = JSON.stringify({...status, ...fresh, "data": field});
            res.write(response);
            res.end();
          });
      } else {
          // If no id is provided, it saves the minefield instance into the DB
          field = getNewDocument(db, dbo, field);

          fresh.isFresh = true;
          status.status = 'created';
          var response = JSON.stringify({...status, ...fresh, "data": field});
          res.write(response);
          res.end();
        }
      });
    });
  } else if(method === 'POST') {
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      // Assigns all received data to variable body as json
      body = JSON.parse(Buffer.concat(body).toString());
      
      // Gets the id to be updated from the body, an removes it from the json
      delete body.data._id;
      
      MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mongoBase);
        var myquery = {_id: documentId};
        var newvalues = { $set: body.data };
        
        dbo.collection(mongoCollection).updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;

          if(res.modifiedCount) {
            status.status = 'updated';
          } else {
            status.status = 'unmodified';
          }
        });

        dbo.collection(mongoCollection).findOne({_id: documentId}).then((dbDocument) => {
          field = dbDocument;
          fresh.isFresh = false;
          var response = JSON.stringify({...status, ...fresh, "data": field});
          res.write(response);
          res.end();
        })

      });
    });    
  } else {
    res.write('Method not implemented');
    res.end();
  }
}).listen(8080);


function getNewDocument(db, dbo, field) {
  dbo.collection(mongoCollection).insertOne(field, function(err, res) {
    if (err) throw err;
    // Adds the _id attribute to the field instance
    field._id = res.insertedId.toString();
    db.close();
  });
  return field;
}