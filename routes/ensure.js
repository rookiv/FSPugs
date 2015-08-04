module.exports = {
    user: ensureUser,
    save: saveRedirect,
    elevated: ensureElevated
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

function ensureElevated(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Admin') {
        return next();
    }

    req.session.returnTo = req.url;
    res.redirect('/login');
}