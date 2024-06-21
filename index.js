const express= require('express')

const mongoose= require('mongoose')

const bodyParser = require('body-parser')

const Redis = require('redis');

const client = Redis.createClient();

const app= new express()

app.use(bodyParser.json())





const User=require("./models/user")

const Blog= require("./models/blog")




//middleware to check wheather data is available in redis datastore or not

async function cached(req,res,next)
{
    const { userid } = req.query;

    try{

        const ans= await client.get(`userId:${userid}`)

        const newans= JSON.parse(ans)

        console.log(ans)

        if(ans===null)
            {
                return next();
            }

        console.log("Fetched from redis datastore")

        res.json({
            success:true,
            message:newans
        })

    }catch(err)
    {
         console.log(
            "Error in getting data from redis "
         )

         res.json({
            success:false,
            error:err
         })
         
        
    }
   
    
    
}


//route for user creation

app.post('/usercreation',async(req,res)=>{
    try{

        const{username,email}= req.body

        const newuser= await User.create({username,email})

        res.json({
            success:true,
            message:newuser
        })  

    }catch(err)

    {
        res.json({
            success:false,
            message:err
        }) 
    }
})

//route for creating blog

app.post('/createblog',async(req,res)=>{

    try{
      
        const{title,Content,userid}= req.body

        const newblog= await Blog.create({title,Content,userid})



        res.json({
            success:true,
            message:newblog
        })

    }catch(err)
    {
       res.json({
        success:false,
        message:err
       })
    }
})

//route  for retriving  blog of each user


app.get('/allblogs',cached, async (req, res) => {
    try {
        const { userid } = req.query; 
       
        const blogs = await Blog.find({ userid}).select('-userid');

        const formatresult= JSON.stringify(blogs)
        
        try{

            await client.setEx(`userId:${userid}`,120,formatresult)
            console.log("Successfully stored in Redis datastore")

        }catch(err)
        
        {
              console.log("Error in storing data",err)
        }


        res.json({
            success: true,
            Userid:userid,
            message: blogs
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
});

app.put('/updateblog',async(req,res)=>{

    try{

        const{userId,Title,content,blogid} =req.body

        const newtime= Date.now()

        const updated_data= await Blog.updateOne({userid:userId,_id:blogid},{title:Title,Content:content,timestamp:newtime})

        
       

        if(updated_data.modifiedCount===1)
            
            {
                try{


                    const newdata= await Blog.find({userid:userId})

                    const formatresult= JSON.stringify(newdata)

                    await client.setEx(`userId:${userId}`,120,formatresult)

                    console.log("Successfully stored updated data in Redis datastore")

                    res.json({
                        success:true,
                        message:updated_data,
                        updatedblog:newdata
                    })

                }catch(err)
                {
                        res.json({
                            success:false,
                            error:err
                        })
                }
            }



       

    }catch(err)
    {
       res.json({
        success:false,
        error:err
       })
      
    }
})



mongoose.connect("mongodb+srv://ommdas310:J6w3mHGfVSl8zr1p@cluster0.orf3t12.mongodb.net/REDIS?retryWrites=true&w=majority")
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });





app.listen(3000,()=>{
    try{

        console.log(`Successfully connected to port ${3000}`)

    }catch(err)
    {
            console.log("Error occured::",err)
    }
})

async function startredis()
{

    try{

        await client.connect();
        console.log("Successfully connected to Redis")

    }catch(err)
    {
         console.log("Failed to connect to Redis")
    }
}

startredis()