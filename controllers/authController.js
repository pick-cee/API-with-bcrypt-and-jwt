const db = require('../models');
const config = require('../config/authConfig');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
    .then(user => {
        if(req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })
            .then(roles => {
                user.setRoles(roles).then(() => {
                    res.send({
                        message: "User registered successfully",
                        user,
                    });
                });
            });
        } else {
            user.setRoles([1]).then(() => {
                res.send({message: "User registered successfully", user})
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured... try again.."
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {email: req.body.email}
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({message: "User not found!"})
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password!"
            });
        }
        var token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400});
        var authorites = [];
        user.getRoles().then(roles => {
            for(let i=0; i<roles.length;i++){
                authorites.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorites,
                accessToken: token
            });
        });
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    })
}