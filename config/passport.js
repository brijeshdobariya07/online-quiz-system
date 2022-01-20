const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const User = require('../src/models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email})
            .then( user =>{
                if(!user){
                    return done(null,false,{message:'That Email is not registered'});
                }
                // Match Password
                if(password == user.password){
                    return done(null,user);
                } else{
                    return done(null,false,{message:'Password Incorrect'})
                }
            })
            .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        });
    })

}