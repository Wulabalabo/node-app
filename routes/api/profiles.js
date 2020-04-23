const express = require("express");
const router = express.Router();
const passport=require('passport');

const profileModel=require('../../models/profileModel');

//$router GET api/profiles/test
//@desc 测试
//@access Public
router.get("/test", (req, res) => {
    res.json({ msg: "profile works" });
});

//$router GET api/profiles/add
//@desc 创建信息接口
//@access private
router.post("/add",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profileFields={};

    if(req.body.type) profileFields.type=req.body.type;
    if(req.body.describe) profileFields.describe=req.body.describe;
    if(req.body.income) profileFields.income=req.body.income;
    if(req.body.expend) profileFields.expend=req.body.expend;
    if(req.body.cash) profileFields.cash=req.body.cash;
    if(req.body.remark) profileFields.remark=req.body.remark;

    new profileModel(profileFields).save()
        .then(profile=>{
            res.json(profile);
        })

});

//$router GET api/profiles
//@desc 获取所有信息
//@access private
router.get("/",passport.authenticate('jwt',{session:false}),(req,res)=>{
    profileModel.find()
        .then(profile=>{
            if(!profile){
                return res.status(404).json('null');
            }
            res.json(profile);
        })
        .catch(err=>res.status(404).json(err));
})

//$router GET api/profiles/:id
//@desc 获取所有信息
//@access private
router.get("/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{
    profileModel.findById({_id:req.params.id})
        .then(profile=>{
            if(!profile){
                return res.status(404).json('null');
            }
            res.json(profile);
        })
        .catch(err=>res.status(404).json(err));
})


//$router GET api/profiles/edit
//@desc 获取所有信息
//@access private
router.post("/edit/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profileFields={};

    if(req.body.type) profileFields.type=req.body.type;
    if(req.body.describe) profileFields.describe=req.body.describe;
    if(req.body.income) profileFields.income=req.body.income;
    if(req.body.expend) profileFields.expend=req.body.expend;
    if(req.body.cash) profileFields.cash=req.body.cash;
    if(req.body.remark) profileFields.remark=req.body.remark;

    profileModel.findOneAndUpdate(
        {_id:req.params.id},
        {$set:profileFields},
        {new:true})
        .then(profile=>res.json(profile))
        .catch(err=>res.json(err));
})

//$router GET api/profiles/delete/:id
//@desc 删除接口
//@access private
router.delete("/delete/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{    

    profileModel.findOneAndRemove(
        {_id:req.params.id},)
        .then(profile=>profile.save()
            .then(profile=>res.json(profile)))
        .catch(err=>res.json(err));
})

module.exports=router;