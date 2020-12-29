const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcryptjs');
const User = require("../models/User");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email',passwordField:'password'},(email,password,done)=> {
            //match user
            User.findOne({email : email})
                .then((user)=>{
                    if(!user) {
                        return done(null,false,{message : 'that email is not registered'});


                    }
                    //match pass
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch) {
                            return done(null,user);
                        } else {
                            return done(null,false,{message : 'Password incorrect'});
                        }
                    })
                })
                .catch((err)=> {console.log(err)})
        })

    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });




    passport.use(
        'signup',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            async (email, password, done) => {
                try {
                    const user = await User.create({ email, password });

                    return done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );
};

















