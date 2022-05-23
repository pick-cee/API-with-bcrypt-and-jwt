const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    User.findOne({where: {email: req.body.email}})
    .then(data => {
        if(data) {
            res.status(400).send({
                message: "Email is already in use... try a different one 😉",
            })
            return;
        }
        next()
    })
}
checkRolesExist = (req, res, next) => {
    if(req.body.roles) {
        for(let i=0; i<req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    message:"Failed! Role does not exits" + req.body.roles[i]
                });
                return
            }
        }
    }
    next();
}
const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
    checkRolesExist: checkRolesExist,
}

module.exports = verifySignUp;