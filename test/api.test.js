// https://github.com/avajs/ava#assertions
const test = require('ava');

const { join } = require('path');
const { start, stop, $get, $post } = require('mono-test-utils');

let monoContext;
const context = {};

/*
** Start API
*/
test.before('Start API', async () => {
	// Start the API with NODE_ENV=test
	// See https://github.com/terrajs/mono-test-utils#start-a-mono-project-from-dir-directory-with-node_envtest
	monoContext = await start(join(__dirname, '..'))
});

/*
** modules/users/
*/
// POST /users
test('POST /api/users => 400 with no body', async (t) => {
	const { statusCode, body } = await $post('/api/users', {
		body: {}
	});
	t.is(statusCode, 400);
	t.is(body.code, 'validation-error')
});

test('POST /api/users => 200 with good params', async (t) => {
	const user = {
		email: 'test@unit.fr',
		password: 'testunit',
		nom: 'Denis',
		prenom: 'Alfred',
		sexe: 'Homme',
		role: 'STUDENT',
		age: '19',
		adresse_student: '2 place du Marché',
		cp_student: '51051',
		ville_student: 'Pastis',
		link_cv: 'url',
		telephone_student: '0102030405',
		niveau: 'Master',
		nom_formation: 'Développeur Web et Mobile'
	};
	const { statusCode, body } = await $post('/api/users', { body: user });

	t.is(statusCode, 200);
	t.is(body.user.email, user.email);
	t.is(body.user.password, user.password);
	t.is(body.user.nom, user.nom);
	t.is(body.user.prenom, user.prenom);
	t.is(body.user.sexe, user.sexe);
	t.is(body.user.role, user.role);
	t.is(body.user.age, user.age);
	t.is(body.user.adresse_student, user.adresse_student);
	t.is(body.user.cp_student, user.cp_student);
	t.is(body.user.ville_student, user.ville_student);
	t.is(body.user.link_cv, user.link_cv);
	t.is(body.user.telephone_student, user.telephone_student);
	t.is(body.user.niveau, user.niveau);
	t.is(body.user.nom_formation, user.nom_formation);
	// Add to context
	context.user = body
});
// GET /users
test('GET /api/users => 200 with users list', async (t) => {
	const { statusCode, body } = await $get('/api/users');
	const user = await $get('/api/users');

	t.is(statusCode, 200);
	t.is(user.body.length, 1);
	t.deepEqual(body[0], context.todo)
});

test('GET /api/users?limit=1&offset=1 => 200 with empty array', async (t) => {
	const { statusCode, body } = await $get('/api/users?limit=1&offset=1');

	t.is(statusCode, 200);
	t.is(body.length, 0)
});
/*
** Stop API
*/
test.after('Stop server', async () => {
	await stop(monoContext.server)
});
