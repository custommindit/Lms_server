const {unit_exists,add_time}=require('./misc')
const Section=require('../models/section')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({Success:false,message:"Unit doesn't exist"})
        }
        const new_section=new Section({
            name:body.name,
            description:body.description,
            time:body.time,
            video:body.video,
            unit:body.unit,
            level:unite.level
        })
        new_section.save().then(async(response)=>{
            
            if(response){
                await add_time(body.unit,response.time)
                return res.json({Success:true,message:`Section ( ${response.name} ) Created`,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.getone=async(req,res)=>{
    try {
        let id=req.params.id
        Section.findById(id).then(response=>{
            return res.json({Success:true,data:response})
        })
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}