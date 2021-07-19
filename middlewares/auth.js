const error_controller = require("../controllers/error_controller");

exports.verify_salon = (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect('/salon/login');
    if (!req.session.isSalonAdmin) return error_controller.get_error_403(req, res, next);
    next();
}

exports.verify_customer = (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect('/customer/login');
    if (!req.session.customer) return error_controller.get_error_403(req, res, next);
    next();
}


exports.verify_loggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect('/customer/login');
    next();
}

exports.verify_not_loggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) return res.redirect('/');
    next();
}