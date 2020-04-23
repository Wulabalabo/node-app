const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose=require("mongoose");
const userModel=mongoose.model("users");
const Keys=require("../config/keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Keys.secretOrKey;

module.exports=passport=>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        userModel.findById(jwt_payload.id)
            .then(user=>{
                if(user){
                    return done(null,user);
                }

                return done(null,false);
            })
            .catch(err=>console.log(err));
    }));      
}