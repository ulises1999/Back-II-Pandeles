import productsService from "../services/products.services.js";
import {Types} from "mongoose";

const createOne= async (req,res)=>{
    const data= req.body
    const response= await productsService.createOne(data);
    res.json201(response)
}

const readAll = async (req, res) => {
  const filter = req.query;
  const response = await productsService.readAll(filter);
  if (response.length === 0) {
    res.json404()
  }
  res.json200(response)
};

const readById=async(req,res)=> {
    const {id}=req.params
    const response = await productsService.readById(id);
    if(!response) return res.json404()
    res.json200(response)
}

const updateById=async(req,res)=>{
    const {id}= req.params
    const data= req.body
    const response = await productsService.updateById(id, data);
    if(!response) return res.json404()
    res.json200(response)
}
const destroyById=async(req,res)=>{
    const {id}=req.params
    const response = await productsService.destroyById(id);
    if(!response) return res.json404()
    res.json200(response)
}
const pidParam = (req, res, next, pid) => {
  try {
    const isObjectId = Types.ObjectId.isValid(pid);
    if (isObjectId) return next();
    const error = new Error("Invalid ID");
    error.statusCode = 400;
    throw error;
  } catch (error) {
    next(error);
  }
};
export {createOne,readById,readAll,updateById,destroyById,pidParam};