const Unit=require('../models/unit')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const new_unit=new Unit({
            name:body.name,
            price:body.price,
            level:body.level,
            totaltime:0,
            image:body.image,
            elementcount:0
        })
        new_unit.save().then(response=>{
            if(response){
                return res.json({message:`Unit ( ${response.name} ) Created`,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({message:"SOME ERROR OCCURED"})
    }
}
module.exports.my_level=async(req,res)=>{
    try {
        const level=req.body.decoded.level
        Unit.find({level:level}).then(response=>{
            if(response){
                return res.json({
                    message:"Success",
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({message:"SOME ERROR OCCURED"})
    }
}