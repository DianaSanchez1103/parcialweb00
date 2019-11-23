var User = require('../models/user');
var debug = require('debug')('blog:user_controller');

module.exports.getOne = (req, res, next) => {
    debug("Search User", req.params);
    User.findOne({
            username: req.params.username
        }, "-password -login_count")
        .then((foundUser) => {
            if (foundUser)
                return res.status(200).json(foundUser);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Usert List",{size:perPage,page, sortby:sortProperty,sort});

    User.find({}, "-password -login_count")
        .limit(perPage)
        .skip(perPage * page)
        .sort({ [sortProperty]: sort})
        .then((users) => {
           return res.status(200).json(users)
        }).catch(err => {
            next(err);
        })

}