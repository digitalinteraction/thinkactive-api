'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('food', [{
      id: 1,
      name: '01-apple',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: '02-orange',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: '03-banana',
      group: 1,
      energy: 2,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: '04-grapes',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: '05-pear',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: '06-strawberry',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: '07-tomato',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: '08-peppers',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      name: '01-lettuce',
      group: 1,
      energy: 0,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      name: '10-onion',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      name: '11-cauliflower',
      group: 1,
      energy: 0,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      name: '12-carrot',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 13,
      name: '13-broccoli',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      name: '14-lemon',
      group: 1,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      name: '15-steak',
      group: 2,
      energy: 1,
      fat: 1,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 16,
      name: '16-sausage',
      group: 2,
      energy: 1,
      fat: 2,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      name: '17-fish',
      group: 2,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      name: '18-bacon',
      group: 2,
      energy: 1,
      fat: 2,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 19,
      name: '19-egg',
      group: 3,
      energy: 2,
      fat: 2,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20,
      name: '20-bakedbeans',
      group: 0,
      energy: 2,
      fat: 1,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      name: 'pulses',
      group: 0,
      energy: 2,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 22,
      name: '22-whitebread',
      group: 0,
      energy: 1,
      fat: 0,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 23,
      name: '23-brownbread',
      group: 0,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 24,
      name: '24-ricebowl',
      group: 0,
      energy: 2,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 25,
      name: '25-potato',
      group: 0,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 26,
      name: '26-pasta',
      group: 0,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 27,
      name: '27-weetabix',
      group: 0,
      energy: 1,
      fat: 0,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 28,
      name: '28-frostedcereal',
      group: 0,
      energy: 2,
      fat: 0,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 29,
      name: '29-chocolatecereal',
      group: 0,
      energy: 2,
      fat: 1,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 30,
      name: '30-fizzypop',
      group: 4,
      energy: 2,
      fat: 1,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 31,
      name: '31-marsbar',
      group: 4,
      energy: 2,
      fat: 2,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 32,
      name: '32-glucosedrink',
      group: 4,
      energy: 2,
      fat: 0,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 33,
      name: '33-energydrink',
      group: 4,
      energy: 2,
      fat: 0,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 34,
      name: '34-crisps',
      group: 0,
      energy: 1,
      fat: 2,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 35,
      name: '35-burger',
      group: 2,
      energy: 2,
      fat: 2,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 36,
      name: '36-chocolate',
      group: 3,
      energy: 2,
      fat: 1,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 37,
      name: '37-doughnut',
      group: 4,
      energy: 2,
      fat: 2,
      sugar: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 38,
      name: '38-milk',
      group: 3,
      energy: 1,
      fat: 1,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 39,
      name: '39-cheese',
      group: 3,
      energy: 1,
      fat: 1,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 40,
      name: '40-yoghurt',
      group: 3,
      energy: 1,
      fat: 1,
      sugar: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 41,
      name: '41-butter',
      group: 4,
      energy: 2,
      fat: 2,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 42,
      name: '42-oliveoil',
      group: 4,
      energy: 1,
      fat: 1,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 43,
      name: '43-margarine',
      group: 4,
      energy: 2,
      fat: 2,
      sugar: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('food', null, {});
  }
};
