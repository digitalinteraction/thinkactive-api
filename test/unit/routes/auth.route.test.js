const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../app/app.js');
const models = require('../../../app/models');
const seeds = require('../../seeds');

const defaultUserPassword = 'password';
const authenticatedAgent = request.agent(app);

describe('Routes /auth', function (){
  describe('/login', function (){

    beforeEach(async function (){
      try {
        await models.sequelize.sync({ force: true });
        const userPassword = await models.user.hashPassword('password');
        seeds.user[0].password = userPassword;
        seeds.user[1].password = userPassword;

        await models.user.bulkCreate(seeds.user);
      }
      catch (error) {
        console.error(error);
      }
    });

    afterEach(async function (){
      try {
        Object.keys(seeds).forEach(async (model) => {
          await models[model].destroy({ truncate: true, cascade: true });
        });
      }
      catch (error) {
        console.log(error);
      }
    });

    it('should exist', function(done) {
      request(app)
        .post('/auth/login')
        .expect(400)
        .end((error, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.meta.success).to.equal(false);
          expect(res.body.meta.messages).to.include('Missing credentials');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });

    it('should successfully login with valid user', function(done) {
      authenticatedAgent
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          email: seeds.user[0].email,
          password: defaultUserPassword
        })
        .expect(200)
        .end((error, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.meta.success).to.equal(true);
          expect(res.body.meta.messages).to.be.empty;
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.user).to.be.an('object');
          expect(res.body.data.user.username).to.equal(seeds.user[0].username);
          expect(res.body.data.user.email).to.equal(seeds.user[0].email);
          expect(res.body.data.user.password).to.equal(undefined);
          done();
        });
    });

    it('should reject incorrect login details', function(done) {
      request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          email: seeds.user[0].email,
          password: `${seeds.user[0].password} ${Math.random()}`
        })
        .expect(401)
        .end((error, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.meta.success).to.equal(false);
          expect(res.body.meta.messages).to.include('Authentication failed');
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });

    it('should reject empty post body', function(done) {
      request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({})
        .expect(400)
        .end((error, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.meta.success).to.equal(false);
          expect(res.body.meta.messages).to.include('Missing credentials');
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });
  });

  // describe('/forgot', function (){
  //   it.skip('should exist', function(done) {
  //     request(app).post('/auth/forgot').expect(400, done);
  //   });
  //   it('should reject incorrect login', function(done) {
  //     request(app)
  //       .post('/auth/login')
  //       .set('Content-Type', 'application/json')
  //       .set('Accept', 'application/json')
  //       .send({
  //         username: 'unit-testing-login',
  //         password: 'unit-testing-login',
  //         email: 'unit-testing-login'
  //       })
  //       .expect(401)
  //       .done();
  //   });
  // });
});
