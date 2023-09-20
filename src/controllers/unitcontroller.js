const { response } = require('express')
const Unit=require('../models/unit')
const {get_parts,buycount,delete_parts}=require('./misc')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const new_unit=new Unit({
            name:body.name,
            price:body.price,
            level:body.level,
            totaltime:0,
            image:req.file.path,
            elementcount:0
        })
        new_unit.save().then(response=>{
            if(response){
                return res.json({message:`Unit ( ${response.name} ) Created`,
                Success:true,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:true,message:"SOME ERROR OCCURED"})
    }
}
module.exports.my_level=async(req,res)=>{
    try {
        const level=req.body.decoded.level
        Unit.find({level:level}).then(response=>{
            if(response){
                return res.json({
                    Success:true,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.get_info=async(req,res)=>{
    try {
        const id=req.params.id
        
        const [quizes,sections,material]=await get_parts(id)
        const U=await Unit.findById(id)
            if(response){
                return res.json({
                    Success:true,
                    quizes:quizes,
                    sections:sections,
                    material:material,
                    unit:U
            })
            }
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.get_all=async(req,res)=>{
    try {
        Unit.find().then(response=>{
            return res.json({
                Success:true,
                data:response
        })
        })        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.get_level=async(req,res)=>{
    try {
        const level=req.params.level
        Unit.find({level:level}).then(response=>{
            return res.json({
                Success:true,
                data:response
        })
        })        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.update=async(req,res)=>{
    try {
        let body=req.body
        Unit.findByIdAndUpdate(body._id,{
            name:body.name,
            price:body.price,
            level:body.level,
        },{new:true}).then(response=>{
            if(response){
                return res.json({message:`Unit ( ${response.name} ) edited`,
                Success:true,
                data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:true,message:"SOME ERROR OCCURED"})
    }
}
module.exports.delete=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:true,message:"SOME ERROR OCCURED"})
    }
}
module.exports.get_std_number=async(req,res)=>{
    try {
        const id=req.params.id
        
        const count=await buycount(id)
            if(count){
                return res.json({
                    Success:true,
                    count:count
            })
            }
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.all_units_data=async(req,res)=>{
    try {
        const [quizes,sections,material]=await get_parts(id)
        const U=await Unit.findById(id)
            if(response){
                return res.json({
                    Success:true,
                    quizes:quizes,
                    sections:sections,
                    material:material,
                    unit:U
            })
            }
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}