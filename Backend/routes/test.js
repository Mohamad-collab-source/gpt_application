import express from "express";
const app = express();
import models from "../models/Thread.js";
const { Thread, Message } = models;
import getOpenRouterResponse from "../utils/openRouter.js";


const router = express.Router();


// get route 
router.get("/thread",async(req,res)=>{
    try{
        const data = await Thread.find({}).sort({updatedAt:-1});
        res.json({data});
    }catch(err){
        console.log('error in getting all threads',err);
    }
})

// to get specific thread 
router.get("/thread/:threadId",async(req,res)=>{
try{
    const {threadId} = req.params;
    if(!threadId){
        res.status(404).json({error:"id is missing"});
    }
    const data =await Thread.findOne({threadId});
    res.json(data);
}catch(err){
        console.log('error in getting single thread',err);
        res.json({message:"server error"}).status(500);
    }
})

// to delete specific thread 
router.delete("/thread/:threadId",async(req,res)=>{
try{
    const {threadId} = req.params;
    if(!threadId){
        res.status(404).json({error:"id is missing"});
    }
    const data =await Thread.findOneAndDelete({threadId}); 
    console.log('thread deleted!');
    res.json({data});
}catch(err){
        console.log('error in getting single thread',err);
        res.json({message:"server error"}).status(500);
    }
})

// user and assistant message route 
router.post('/chat',async(req,res)=>{
    const {threadId,message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error:"missing required fieds!"});
    }
    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
            //create a new threadd
            thread = new Thread({
                threadId:threadId,
                title:message,
                messages:[{role:"user",content:message}]
            });
        }else{
            thread.messages.push({role:"user",content:message});
        }
        const assistantReply =await getOpenRouterResponse(message);
        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt = new Date();
         await thread.save();
         res.json({
    message: "data saved successfully!",
    reply: assistantReply
});
    }
    catch(err){
        console.log(err);
        res.json({error:"error in getting response"});
    }
});

export default router;