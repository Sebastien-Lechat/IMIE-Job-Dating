const User = require('../services/users.service');
const Session = require('../services/session.service');
const Rencontre = require('../services/recontre.service');
const mongoUtils = require('mongodb-utils');
const { db } = require('mono-mongodb');

const users = User.find({}, options).toArray();

const rencontres = Rencontre.find({}, options).toArray();

console.log(users);
console.log(rencontres);