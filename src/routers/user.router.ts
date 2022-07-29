import { Router } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { sample_users } from "../data";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodscount = await UserModel.countDocuments();
    if (foodscount > 0) {
      res.send("Foods already seeded");
      return;
    }
    await UserModel.create(sample_users);
    res.status(200).send("Foods seeded");
  })
);

// router.post("/login",asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await UserModel.findOne({ email, password });

//     if (user) {
//       res.send(generateToken(user));
//     } else {
//       res.status(HTTP_BAD_REQUEST).send("user is not valid");
//     }
//   })
// );
router.post("/login", asyncHandler(
  async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email , password});
      
     if(user) {
      res.send(generateTokenReponse(user));
     }
     else{
       res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
     }
  
  }
))
  



router.post("/register",asyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("user is already registered please login");
      return;
    }

    const encryptedpassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedpassword,
      address,
      isAdmin: false,
    };

    const dbuser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbuser));
  })
);

const generateTokenReponse = (user : User) => {
  const token = jwt.sign({
    id: user.id, email:user.email, isAdmin: user.isAdmin
  },process.env.JWT_SECRET!,{
    expiresIn:"30d"
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token
  };
}

export default router;
