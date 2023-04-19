const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var newPath = path.join(exports.dataDir, `${id}.txt`);
    console.log('The path will be: ', newPath);
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  // Do the same work but over all of the files (rather than elements of array)

  fs.readdir(exports.dataDir, (err, filesArray) => {
    var todos = [];
    if (err) {
      callback (err);
    } else {
      if (filesArray.length === 0) {
        return [];
      } else {
        filesArray.forEach((filename) => {
          var todoObj = {
            id: filename.substring(0, filename.length - 4),
            text: filename.substring(0, filename.length - 4)
          };
          todos.push(todoObj);
        });
        // var data = _.map(filesArray, (id) => {
        // // console.log('The current {id, text} object is: ', { id, text });

        //   todos.push({id: id});
        //   return { id, id };
        // });
        callback(null, todos);
      }
    }
  });
  // console.log('These are the todos: ', JSON.stringify(todos));
  // return todos;
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};



// exports.create = (text, callback) => {
//   // check if id is incremented and saved into counter.txt
//   counter.getNextUniqueId((err, id) => {
//     // console.log('id is:', id);

//     // console.log ('dataDir before mutilation: ', dataDir);
//     var newPath = path.join(exports.dataDir, id).concat('.txt');
//     // console.log ('newPath after mutilation: ', newPath);
//     fs.writeFile(newPath, text, (err) => {
//       if (err) {
//         throw ('error writing counter');
//       } else {
//         callback(null, { id, text } );
//       }
//     });
//   });
// };