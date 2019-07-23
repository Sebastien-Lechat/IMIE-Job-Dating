const { HttpError } = require('mono-core');
const { getFindOptions } = require('mono-mongodb');

const bcrypt = require('bcryptjs');
const User = require('../services/users.service');
const Session = require('../services/session.service');

const jwt = require('jsonwebtoken');
const production = require('../../conf/production').mono.jwt.secret;

exports.createUser = (req, res) => {

	User.get({
		email: req.body.email
	}).then(async function (user) {
		if (user) {
			res.status(400).json('Email déjà existant');
		}
		else if (req.body === null) {
			res.status(400).send('Merci de rentrer des informations');
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);

			if (req.body.role === "STUDENT") {
				User.create({
					email: req.body.email,
					password: hashedPassword,
					nom: req.body.nom,
					prenom: req.body.prenom,
					sexe: req.body.sexe,
					role: req.body.role,
					Etudiant: {
						email: req.body.email,
						age: req.body.age,
						adresse_student: req.body.adresse_student,
						cp_student: req.body.cp_student,
						ville_student: req.body.ville_student,
						link_cv: req.body.link_cv,
						telephone_student: req.body.telephone_student,
						Formation: {
							niveau: req.body.niveau,
							nom_formation: req.body.nom_formation
						}
					}
				});
			} else if (req.body.role === "COMPANY") {
				User.create({
					email: req.body.email,
					password: hashedPassword,
					nom: req.body.nom,
					prenom: req.body.prenom,
					sexe: req.body.sexe,
					role: req.body.role,
					Entreprise: {
						email: req.body.email,
						nom: req.body.nom,
						prenom: req.body.prenom,
						logo: req.body.logo,
						nom_entreprise: req.body.nom_entreprise,
						siege: req.body.siege,
						description: req.body.description,
						adresse_company: req.body.adresse_company,
						cp_company: req.body.cp_company,
						ville_company: req.body.ville_company,
						telephone_company: req.body.telephone_company,
						cocktail: req.body.cocktail,
						video: req.body.video,
						Job: [{}]
					}
				});
			} else {
				res.status(400).send('Merci d\'indiquer un role');
			}

			try {
				res.send({ user: req.body });
				res.status(200);
			} catch (e) {
				res.status(400).send(e);
			}
		}
	})
};

exports.connectUser = (req, res) => {
	User.get({
		email: req.body.email
	}).then(async function (user) {
		if (!user) {
			return res.status(400).send('No User Found !');
		} else {
			const validPassword = await bcrypt.compare(req.body.password, user.password);

			if (!validPassword) {
				return res.status(400).send('Invalid Password');
			} else {
				const token = jwt.sign({ _id: user._id }, production);
				res.header('Authorization', 'Bearer '+token);

				Session.create({
					userId: user._id,
					token: token,
				});

				try {
					res.send({ token });
				} catch (e) {
					res.status(400).send(e);
				}
			}

		}
	})
};

exports.getCompany = async (req, res) => {
	const options = getFindOptions(req.query);
	const users = await User.find({}, options).toArray();
	let company = [];

	for (let i = 0; i < users.length; i++) {
		if (users[i].role === "COMPANY") {
			company += JSON.stringify(users[i]);
		}
	}
	res.status(200).send(company)
};

exports.listUsers = async (req, res) => {
	const options = getFindOptions(req.query);
	const users = await User.find({}, options).toArray();

	res.status(200).send(users)
};

exports.listTokens = async (req, res) => {
	const options = getFindOptions(req.query);
	const tokens = await Session.find({}, options).toArray();

	res.status(200).send(tokens)
};

exports.getUserById = async (req, res) => {
	const user = await User.get(req.params.id);

	if (!user) throw new HttpError('user-not-found', 404);

	res.json(user)
};

exports.insertJob = async (req, res) => {
	const user = await User.get(req.params.id);
	if (user) {
		if(user.Entreprise.Job.length === 1 && typeof user.Entreprise.Job.intitule === undefined){
			user.Entreprise.Job = [{
				intitule: req.body.intitule,
				nbr_poste: req.body.nbr_poste,
				description: req.body.description,
				date_debut: req.body.date_debut,
				autre: req.body.autre,
				adresse: req.body.adresse,
				cp: req.body.cp,
				ville: req.body.ville,
				Formation: {
					niveau: req.body.niveau,
					nom_formation: req.body.nom_formation
				}
			}];
		} else
		user.Entreprise.Job.push({
			intitule: req.body.intitule,
			nbr_poste: req.body.nbr_poste,
			description: req.body.description,
			date_debut: req.body.date_debut,
			autre: req.body.autre,
			adresse: req.body.adresse,
			cp: req.body.cp,
			ville: req.body.ville,
			Formation: {
				niveau: req.body.niveau,
				nom_formation: req.body.nom_formation
			}
		});
		await User.update(
			req.params.id, {
				Entreprise: user.Entreprise
			}
		);

		res.status(200).send({ Job: req.body });

	} else {
		res.status(400).send('No user found');
	}
};

exports.deleteUser = async (req, res) => {
	const userDeleted = await User.delete(req.params.id);

	if (!userDeleted) throw new HttpError('user-not-found', 404);

	res.sendStatus(200)
};

exports.createRencontre = (req, res) => {

	User.get({
		email: req.body.email
	}).then(async function (user) {
		if (user) {
			res.status(400).json('Email déjà existant');
		}
		else if (req.body === null) {
			res.status(400).send('Merci de rentrer des informations');
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);

				User.create({
					email: req.body.email,
					password: hashedPassword,
					nom: req.body.nom,
					prenom: req.body.prenom,
					sexe: req.body.sexe,
					role: req.body.role,
					Entreprise: {
						email: req.body.email,
						nom: req.body.nom,
						prenom: req.body.prenom,
						logo: req.body.logo,
						nom_entreprise: req.body.nom_entreprise,
						siege: req.body.siege,
						description: req.body.description,
						adresse_company: req.body.adresse_company,
						cp_company: req.body.cp_company,
						ville_company: req.body.ville_company,
						telephone_company: req.body.telephone_company,
						cocktail: req.body.cocktail,
						video: req.body.video,
						Job: [{}]
					}

				});

			try {
				res.send({ user: req.body });
				res.status(200);
			} catch (e) {
				res.status(400).send(e);
			}
		}
	})
};
