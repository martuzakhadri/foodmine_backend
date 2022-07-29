import {Router} from 'express';
import asyncHandler from "express-async-handler";
import { sample_foods, sample_tags, sample_users } from '../data';
import { FoodModel } from '../models/food.model';
import { UserModel } from '../models/user.model';

const router = Router();

//food list seeding
router.get("/seed", asyncHandler(
    async (req, res) => {
        const foodscount = await FoodModel.countDocuments();
        if (foodscount > 0) {
            res.send("Foods already seeded");
            return;
        }
        await FoodModel.create(sample_foods);
        res.status(200).send("Foods seeded");

    }
))

//get all food
router.get("/", asyncHandler(
    async (req, res) => {
        const foods = await FoodModel.find();
        res.send(foods);
    }
))
//search food by name  
router.get("/search/:searchTerm",asyncHandler(
  async  (req,res)=>{
        const searchregex = new RegExp(req.params.searchTerm, 'i');
         const foods = await FoodModel.find({name:searchregex});
         res.send(foods);
     }
))

//get all tags
router.get("/tags",asyncHandler(
 async (req,res)=>{
    const tags = await FoodModel.aggregate([
        {$unwind:"$tags"},
        {$group:{_id:"$tags",count:{$sum:1}}},  
        {$project:{_id:0,name:"$_id",count:"$count"}},


    ]).sort({count:-1});

    const all ={
        name:"All",
        count : await FoodModel.countDocuments()
    }
    tags.unshift(all);
    res.send(tags);
})
    

)
//search by tag name
router.get("/tag/:tagName",asyncHandler(
    async (req,res)=>{
        const foods = await FoodModel.find({tags:req.params.tagName});
        res.send(foods);
    }
))

//get food id
router.get("/:foodId",asyncHandler(
   async (req,res)=>{
     const food = await FoodModel.findById(req.params.foodId);
        res.send(food);
 }
))


export default router;


