import { seek } from '../server/seek.mjs';

export default async function handler(req,res){
  const host=req.headers.host||'localhost';
  const proto=(req.headers['x-forwarded-proto']||'https').split(',')[0];
  const url=new URL(req.url,proto+'://'+host);
  const response=await seek(new Request(url,{method:'GET'}),process.env);
  const body=await response.text();
  response.headers.forEach((value,key)=>res.setHeader(key,value));
  res.status(response.status).send(body);
}
