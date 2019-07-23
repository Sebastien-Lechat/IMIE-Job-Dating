const cors = require('cors');
const jwt = require('express-jwt');
const secret = require('../conf/production').mono.jwt.secret;

module.exports = function({ app }) {
    // Add CORS to the whole app
    app.use(cors());
    app.use(
        '/api',
        jwt({ secret: secret }).unless({
            path: ['/api/users', '/api/tokens', '/api/company', '/api/login', '/api/users/:id', '/api/rencontre', '/api/init', '/api/delete'],
            requestProperty: 'auth'
        })
    )
};