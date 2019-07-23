const { HttpError } = require('mono-core');
const { getFindOptions } = require('mono-mongodb');

const bcrypt = require('bcryptjs');
const User = require('../services/users.service');
const Session = require('../services/session.service');
const Rencontre = require('../services/recontre.service');
const Utils = require('../services/utils.service');

const jwt = require('jsonwebtoken');
const production = require('../../conf/production').mono.jwt.secret;

const { db } = require('mono-mongodb');

exports.createUser = (req, res) => {

    User.get({
        email: req.body.email
    }).then(async function(user) {
        if (user) {
            res.status(400).json('Email déjà existant');
        } else if (req.body === null) {
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
    }).then(async function(user) {
        if (!user) {
            return res.status(400).send('No User Found !');
        } else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);

            if (!validPassword) {
                return res.status(400).send('Invalid Password');
            } else {
                const token = jwt.sign({ _id: user._id }, production);
                res.header('Authorization', 'Bearer ' + token);

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

exports.getCompany = async(req, res) => {
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

exports.listUsers = async(req, res) => {
    const options = getFindOptions(req.query);
    const users = await User.find({}, options).toArray();

    res.status(200).send(users)
};

exports.listTokens = async(req, res) => {
    const options = getFindOptions(req.query);
    const tokens = await Session.find({}, options).toArray();

    res.status(200).send(tokens)
};

exports.getUserById = async(req, res) => {
    const user = await User.get(req.params.id);

    if (!user) throw new HttpError('user-not-found', 404);

    res.json(user)
};

exports.insertJob = async(req, res) => {
    const user = await User.get(req.params.id);
    if (user) {
        if (user.Entreprise.Job.length === 1 && typeof user.Entreprise.Job.intitule === undefined) {
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

exports.deleteUser = async(req, res) => {
    const userDeleted = await User.delete(req.params.id);

    if (!userDeleted) throw new HttpError('user-not-found', 404);

    res.sendStatus(200)
};

exports.createMeet = async(req, res) => {
    const student = await User.get(req.params.id);

    const options = getFindOptions(req.query);
    const meet = await Rencontre.find({}, options).toArray();
    let createMeet = false;

    if (meet.length > 0) {
        for (let i = 0; i < meet.length; i++) {
            if (meet[i].info_etudiant._id == req.params.id) {
                if (meet[i].nom_entreprise === req.body.nom_entreprise) {
                    res.status(400).send("Rencontre déjà existante");
                    createMeet = true;
                }
            }
        }
    }
    if (createMeet === false) {
        Rencontre.create({
            status: '1',
            nom_entreprise: req.body.nom_entreprise,
            info_etudiant: student
        });
        res.status(200).send("Rencontre créée");
    }
};

exports.listMeets = async(req, res) => {
    const options = getFindOptions(req.query);
    const meets = await Rencontre.find({}, options).toArray();

    res.status(200).send(meets)
};

exports.initFakeUser = async(req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    User.create({
        email: 'seb.lcht@bouyges.test',
        password: hashedPassword,
        nom: 'Lechat',
        prenom: 'Sébastien',
        sexe: 'Homme',
        role: 'COMPANY',
        Entreprise: {
            email: 'seb.lcht@bouyges.test',
            nom: 'Lechat',
            prenom: 'Sébastien',
            logo: 'data:image/png;base64,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',
            nom_entreprise: 'Bouyges',
            siege: 'Paris',
            description: "Bouyges est une entreprise française de télécommunications. Elle comptait à la fin de 2015 près de 262,9 millions6 de clients dans le monde1, des chiffres en hausse par rapport à ceux affichés en 20147. En 2013, l'entreprise est leader ou second opérateur dans 75% des pays européens où elle est implantée et dans 83% des pays en Afrique et au Moyen-Orient8.",
            adresse_company: '47 rue de Paris',
            cp_company: '75001',
            ville_company: 'Levallois',
            telephone_company: '0178786667',
            cocktail: 'True',
            video: 'url',
            Job: [{

                },
                {
                    intitule: 'Développeur Full Stack JS',
                    nbr_poste: '2',
                    description: "Le Développeur full Stack JS, l’un des professionnels les plus recherchés de la webosphère, doit maîtriser les principales technologies informatiques et les principaux langages de programmation actuellement utilisés. Son développement intègre la dimension front-end (création d’interfaces claires et ergonomiques, intégration des différentes pages), ou back-end (développement et programmation des fonctionnalités et bases de données). Ce généraliste possède des compétences très demandées, notamment via la maîtrise de Frameworks et de l’asynchrone avec NodeJS. Le développeur intégrateur full Stack est un  véritable touche à tout très prisé par les Start up qui n’ont souvent pas les moyens d’embaucher plusieurs développeurs.",
                    date_debut: ' Septembre 2019',
                    autre: ' Maîtrise : Html 5, Css 3, JavaScript, DOM, JQuery, Bootstrap, AngularJS, JSON, NodeJS, Ajax, Meteor et WebSockets',
                    adresse: '1 rue de Troie',
                    cp: '12345',
                    ville: 'Asniere',
                    Formation: {
                        niveau: 'Bac +3',
                        nom_formation: 'Concepteur développeur Web'
                    }
                },
                {
                    intitule: 'Développeur Full Stack PHP',
                    nbr_poste: '2',
                    description: "Le Développeur full Stack PHP, l’un des professionnels les plus recherchés de la webosphère, doit maîtriser les principales technologies informatiques et les principaux langages de programmation actuellement utilisés. Son développement intègre la dimension front-end (création d’interfaces claires et ergonomiques, intégration des différentes pages), ou back-end (développement et programmation des fonctionnalités et bases de données). Ce généraliste possède des compétences très demandées, notamment via la maîtrise de Frameworks et de l’asynchrone avec NodeJS. Le développeur intégrateur full Stack est un  véritable touche à tout très prisé par les Start up qui n’ont souvent pas les moyens d’embaucher plusieurs développeurs.",
                    date_debut: ' Septembre 2019',
                    autre: ' Maîtrise : Html 5, Css 3, JavaScript, PHP, JQuery, Bootstrap, AngularJS, JSON, NodeJS, Ajax, Meteor et WebSockets',
                    adresse: '2 rue des Champs Elysée',
                    cp: '75004',
                    ville: 'Paris',
                    Formation: {
                        niveau: 'Bac +3',
                        nom_formation: 'Concepteur développeur Web'
                    }
                }
            ]
        }
    }).then(() => {
        User.create({
            email: 'seb.lcht@orange.test',
            password: hashedPassword,
            nom: 'Lechat',
            prenom: 'Sébastien',
            sexe: 'Homme',
            role: 'COMPANY',
            Entreprise: {
                email: 'seb.lcht@orange.test',
                nom: 'Lechat',
                prenom: 'Sébastien',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1022px-Orange_logo.svg.png',
                nom_entreprise: 'Orange',
                siege: 'Paris',
                description: "Orange est une entreprise française de télécommunications. Elle comptait à la fin de 2015 près de 262,9 millions6 de clients dans le monde1, des chiffres en hausse par rapport à ceux affichés en 20147. En 2013, l'entreprise est leader ou second opérateur dans 75% des pays européens où elle est implantée et dans 83% des pays en Afrique et au Moyen-Orient8.",
                adresse_company: '47 rue de Paris',
                cp_company: '75001',
                ville_company: 'Levallois',
                telephone_company: '0178786667',
                cocktail: 'True',
                video: 'url',
                Job: [{

                    },
                    {
                        intitule: 'Développeur Full Stack JS',
                        nbr_poste: '2',
                        description: "Le Développeur full Stack JS, l’un des professionnels les plus recherchés de la webosphère, doit maîtriser les principales technologies informatiques et les principaux langages de programmation actuellement utilisés. Son développement intègre la dimension front-end (création d’interfaces claires et ergonomiques, intégration des différentes pages), ou back-end (développement et programmation des fonctionnalités et bases de données). Ce généraliste possède des compétences très demandées, notamment via la maîtrise de Frameworks et de l’asynchrone avec NodeJS. Le développeur intégrateur full Stack est un  véritable touche à tout très prisé par les Start up qui n’ont souvent pas les moyens d’embaucher plusieurs développeurs.",
                        date_debut: ' Septembre 2019',
                        autre: ' Maîtrise : Html 5, Css 3, JavaScript, DOM, JQuery, Bootstrap, AngularJS, JSON, NodeJS, Ajax, Meteor et WebSockets',
                        adresse: '1 rue de Troie',
                        cp: '12345',
                        ville: 'Asniere',
                        Formation: {
                            niveau: 'Bac +3',
                            nom_formation: 'Concepteur développeur Web'
                        }
                    },
                    {
                        intitule: 'Développeur Full Stack PHP',
                        nbr_poste: '2',
                        description: "Le Développeur full Stack PHP, l’un des professionnels les plus recherchés de la webosphère, doit maîtriser les principales technologies informatiques et les principaux langages de programmation actuellement utilisés. Son développement intègre la dimension front-end (création d’interfaces claires et ergonomiques, intégration des différentes pages), ou back-end (développement et programmation des fonctionnalités et bases de données). Ce généraliste possède des compétences très demandées, notamment via la maîtrise de Frameworks et de l’asynchrone avec NodeJS. Le développeur intégrateur full Stack est un  véritable touche à tout très prisé par les Start up qui n’ont souvent pas les moyens d’embaucher plusieurs développeurs.",
                        date_debut: ' Septembre 2019',
                        autre: ' Maîtrise : Html 5, Css 3, JavaScript, PHP, JQuery, Bootstrap, AngularJS, JSON, NodeJS, Ajax, Meteor et WebSockets',
                        adresse: '2 rue des Champs Elysée',
                        cp: '75004',
                        ville: 'Paris',
                        Formation: {
                            niveau: 'Bac +3',
                            nom_formation: 'Concepteur développeur Web'
                        }
                    }
                ]
            }
        })
    }).then(() => {
        for (let i = 0; i < 20; i++) {
            User.create({
                email: 'seb.test@test.test' + i,
                password: hashedPassword,
                nom: 'Lechat' + i,
                prenom: 'Sébastien' + i,
                sexe: 'Homme',
                role: 'STUDENT',
                Etudiant: {
                    email: 'seb.test@test.test' + i,
                    age: '22',
                    adresse_student: '180 rue de la pourpardière',
                    cp_student: '91600',
                    ville_student: 'Savigny Sur Orge',
                    link_cv: 'https://www.w3schools.com/w3css/img_lights.jpg',
                    telephone_student: '0601787186',
                    Formation: {
                        niveau: 'Bac +3',
                        nom_formation: 'Concepteur développeur Web'
                    }
                }
            }).then(() => {
                const options = getFindOptions(req.query);
                const users = User.find({}, options).toArray();
                if (i % 2 == 0 || i % 2 != 0) {
                    users.then((result) => {
                        const fake_id = result[i]._id;
                        const student = User.get(fake_id);
                        student.then((result) => {
                            Rencontre.create({
                                status: '1',
                                nom_entreprise: 'Orange',
                                info_etudiant: result
                            });
                        })
                    })
                }
                if (i % 2 == 0 || i % 2 != 0) {
                    users.then((result) => {
                        const fake_id = result[i]._id;
                        const student = User.get(fake_id);
                        student.then((result) => {
                            Rencontre.create({
                                status: '1',
                                nom_entreprise: 'Bouyges',
                                info_etudiant: result
                            });
                        })
                    })
                }


            })
        }
    })

    res.status(200).send("Database initialized !")

};

// exports.deleteFakeUser = async(req, res) => {
//     const options = getFindOptions(req.query);
//     const users = User.find({}, options).toArray();
//     users.then((result) => {
//             for (let i = 0; i < 100; i++) {
//                 User.delete();
//                 Rencontre.delete();
//             }
//         }),
//         res.status(200).send("Database drop !")
// };

exports.dropRencontreCollection = async(req, res) => {
    await Utils.dropCollection('rencontre');
    await Utils.dropCollection('users');
    res.status(200).send('Collection Rencontre dropped.')
}