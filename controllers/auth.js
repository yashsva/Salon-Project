exports.logout = async (req, res, next) => {
    return req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    })
}