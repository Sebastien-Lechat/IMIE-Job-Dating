const rencontreValidation = require('./users.validation');
const usersCtrl = require('./users.controller');

module.exports = [
	{
		method: 'POST',
		path: '/api/users',
		validation: rencontreValidation.createUser,
		handler: usersCtrl.createUser
	},
	{
		method: 'GET',
		path: '/api/company',
		validation: rencontreValidation.getCompany,
		handler: usersCtrl.getCompany
	},
	{
		method: 'GET',
		path: '/api/user/:id',
		validation: rencontreValidation.getCompany,
		handler: usersCtrl.getUserById
	},
	{
		method: 'GET',
		path: '/api/users',
		validation: rencontreValidation.listUsers,
		handler: usersCtrl.listUsers
	},
	{
		method: 'GET',
		path: '/api/tokens',
		validation: rencontreValidation.listTokens,
		handler: usersCtrl.listTokens
	},
	{
		method: 'POST',
		path: '/api/login',
		validation: rencontreValidation.connectUser,
		handler: usersCtrl.connectUser
	},
	{
		method: 'PUT',
		path: '/api/users/:id',
		validation: rencontreValidation.insertJob,
		handler: usersCtrl.insertJob
	},
	{
		method: 'DELETE',
		path: '/api/users/:id',
		validation: rencontreValidation.deleteUser,
		handler: usersCtrl.deleteUser
	}
];
