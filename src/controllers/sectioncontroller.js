const {unit_exists}=require('./misc')
const Section=require('../models/section')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({message:"Unit doesn't exist"})
        }
        const new_section=new Section({
            name:body.name,
            description:body.description,
            time:body.time,
            video:body.video,
            unit:body.unit,
            level:unite.level
        })
        new_section.save().then(response=>{
            if(response){
                return res.json({message:`Section ( ${response.name} ) Created`,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({message:"SOME ERROR OCCURED"})
    }
}