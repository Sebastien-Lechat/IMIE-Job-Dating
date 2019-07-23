/*
** See https://terrajs.org/mono/routes#validation
*/
const Joi = require('joi'); // joi is a dependency of mono
const { findValidation } = require('mono-mongodb'); // See https://github.com/terrajs/mono-mongodb#utils

exports.createUser = {
	body: Joi.object().keys({
		email: Joi.string().email({minDomainAtoms: 2}).required().trim(),
		password: Joi.string().min(6).required().trim(),
		nom: Joi.string().trim().required(),
		prenom: Joi.string().trim().required(),
		sexe: Joi.string().required().valid(["Homme", "Femme"]),
		role: Joi.string().required().valid(["STUDENT", "ADMIN", "COMPANY"]),
		age: Joi.when("role", { is: "STUDENT", then: Joi.string().trim().required().max(3) }),
		adresse_student: Joi.when("role", { is: "STUDENT", then: Joi.string().required() }),
		cp_student: Joi.when("role", { is: "STUDENT", then: Joi.string().trim().required().min(5) }),
		ville_student: Joi.when("role", { is: "STUDENT", then: Joi.string().required() }),
		link_cv: Joi.when("role", { is: "STUDENT", then: Joi.string().trim().required() }),
		status: Joi.when("role", { is: "STUDENT", then: Joi.string().valid(["Présent", "Absent", "En retard"]) }),
		telephone_student: Joi.when("role", { is: "STUDENT", then: Joi.string().required() }),
		niveau: Joi.when("role", { is: "STUDENT", then: Joi.string().required() }),
		nom_formation: Joi.when("role", { is: "STUDENT", then: Joi.string().required() }),
		logo: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		nom_entreprise: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		siege: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		description: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		adresse_company: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		cp_company: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		ville_company: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		telephone_company: Joi.when("role", { is: "COMPANY", then: Joi.string().required() }),
		cocktail: Joi.when("role", { is: "COMPANY", then: Joi.string().valid(["True", "False"]).required() }),
		video: Joi.when("role", { is: "COMPANY", then: Joi.string().required() })
	})
};

exports.connectUser = {
	body: Joi.object().keys({
		email: Joi.string().email({ minDomainAtoms: 2 }).required().trim(),
		password: Joi.string().required().trim(),
	})
};

exports.getCompany = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	}),
	query: Joi.object().keys(findValidation)
};

exports.listUsers = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	}),
	query: Joi.object().keys(findValidation)
};

exports.listTokens = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	}),
	query: Joi.object().keys(findValidation)
};

exports.getUser = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	})
};

exports.insertJob = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	}),
	body: Joi.object().keys({
		intitule: Joi.string().required(),
		nbr_poste: Joi.string().trim().required(),
		description: Joi.string().required(),
		date_debut: Joi.string().required(),
		autre: Joi.string(),
		adresse: Joi.string().required(),
		cp: Joi.string().required(),
		ville: Joi.string().required(),
		niveau: Joi.string().required(),
		nom_formation: Joi.string().required()
	})
};

exports.deleteUser = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	})
};


exports.createMeet = {
	body: Joi.object().keys({
		status: Joi.string().valid(["1", "2", "3"]),
		nom_entreprise: Joi.string().required()
	})
};
