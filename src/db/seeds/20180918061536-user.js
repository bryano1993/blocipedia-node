"use strict";

const faker = require("faker");

let users = [];

for (let i = 1; i <= 60; i++) {
  users.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard",
    id: i
  });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
