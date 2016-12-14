var bearerToken = require('../')
var request = require('supertest')
var koa = require('koa')
var bodyParser = require('koa-bodyparser')
var app

var token = '1234567890abcdefghijk'


describe('koa-bearer-token', function() {
  beforeEach(function() {
    app = new koa()

    app.use(bodyParser())
    app.use(bearerToken())

    app.use(function (ctx) {
      if (ctx.request.token) {
        ctx.body = ctx.request.token
      } else {
        ctx.body = 'undefined'
      }
    })
  })

  it('token should be undefined when no token provided', function(done) {

    request(app.listen())
    .get('/')
    .expect(function(res) {
      if (res.text !== 'undefined') return 'res text !== undefined'
    })
    .end(done)

  })

  it('token can be provided in header', function(done) {

    request(app.listen())
    .get('/')
    .set('Authorization', 'Bearer ' + token)
    .expect(function(res) {
      if (res.text !== token) return 'res text !== token'
    })
    .end(done)

  })

  it('token can be provided in query', function(done) {

    request(app.listen())
    .get('/')
    .query( { access_token: token })
    .expect(function(res) {
      if (res.text !== token) return 'res body !== token'
    })
    .end(done)

  })

  it('token can be provided in body', function(done) {

    request(app.listen())
    .post('/')
    .send({ access_token: token })
    .expect(function(res) {
      if (res.text !== token) return 'res text !== token'
    })
    .end(done)

  })

})
