var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
var userModel  = require('../models/user')

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (id, done) {
    userModel.findById(id, function(err, user) {
        done(err, user)
    })
})

passport.use('signup', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({username: username})
            if (user) {
                return done(null, false, {message: 'User already exists'})
            } else {
                const newUser = await userModel.create({username: username, password: password})
                return done(null, newUser,  { message: 'Signed up Successfully' })
            }
        } catch (error) {
            done(error)
        }
    })
)

passport.use('login', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({ username: username })
            if (!user) {
                return done(null, false, { message: 'User not found' })
            }
            const validate = await user.validPassword(password)
            if (!validate) {
                return done(null, false, { message: 'Wrong Password' })
            }
            return done(null, user, { message: 'Logged in Successfully' })
        } catch (error) {
            console.log(error.message)
            return done(error);
        }
    })
)

passport.use(new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromBodyField('token')
        },
        async (token, done) => {
            try {
                return done(null, token.user)
            } catch (error) {
                done(error)
            }
        }
    )
)

module.exports = passport
