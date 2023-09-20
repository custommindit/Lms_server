const Adminpost=require('../models/adminposts')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        if(!req.body.decoded.admin){
            return res.json({Success:false,message:"Creation Failed"})
        }
        else{
        const new_post=new Adminpost({
            text:body.text,
            link:body.link||""
        })
        new_post.save().then((response)=>{
            
            if(response){
                return res.json({Success:true,message:`post ( ${response.text} ) Created`,
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
        Adminpost.find().then(async(response)=>{
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
            Adminpost.deleteOne({_id:req.params.id}).then(e=>{
                return res.json({Success:true,message:`Deleted`,
            })
            })

        }
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

