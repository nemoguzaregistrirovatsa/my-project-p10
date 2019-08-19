/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var id1, id2, id2_1;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('create thread', function(done) {
        chai.request(server)
        .post('/api/threads/fcc')
        .send({text: 'text', delete_password:'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'reported');
          assert.property(res.body, 'delete_password');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'board');
          id1 = res.body._id;
          done();
        });
      });
      test('create thread', function(done) {
        chai.request(server)
        .post('/api/threads/fcc')
        .send({text: 'text', delete_password:'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'reported');
          assert.property(res.body, 'delete_password');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'board');
          id2 = res.body._id;
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('list recent threads', function(done) {
        chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isBelow(res.body.length, 11);
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          res.body.forEach((item) => {
            assert.isArray(item.replies);
            assert.isBelow(item.replies.length, 4);
            assert.notProperty(item.replies, 'delete_password');
            assert.notProperty(item.replies, 'reported');
          });
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('delete thread with wrong password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: id1, delete_password: 'passwordd'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      test('delete thread with password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: id1, delete_password: 'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('report thread', function(done) {
        chai.request(server)
        .put('/api/threads/fcc')
        .send({thread_id: id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('create reply on thread', function(done) {
        chai.request(server)
        .post('/api/replies/fcc')
        .send({thread_id: id2, text: 'text', delete_password:'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'reported');
          assert.property(res.body, 'delete_password');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'board');
          assert.property(res.body.replies[0], '_id');
          assert.property(res.body.replies[0], 'text');
          assert.property(res.body.replies[0], 'created_on');
          assert.property(res.body.replies[0], 'delete_password');
          assert.property(res.body.replies[0], 'reported');
          id2_1 = res.body.replies[0]._id;
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('show all replies on thread', function(done) {
        chai.request(server)
        .get('/api/replies/fcc?thread_id=' + id2)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          assert.isArray(res.body.replies);
          assert.isBelow(res.body.replies.length, 4);
          assert.notProperty(res.body.replies, 'delete_password');
          assert.notProperty(res.body.replies, 'reported');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      test('report reply on thread', function(done) {
        chai.request(server)
        .put('/api/replies/fcc')
        .send({thread_id: id2, reply_id: id2_1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('change reply to "[deleted]" with wrong password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: id2, reply_id: id2_1, delete_password: 'passwordd'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      test('change reply to "[deleted]" with wrong password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: id2, reply_id: id2_1, delete_password: 'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
  });

});
