const express = require('express')
const jwt = require('jsonwebtoken')
const Authentications = require('../model/authentication')
const Joi = require('joi')
const {rolevalid } = require('../middleware/rolevalid');
const {validationtoken , adminserver} = require('../middleware/adminservervalidationtoken');
const httpresponse = require('../middleware/httpresponse');

const routes = express.Router();

/// multer
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+`.${ext}`
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
    
  })
  const fileFilter = (req, file, cb) => {
    const typeoffile = file.mimetype.split('/')[0];
    // console.log("fgkgjfgk" + typeoffile)
    if (typeoffile!== 'image') {
        return cb({ "status":httpresponse.errorCallback , "erorr":'Only images are allowed!'}, false);
    }
    cb(null, true);
  }


  
  const upload = multer({ 
     storage ,
     fileFilter
   })


  //////git all ////

routes.get('/', adminserver ,async (req, res) => {
    try {
        const authentications = await Authentications.find().select("-password");
        res.json(authentications);
        
    } catch (error) {
        res.status(404).send(error.message);
    }
})




routes.get('/:id', validationtoken , async (req, res) => {
    try {
        const authentication = await Authentications.findById(req.params.id).select("-password");
        if (!authentication) return res.status(404).send("Not Found");
        res.json(authentication._doc);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

 routes.post('/', upload.single('avatar') , rolevalid , async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50).trim(),
        email: Joi.string().required().email().trim(),
        password: Joi.string().required().min(8).max(16).trim(), 
        role: Joi.string(),
        avatar: Joi.string(), 
      
    }) 
    
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    var user = await Authentications.findOne({ email: req.body.email})
    if(user) return res.status(400).send("User already exists");

     user = await Authentications.findOne({ name: req.body.name})
    if(user) return res.status(400).send("Username already exists");

    

    const newauthentication = new Authentications({
        name: req.body.name,
        email: req.body.email,
        password : req.body.password,
        role:req.body.role,
        avatar: req.file.filename
    })


    try {
       
       const authentication = await newauthentication.save();
        const token = jwt.sign({_id: authentication._id , role:authentication.role , avatar:authentication.avatar  }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
        authentication.token = token;
        await authentication.save();
        const { password , ...other} = authentication._doc;
        res.send({...other })


    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

routes.put('/:id', validationtoken , async (req, res) => {
    const { name, email, password, role } = req.body;
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).trim(),
        email: Joi.string().email().trim(),
        password: Joi.string().min(8).max(16).trim(),
        role: Joi.string(),
    })
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const existingUserByName = await Authentications.findOne({name});
        if (existingUserByName && existingUserByName._id.toString() !== req.params.id) {
            return res.status(400).send("Username already exists");
        }

        // Check if email exists and exclude current user by ID
        const existingUserByEmail = await Authentications.findOne({ email });
        if (existingUserByEmail && existingUserByEmail._id.toString() !== req.params.id) {
            return res.status(400).send("Email already exists");
        }




    const authentication = await Authentications.findByIdAndUpdate(req.params.id, 
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
          },
        {new: true}
        )
        
        try {
    if(!authentication) return res.status(404).send("Not Found"); 
    res.json(authentication);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

routes.delete('/:id', adminserver , async (req, res) => {
    try {
    const authentication = await Authentications.findByIdAndDelete(req.params.id);
    if(!authentication) return res.status(404).send("Not Found"); 
    res.send(authentication);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

routes.post('/login', async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().required().email().trim(),
        password: Joi.string().required().min(8).max(16).trim(),
    })
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await Authentications.findOne({ email: req.body.email});
    if(!user) return res.status(400).send("Invalid email or password");

    const validPassword = req.body.password === user.password || bcrypt.compareSync(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Invalid email or password");

    const token = jwt.sign({_id: user._id , role:user.role ,  avatar:user.avatar  }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
    user.token = token;
    await user.save();
    
    try{
        const { password,...other} = user._doc;
        res.send({...other})
    
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})


module.exports = routes;