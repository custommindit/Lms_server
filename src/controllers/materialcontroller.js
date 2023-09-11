const {unit_exists,add_time}=require('./misc')
const Material=require('../models/material')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({Success:false,message:"Unit doesn't exist"})
        }
        const material=new Material({
            name:body.name,
            description:body.description,
            link:req.file.path,
            time:body.time,
            unit:body.unit,
            level:unite.level
        })
        material.save().then(async(response)=>{
            
            if(response){
                await add_time(body.unit,response.time)
                return res.json({Success:true,message:`Material ( ${response.name} ) Created`,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}