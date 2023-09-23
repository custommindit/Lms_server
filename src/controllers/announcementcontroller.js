const Announcement=require('../models/announcements')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        if(!body.decoded.admin){
            return res.json({Success:false,message:"Creation Failed"})
        }
        else{
        const exists=Announcement.findOne({level:body.level})
        if (exists!==null){
            return res.json(
                {Success:false,message:"Level already has an announcement"}
            )
        }
        const new_post=new Announcement({
            name: body.name,
             day:body.day,
             startAt:body.startAt,
             endAt:body.endAt,
             level:body.level
        })
        new_post.save().then((response)=>{
            
            if(response){
                return res.json({Success:true,message:`announcement ( ${response.name} ) Created`,
                    data:response
            })
            }
            else
            return res.json({Success:false,message:"Creation Failed"})
        })}
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.all=async(req,res)=>{
    try {
        Announcement.find().then(async(response)=>{
                return res.json({Success:true,
                    response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.deleteone=async(req,res)=>{
    try {
        if(!req.body.decoded.admin){
            return res.json({Success:false,message:"deletion Failed"})
        }
        else{
            Announcement.deleteOne({_id:req.params.id}).then(e=>{
                return res.json({Success:true,message:`Deleted`,
            })
            })

        }
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.bylevel=async(req,res)=>{
    try {
        Announcement.find({level:req.params.level}).then(async(response)=>{
                return res.json({Success:true,
                    response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
