const mongoUtils = require('mongodb-utils');
const {
    db
} = require('mono-mongodb');

exports.dropCollection = (collection) => mongoUtils(db.collection(collection)).deleteMany({});