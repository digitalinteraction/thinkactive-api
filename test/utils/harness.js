// const { expect } = require('chai');
// const request = require('supertest');
// const app = require('../../app/app');
// const models = require('../../app/models');
// const seeds = require('../seeds');

// const defaultUserPassword = 'password';

// function init() {
//   try {
//     const authenticatedAgent = request.agent(app);
//     const unAuthenticatedAgent = request.agent(app);

//     // init db
//     // await models.sequelize.sync({ force: true });

//     // // create constant for password
//     // const userPassword = await models.user.hashPassword('password');
//     // seeds.user[0].password = userPassword;
//     // seeds.user[1].password = userPassword;

//     // // insert seed user data into db (to get a cookie)
//     // await models.user.bulkCreate(seeds.user);

//     // // make authenticated request
//     // const test = await authenticatedAgent
//     //   .post('/auth/login')
//     //   .set('Content-Type', 'application/json')
//     //   .set('Accept', 'application/json')
//     //   .send({
//     //     email: seeds.user[0].email,
//     //     password: defaultUserPassword
//     //   });

//     // console.log(test);

//     // // destroy db
//     // Object.keys(seeds).forEach(async (model) => {
//     //   await models[model].destroy({ truncate: true, cascade: true });
//     // });
//     //   console.log(authenticatedAgent);

//     //   try {
//     //     Object.keys(seeds).forEach(async (model) => {
//     //       await models[model].destroy({ truncate: true, cascade: true });
//     //     });
//     //   }
//     //   catch (error) {
//     //     console.log(error);
//     //   }

//     // await describe('Routes /auth', function () {
//     //   describe('/login', function () {

//     //     beforeEach(async function () {
//     //       try {
//     //         await models.sequelize.sync({ force: true });
//     //         const userPassword = await models.user.hashPassword('password');
//     //         seeds.user[0].password = userPassword;
//     //         seeds.user[1].password = userPassword;

//     //         await models.user.bulkCreate(seeds.user);
//     //       }
//     //       catch (error) {
//     //         console.error(error);
//     //       }
//     //     });

//     //     afterEach(async function () {
//     //       try {
//     //         Object.keys(seeds).forEach(async (model) => {
//     //           await models[model].destroy({ truncate: true, cascade: true });
//     //         });
//     //       }
//     //       catch (error) {
//     //         console.log(error);
//     //       }
//     //     });

//     //     it('should successfully login with valid user', function (done) {
//     //       authenticatedAgent
//     //         .post('/auth/login')
//     //         .set('Content-Type', 'application/json')
//     //         .set('Accept', 'application/json')
//     //         .send({
//     //           email: seeds.user[0].email,
//     //           password: defaultUserPassword
//     //         })
//     //         .expect(200)
//     //         .end((error, res) => {
//     //           expect(res.status).to.equal(200);
//     //           expect(res.body.meta.success).to.equal(true);
//     //           expect(res.body.meta.messages).to.be.empty;
//     //           expect(res.body.data).to.be.an('object');
//     //           expect(res.body.data.user).to.be.an('object');
//     //           expect(res.body.data.user.username).to.equal(seeds.user[0].username);
//     //           expect(res.body.data.user.email).to.equal(seeds.user[0].email);
//     //           expect(res.body.data.user.password).to.equal(undefined);
//     //           done();
//     //         });
//     //     });
//     //   });
//     // });

//     return { authenticatedAgent, unAuthenticatedAgent };
//   }
//   catch (error) {
//     console.error(error);
//     return {};
//   }
// }

// module.exports = {
//   init,
//   seeds,
//   app,
//   models
// };
