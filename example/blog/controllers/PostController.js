var User = require('../models/user');
var Post = require('../models/post');
var debug = require('debug')('blog:post_controller');

module.exports.register = (req, res, next) => {
    debug("New User", {
        body: req.body
    });
    User.findOne({
            username: req.body.username
        }, "-password -login_count")
        .then((foundUser) => {
            if (foundUser) {
                debug("Usuario duplicado");
                throw new Error(`Usuario duplicado ${req.body.username}`);
            } else {
                let newUser = new User({
                    username: req.body.username,
                    first_name: req.body.firts_name || "",
                    last_name: req.body.last_name || "",
                    email: req.body.email,
                    password: req.body.password /*TODO: Modificar, hacer hash del password*/
                });
                return newUser.save(); // Retornamos la promesa para poder concater una sola linea de then
            }
        }).then(user => { // Con el usario almacenado retornamos que ha sido creado con exito
            return res
                .header('Location', '/users/' + user._id)
                .status(201)
                .json({
                    username: user.username
                });
        }).catch(err => {
            next(err);
        });
}

module.exports.update = (req, res, next) => {
    debug("Update user", {
        username: req.params.username,
        ...req.body
    });

    let update = {
        ...req.body
    };

    User.findOneAndUpdate({
            username: req.params.username
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

module.exports.delete = (req, res, next) => {

    debug("Delete user", {
        username: req.params.username,
    });

    User.findOneAndDelete({username: req.params.username})
    .then((data) =>{
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}