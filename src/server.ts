import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import foodsRouter from './routers/food.router';
import usersRouter from './routers/user.router';
import ordersRouter from './routers/order.router';

import { dbconnect } from './configs/database.config';


dbconnect();

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
    
}));

app.use('/api/foods',foodsRouter);
app.use('/api/users',usersRouter);
app.use('/api/orders',ordersRouter);


const port =5000;
app.listen(port, ()=>{
    console.log("serving on port  http://localhost:" + port);
})





