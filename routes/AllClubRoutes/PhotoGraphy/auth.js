const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")


const PHOTOCABINATE = mongoose.model("PHOTOCABINATE");
const PHOTODIRECTOR = mongoose.model("PHOTODIRECTOR");
const ARTCLUB = mongoose.model("ARTCLUB");
const PHOTOEDITOR = mongoose.model("PHOTOEDITOR");
const PHOTOJUDGE = mongoose.model("PHOTOJUDGE");
const PHOTOPRINCIPLE = mongoose.model("PHOTOPRINCIPLE");


const {Jwt_secret} = require("../../../keys");



router.post("/PHOTOCABINATE-signup" , (req,res)=> {
    const {name , password ,email , state , district , school} = req.body;
    const ip = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress || '' ;


    if(!name ||!password ||!email || !state || !district || !school){
        return res.status(422).json({error : "Please add all the fields"})
    }

    PHOTOCABINATE.findOne({$or : [{email : email} ]}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "user already exist with that email or userName"})
        }


        bcryptjs.hash(password , 12).then((hashedPassword) => {
            const teacher = new CRAFTCABINATE ({
                name , 
                email,    
                password:hashedPassword, //hiding password,
                ip,
                school,
                district,
                state
            })
        
            teacher.save()
            .then(teacher => {res.json({message : "Data Saved"})})
            .catch(err => {console.log(err)})
        })
    })
})



router.post("/PHOTOCABINATE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    PHOTOCABINATE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , club , school } = savedUser
                res.json({token , user:{_id ,name , email , state , district , club , school }})
                console.log({token , user:{_id ,name , email , state , district , club , school}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/PHOTODIRECTOR-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTDIRECTOR.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new PHOTODIRECTOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Director registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/PHOTODIRECTOR-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    PHOTODIRECTOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/PHOTOEDITOR-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTEDITOR.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new PHOTOEDITOR({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Editor registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.post("/PHOTOEDITOR-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    PHOTOEDITOR.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})






router.post("/PHOTOJUDGE-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTJUDGE.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new CRAFTJUDGE({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Judge registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/PHOTOJUDGE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    PHOTOJUDGE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})




router.post("/PHOTOPRINCIPLE-signup", async (req, res) => {
  const { name, password, email, state, district, clubName } = req.body;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  if (!name || !password || !email || !state || !district || !clubName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await CRAFTPRINCIPLE.findOne({
      $or: [{ email: email }, { clubName: clubName }]
    });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email or club name" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const director = new PHOTOPRINCIPLE({
      name,
      email,
      password: hashedPassword,
      ip,
      state,
      district,
      clubName: clubName.toUpperCase()
    });

    const savedDirector = await director.save();

    if (clubName.toUpperCase() === "ART") {
      const artClubId = "684a8c32d27f1ad8681187d0";
      await ARTCLUB.findByIdAndUpdate(artClubId, {
        $push: { director: savedDirector._id }
      });
    }

    res.json({ message: "Judge registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/PHOTOPRINCIPLE-signin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    PHOTOPRINCIPLE.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , clubName } = savedUser
                res.json({token , user:{_id ,name , email,  state , district , clubName  }})
                console.log({token , user:{_id ,name , email ,  state , district , clubName}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})

































module.exports = router;