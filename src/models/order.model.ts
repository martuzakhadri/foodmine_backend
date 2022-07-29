import {model,Schema,Types} from 'mongoose';
import { OrderStatus } from '../constants/order_status';
import { Food, FoodSchema } from './food.model';

export interface latLng{
    lat:string;
    lng:string;

}
export const LatLngSchema = new Schema<latLng>(
    {
        lat: {type:String, required:true},
        lng:{type:String,  required:true}
    }

);

export interface OrderItem{
    food:Food;
    price:number;
    quantity:number;
}
export const OrderitemSchema = new Schema<OrderItem>(
    {
       food:{type:FoodSchema ,required:true},
       price:{type:Number,required:true},
       quantity:{type:Number,required:true}
    }

);

export interface  Order{
    id:number;
    name: string;
    price: number;
    items:OrderItem[];
    address:string;
    addressLng:latLng;
    paymentId:string;
    createdAt:string;
    status:OrderStatus;
    user:Types.ObjectId;
    UpdatedAt:Date;
     }
     const orderSchema = new Schema<Order>({
        name:{type:String,required:true},
        address:{type:String,required:true},
        addressLng:{type:LatLngSchema,required:true},
        paymentId:{type:String},
        price:{type:Number,required:true},
        items:{type:[OrderitemSchema],required:true},
        status:{type:String,default:OrderStatus.NEW},
        user:{type:Schema.Types.ObjectId,required:true}
     },{
        timestamps:true,
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        }
     })
  export const OrderMOdel = model('model',orderSchema)