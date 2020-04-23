const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const Keys = require('../../config/Keys');
const passport=require('passport');

const userModel = require('../../models/userModel');

//$router GET api/users/test
//@desc 测试
//@access Public
router.get("/test", (req, res) => {
    res.json({ msg: "Login works" });
});


//$router GET api/users/register
//@desc 用户注册
//@access Public
router.post("/register", (req, res) => {
    userModel.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json("email exsit" );
            } else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity:req.body.identity
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});

//$router GET api/users/login
//@desc 返回token jwt passport
//@access Public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userModel.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json("Null User");
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = { 
                            id: user.id, 
                            name: user.name,
                            avatar:user.avatar,
                            identity:user.identity    
                        };
                        jwt.sign(rule, Keys.secretOrKey, { expiresIn: 7200 }, (err, token) => {
                            if(err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                    } else {
                        return res.status(400).json("wrong password");
                    }
                }).catch(err => console.log(err));
        })
});


//$router GET api/users/current
//@desc 返回current user
//@access private
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    });
})

//$router GET api/users/test
//@desc 获取所有用户信息
//@access Public
router.get("/getAllUser",passport.authenticate("jwt",{session:false}),(req, res) => {
    userModel.find()
        .then((users) => {
            res.json(users);
        })
})
module.exports = router;