 import {verify} from 'jsonwebtoken';
import {HTTP_UNAUTHORIZED } from '../constants/http_status';

export default(req:any,res:any,next:any)=>{
    const token = req.headers.toekn as string;
    if(!token) return res.status(401).send(HTTP_UNAUTHORIZED);
    

    try{
        const decodeuser = verify(token,process.env.JWT_SECRET!);
        req.user = decodeuser;
    }catch(err){
        return res.status(HTTP_UNAUTHORIZED).send();
    }
    return next();
}