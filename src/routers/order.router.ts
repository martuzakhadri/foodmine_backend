import { Router } from "express";
import AsyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderStatus } from "../constants/order_status";
import auth from "../middlewares/auth.mid";
import { OrderMOdel } from "../models/order.model";

const router = Router();
router.use(auth);
router.post(
  "/create",
  AsyncHandler(async (req: any, res: any) => {
    const requestOrder = req.body;
    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Order must have at least one item");
      return;
    }
    //delete the previeous order for same user and [continue in next comment]
    await OrderMOdel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });
    // order new items  again here
    const newOrder = new OrderMOdel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

export default router;