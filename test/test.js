const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('blog-posts', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.forEach(function (item){
          item.should.be.a('object');
          item.should.have.all.keys('id', 'title', 'content', 'author', 'publishDate')
        });
      });
  });

   it('should post new blog posts on POST', function(){
    const newItem = {author: "Chris Cauley", title: "Programming in CSS", content: "It's that easy", publishDate: "11/30/2016"};
    return chai.request(app)
    .post('/blog-posts')
    .send(newItem)
    .then(function(res){
      res.should.have.status(201);
      res.should.be.json;
      res.should.be.a('object');
      res.body.should.have.all.keys('id', 'title', 'content', 'author', 'publishDate')
    });
  });

  it('should error if POST missing expected values', function(done) {
    const badRequestData = {};
    chai.request(app)
      .post('/blog-posts')
      .send(badRequestData)
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });

  it('should update blog posts on PUT', function(){
    const updateData = {author: 'Javon Harper', title: 'AKA we will'};
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res){
      updateData.id = res.body[0].id;
      return chai.request(app)
      .put(`/blog-posts/${updateData.id}`)
      .send(updateData)
    })
    .then(function(res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
    });
  });

  it('should delete blog posts on DELETE', function(){
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res){
      return chai.request(app)
      .delete(`/blog-posts/${res.body[0].id}`);
    })
    .then(function(res){
      res.should.have.status(204);
    });
  });

})