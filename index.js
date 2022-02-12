const {parse} = require('querystring');
const {ObjectId} = require('mongodb');
const {MineField} = require('./mines.js');

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/";
const mongoBase = "minesweeper";
const mongoCollection = "minefields";

const express = require('express');
const app = express();
const port = 80;
app.use(express.json());

// This attribute should determine if the fetched MineField was just created or if it is loaded from storage
var fresh = {isFresh: true};
var status = {status: "unmodified"};

app.get('/:minefieldId?', function (req, res) {
    let documentId = req.params['minefieldId'] ? ObjectId(req.params['minefieldId']) : null;

    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongoBase);

        // Creates the minefield instance
        var field = new MineField();

        if (documentId) {
            dbo.collection(mongoCollection).findOne({_id: documentId}).then((dbDocument) => {
                // If no document is found with the given id, it saves the minefield instance into the DB
                if (dbDocument === null) {
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

                var response = {...status, ...fresh, "data": field};
                res.send(response);
            });
        } else {
            // If no id is provided, it saves the minefield instance into the DB
            field = getNewDocument(db, dbo, field);

            fresh.isFresh = true;
            status.status = 'created';
            var response = {...status, ...fresh, "data": field};
            res.send(response);
        }
    });
});

app.post('/:minefieldId?', function (req, res) {
    let documentId = req.params['minefieldId'] ? ObjectId(req.params['minefieldId']) : null;

    // Removes the _id field from the data JSON to avoid immutable field error update on Mongo (in case that it would be present)
    delete req.body.data._id;

    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongoBase);
        var myquery = {_id: documentId};
        var newvalues = {$set: req.body.data};

        dbo.collection(mongoCollection).updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;

            if (res.modifiedCount) {
                status.status = 'updated';
            } else {
                status.status = 'unmodified';
            }
        });

        dbo.collection(mongoCollection).findOne({_id: documentId}).then((dbDocument) => {
            field = dbDocument;
            fresh.isFresh = false;
            var response = {...status, ...fresh, "data": field};
            res.send(response);
        })
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


function getNewDocument(db, dbo, field) {
    dbo.collection(mongoCollection).insertOne(field, function (err, res) {
        if (err) throw err;
        // Adds the _id attribute to the field instance
        field._id = res.insertedId.toString();
        db.close();
    });
    return field;
}