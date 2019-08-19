/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');

module.exports = function (app) {
  
  mongoose.connect(process.env.DB, { useNewUrlParser: true });

  const SchemaP10 = new mongoose.Schema({
      text: String,
      created_on: String,
      bumped_on: String,
      reported: Boolean,
      delete_password: String,
      replies: [{
        _id: String,
        text: String,
        created_on: String,
        delete_password: String,
        reported: Boolean
      }],
      board: String
    });
  const ModelP10 = mongoose.model('ModelP10', SchemaP10);
  
  /*ModelP10.remove({}, (err) => {
    if (err) console.log('Error reading database!')
  });*/
  
  app.route('/api/threads/:board')

    .post(function(req, res) {
    
        var thread = new ModelP10({
          text: req.body.text,
          created_on: new Date().toString(),
          bumped_on: new Date().toString(),
          delete_password: req.body.delete_password,
          board: req.params.board,
          reported: false
        });
    
        thread.save((err, data) => {
          if (err) console.log('Error saving to database!')
          else {
            //res.redirect('/b/' + req.params.board);
            res.json(data);
          };
        }); // '.save'
    
    }) // '.post'
  
    .get(function(req, res) {
    
        ModelP10.find({board: req.params.board})
          .sort({bumped_on: "desc"})
          .limit(10)
          .select('-delete_password')
          .select('-reported')
          .select('-replies.delete_password')
          .select('-replies.reported')
          .exec((err, data) => {
            if (err) console.log('Error reading database!')
            else {
              res.json(data);
            }
          }); // '.exec'
    
    }) // '.get'
  
    .delete(function (req, res) {
    
        ModelP10.remove(
          {
            board: req.params.board,
            _id: req.body.thread_id,
            delete_password: req.body.delete_password
          },
          (err, data) => {
            if (err) console.log('Error deleting from database!')
            else {
              if (data.deletedCount == 0) res.send('incorrect password')
              else res.send('success');
            }
          }
        ); // '.remove'
    
    }) // '.delete'
  
    .put(function(req, res) {
    
        ModelP10.findOneAndUpdate(
          {
            board: req.params.board,
            _id: req.body.thread_id
          },
          {reported: true},
          {new: true},
          (err, data) => {
            if (err) console.log('Error updating database!')
            else res.send('success');
          }
        ); // 'findOneAndUpdate'
    
    }) // '.put'
  
  app.route('/api/replies/:board')
  
    .post(function(req, res) {
        
        ModelP10.findOne({
            board: req.params.board,
            _id: req.body.thread_id
          },
          (err, data) => {
            if (err) {
              console.log('Error reading database!')
            } else {
              data.bumped_on = new Date().toString();
              data.replies.push({
                _id: Math.round(Math.random()*100000).toString(),
                text: req.body.text,
                created_on: new Date().toString(),
                delete_password: req.body.delete_password,
                reported: false
              });
              
              data.save((err, data) => {
                if (err) console.log('Error saving to database!')
                else {
                  // res.redirect('/b/' + ':board' + '/' + req.body.thread.id)
                  res.json(data);
                }
              })
              
            }
          }) // '.findOne'
    
    }) // '.post'
  
    .get(function(req, res) {
    
        ModelP10.findOne({
            board: req.params.board,
            _id: req.query.thread_id
          })
          .select('-delete_password')
          .select('-reported')
          .select('-replies.delete_password')
          .select('-replies.reported')
          .exec((err, data) => {
            res.json(data);
          }); // '.findOne'
    
    }) // '.get'
  
    .delete(function(req, res) {
    
        ModelP10.findOne(
          {
            board: req.params.board,
            _id: req.body.thread_id
          },
          (err, data) => {
            if (err) console.log('Error reading database!')
            else {
              var counter = 0;
              data.replies.forEach((item) => {
                if (item._id == req.body.reply_id && item.delete_password == req.body.delete_password) {
                  item.text = '[deleted]';
                  counter++;
                };
              });
                
              data.save((err, data) => {
                if (err) console.log('Error saving to database!')
                else {
                  if (counter > 0) res.send('success')
                  else res.send('incorrect password');
                };
              }) // '.save'
              
            };
          }
        ); // '.findOne'
    
    }) // '.delete'
  
    .put(function(req, res) {
    
        ModelP10.findOne(
          {
            board: req.params.board,
            _id: req.body.thread_id
          },
          (err, data) => {
            if (err) console.log('Error reading database!')
            else {
              var counter = 0;
              data.replies.forEach((item) => {
                if (item._id == req.body.reply_id) {
                  item.reported = true;
                  counter++;
                };
              });
              
              data.save((err, data) => {
                if (err) console.log('Error saving to database!')
                else {
                  if (counter > 0) res.send('success');
                };
              }) // '.save'
              
            };
          }
        ); // '.find'
    
    })
  
  app.get('/api', function(req, res) {
    ModelP10.find({}, (err, data) => {
      if (err) console.log('Error reading database!')
      else res.json(data);
    })
  });

}; // 'module.exports'
