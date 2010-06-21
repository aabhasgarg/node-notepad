var sys= require('sys')

var Db= require('mongodb/db').Db,
    ObjectID= require('mongodb/bson/bson').ObjectID,
    Server= require('mongodb/connection').Server;

NoteProvider = function(host, port) {
  this.db= new Db('node-mongo-editor', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

NoteProvider.prototype.getCollection= function(callback) {
  this.db.collection('notes', function(error, note_collection) {
    if( error ) callback(error);
    else callback(null, note_collection);
  });
};

NoteProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, note_collection) {
      if( error ) callback(error)
      else {
        note_collection.find(function(error, cursor) {
          if( error ) callback(error)
          else {
            cursor.toArray(function(error, results) {
              if( error ) callback(error)
              else callback(null, results)
            });
          }
        });
      }
    });
};

NoteProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, note_collection) {
      if( error ) callback(error)
      else {
        note_collection.findOne({_id: ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

NoteProvider.prototype.get_id = function(id) {
  ObjectID.createFromHexString(id)
}

NoteProvider.prototype.save = function(notes, callback) {
    this.getCollection(function(error, note_collection) {
      if( error ) callback(error)
      else {
        if( typeof(notes.length)=="undefined")
          notes = [notes];

        for( var i =0;i< notes.length;i++ ) {
          note = notes[i];
          note.created_at = new Date();
          if( note.comments === undefined ) note.comments = [];
          for(var j =0;j< note.comments.length; j++) {
            note.comments[j].created_at = new Date();
          }
        }
        note_collection.insert(notes, function() {
          callback(null, notes[notes.length-1]);
        });
      }
    });
};

exports.NoteProvider = NoteProvider;
