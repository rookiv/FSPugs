module.exports = {
    user: ensureUser,
    save: saveRedirect
};

function saveRedirect(req, res, next) {
    req.session.returnTo = req.url;
    return next();
}

function ensureUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.returnTo = req.url;

    res.redirect('/login');
}