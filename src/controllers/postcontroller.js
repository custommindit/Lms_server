const Post=require('../models/post')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        
        const new_post=new Post({
            user_name:body.decoded.name,
            user_email:body.decoded.email,
            text:body.text,
            level:body.decoded.level,
            image:req.file.path||"",
            comments:[]
        })
        new_post.save().then(async(response)=>{
            
            if(response){
                return res.json({Success:true,message:`post ( ${response.user_name} ) Created`,
                    data:response
            })
            }
            else
            return res.json({Success:false,message:"Creation Failed"})
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.comment=async(req,res)=>{
    try {
        let body=req.body
        
        const new_comment={
            user_name:body.decoded.name,
            user_email:body.decoded.email,
            text:body.text,
            time:Date.now
        }
        Post.findByIdAndUpdate(req.params.id,{$push:{comments:new_comment}},{new:true}).then(async(response)=>{
            
            if(response){
                return res.json({Success:true,message:`comment ( ${new_comment.user_name} ) Created`,
                    data:new_comment
            })
            }
            else
            return res.json({Success:false,message:"Creation Failed"})
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.all=async(req,res)=>{
    try {
        Post.find().then(async(response)=>{
                return res.json({Success:true,
                    response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.by_level=async(req,res)=>{
    try {
        Post.find({level:req.params.level}).then(async(response)=>{
                return res.json({Success:true,
                    response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}