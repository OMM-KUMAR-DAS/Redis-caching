const mongoose= require('mongoose')

const blogSchema= new mongoose.Schema({

 
    title:{
                type:String,
                required:true,
    },

    Content:{
                type:String,
                required:true,
    },

    timestamp: {

                type: Date,
                default: Date.now
    },

   userid:{

    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    
   }


   

})

module.exports=mongoose.model("blog",blogSchema)