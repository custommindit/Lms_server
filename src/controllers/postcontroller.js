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
                return res.json({Success:true,message:`post ( ${response.name} ) Created`,
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