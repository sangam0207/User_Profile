const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const multer = require('multer');
const bcrypt=require('bcrypt');
const port = process.env.PORT || 3000;
require("./src/db/conn");
const Register = require("./src/models/register");
const newpath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./Templates/views");
const partialPath = path.join(__dirname, "./Templates/partials");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/upload');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const findEmp = await Register.find({ email: email });
    console.log(findEmp[0].password, password);
    const isMatch= await bcrypt.compare(password,findEmp[0].password )
    console.log(isMatch);
    if (isMatch) {
      res.render("afterLogin", {
        name: `${findEmp[0].firstname} ${findEmp[0].lastname}`,
        email: findEmp[0].email,
        id:findEmp[0]._id
      });
    } else {
      res.render("loginError");
    }
  } catch (error) {
    res.send("invalid email");
  }
});
app.get("/register", (req, res) => {
  res.render("register");
});




app.post("/register", async (req, res) => {
  //console.log(req.body.firstname);

  try {
/*
    const secure=async(password)=>{
      const passwordHash=await bcrypt.hash(password,10);
      console.log(passwordHash);
      const check=await bcrypt.compare('sangam@13',passwordHash);
      console.log(check)
   }
   secure('sangam@123');
   */
    const password = req.body.password;
    const cpassword = req.body.confirm_password;
    if (password === cpassword) {
      console.log(password, cpassword);
      const newEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: password,
        confirm_password: cpassword,
      });

      /// Middle
      const result = await newEmployee.save();
      res.render("index");
    } else {
      res.render("errorpage");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/info/:id", (req, res) => {
  const {id}=req.params;
  res.render("completeInfo",{id:id});
});
/*
app.patch('/info/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body; 

  try {
  const data=  await Register.findByIdAndUpdate(userId, updatedData);
  console.log(data)
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});
*/

app.post("/info/:id", upload.single("photo"),  async(req, res) => {
  const {id}=req.params;
  const fileName=req.file.filename;
  console.log(fileName);
 // const img=req.file.path;
    const updates={...req.body,photo:fileName};
  //  const photo= req.file.path;
   //console.log(updates)
  
    try {
      const updatedUser = await Register.findByIdAndUpdate(id, updates, { new: true });
      
       console.log(updatedUser);
       res.render('userProfile',{
               user_name:`${updatedUser.firstname} ${updatedUser.lastname}`,
               user_age:updatedUser.age,
               user_gender:updatedUser.gender,
               user_phone:updatedUser.contactNumber,
               user_interest:updatedUser.areaOfInterest,
               user_img:`/upload/${updatedUser.photo}`,
               user_linkedin:updatedUser.linkedinURL,
               user_github:updatedUser.githubURL,
               user_email:updatedUser.email,
               user_skills:updatedUser.topSkills,
               user_exp:updatedUser.yearsOfExperience,
               user_address:updatedUser.address,
               user_college:updatedUser.college,
               user_insta:updatedUser.instaURL
       });
       
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }



});

app.get('/profile/:id',async(req,res)=>{
  const {id}=req.params;
  const userData = await Register.findById(id);
  console.log(userData)


  ///
  res.render('userProfile',{
    user_name:`${userData.firstname} ${userData.lastname}`,
    user_age:userData.age,
    user_gender:userData.gender,
    user_phone:userData.contactNumber,
    user_interest:userData.areaOfInterest,
    user_img:`/upload/${userData.photo}`,
    user_linkedin:userData.linkedinURL,
    user_github:userData.githubURL,
    user_email:userData.email,
    user_skills:userData.topSkills,
    user_exp:userData.yearsOfExperience,
    user_address:userData.address,
    user_college:userData.college,
    user_insta:userData.instaURL
});
/////////


  //res.send(userData);
})

/*
app.get('/info/:id',(req,res)=>{
  const {id}=req.params;
  console.log(id);
  res.send(id)
})
app.patch('/info/:id',(req,res)=>{
  const {id}=req.params;
  console.log(id);
  res.send(id)
});
*/
app.listen(port, () => {
  console.log(`server is running at port number ${port}`);
});



//http://127.0.0.1:3000/info/64ee126e951f410d3eb95f39?firstName=Sangam&lastName=Shukla&age=12&gender=male&email=ssrv2024%40gmail.com&contactNumber=%2B918381847820&address=Kalyanpur+%28Kanpur+Nagar%29&college=ddd&topSkills=c%2Cc%2B%2B%2Cjs%2Cpython%2Ccss&areaOfInterest=dasddsa&yearsOfExperience=3&linkedinURL=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fsangam-shukla-225412271%2F&githubURL=https%3A%2F%2Fgithub.com%2Fsangam0207&instaURL=https%3A%2F%2Fwww.instagram.com%2Fsangam.shukla.7503%2F&photo=WhatsApp+Image+2023-04-18+at+12.48.56+AM.jpeg


/*{

//   //console.log(req.body)
//   try {
   
    
//    user.schema.obj.firstname=req.body.firstName;
//    user.schema.obj.lastname= req.body.lastName;
//    user.schema.obj.age=req.body.age;
//     user.schema.obj.gender=req.body.gender;
//     user.schema.obj.email =req.body.email;
//     user.schema.obj.contactNumber= req.body.contactNumber;
//    user.schema.obj.address= req.body.address;
//    user.schema.obj.topSkills= req.body.topSkills.split(",").map((skill) => skill.trim());
//    user.schema.obj.areaOfInterest= req.body.areaOfInterest;
//    user.schema.obj.yearsOfExperience= req.body.yearsOfExperience;
//    user.schema.obj.linkedinURL= req.body.linkedinURL;
//    user.schema.obj.githubURL= req.body.githubURL;
//    user.schema.obj.instaURL= req.body.instaURL;
//    //const photo= req.file.path;
//    user.schema.obj.img=req.file.filename;
//    user.schema.obj.college=req.body.college;

//  await user.model2233.save();
// // console.log(data)

// /*
//     const newUser = new User({
//       firstName: firstName,
//       lastName: lastName,
//       age: age,
//       gender: gender,
//       email: email,
//       contactNumber: contactNumber,
//       address: address,
//       topSkills: topSkills,
//       areaOfInterest:areaOfInterest,
//       yearsOfExperience: yearsOfExperience,
//       linkedinURL: linkedinURL,
//       githubURL: githubURL,
//       instaURL:instaURL,
//       photo:img,
//       college:college

//     });
// ///console.log(img)
//     await newUser.save();
//     res.render('userProfile',{
//       user_name:`${firstName} ${lastName}`,
//       user_age:age,
//       user_gender:gender,
//       user_phone:contactNumber,
//       user_interest:areaOfInterest,
//       user_img:`/upload/${img}`,
//       user_linkedin:linkedinURL,
//       user_github:githubURL,
//       user_email:email,
//       user_skills:topSkills,
//       user_exp:yearsOfExperience,
//       user_address:address,
//       user_college:college,
//       user_insta:instaURL
//     })
//     */
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error saving user data.");
//   }
