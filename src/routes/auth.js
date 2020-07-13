const router = require('express').Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', passport.authenticate('discord'));

router.get('/redirect', function (req, res, next) {
    passport.authenticate('discord', {
        failureRedirect: '/',
        successRedirect: req.cookies['redirect']
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

module.exports = router;