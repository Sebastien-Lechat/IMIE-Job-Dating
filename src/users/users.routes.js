const usersValidation = require('./users.validation');
const usersCtrl = require('./users.controller');

module.exports = [{
        method: 'POST',
        path: '/api/users',
        validation: usersValidation.createUser,
        handler: usersCtrl.createUser
    },
    {
        method: 'POST',
        path: '/api/meet/:id',
        validation: usersValidation.createMeet,
        handler: usersCtrl.createMeet
    },
    {
        method: 'GET',
        path: '/api/meets',
        validation: usersValidation.listUsers,
        handler: usersCtrl.listMeets
    },
    {
        method: 'GET',
        path: '/api/company',
        validation: usersValidation.getCompany,
        handler: usersCtrl.getCompany
    },
    {
        method: 'GET',
        path: '/api/user/:id',
        validation: usersValidation.getCompany,
        handler: usersCtrl.getUserById
    },
    {
        method: 'GET',
        path: '/api/users',
        validation: usersValidation.listUsers,
        handler: usersCtrl.listUsers
    },
    {
        method: 'GET',
        path: '/api/tokens',
        validation: usersValidation.listTokens,
        handler: usersCtrl.listTokens
    },
    {
        method: 'POST',
        path: '/api/login',
        validation: usersValidation.connectUser,
        handler: usersCtrl.connectUser
    },
    {
        method: 'PUT',
        path: '/api/users/:id',
        validation: usersValidation.insertJob,
        handler: usersCtrl.insertJob
    },
    {
        method: 'DELETE',
        path: '/api/users/:id',
        validation: usersValidation.deleteUser,
        handler: usersCtrl.deleteUser
    },
    {
        method: 'POST',
        path: '/api/init',
        handler: usersCtrl.initFakeUser
    },
    {
        method: 'DELETE',
        path: '/api/delete',
        handler: usersCtrl.dropRencontreCollection
    }
];