exports.get_error_404 = (req, res, next) => {
    res.status(404).render('errors/404', {
        page_title: 'Page Not Found'
    });
}
exports.get_error_500 = (req, res, next) => {
    res.status(500).render('errors/500', {
        page_title: 'Server Issue'
    });
}

exports.get_error_403 = (req, res, next) => {
    res.status(403).render('errors/403', {
        page_title: 'Forbidden'
    });
}