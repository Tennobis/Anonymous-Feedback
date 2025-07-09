import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(req:Request){
    try {
        await dbConnect()
        const {username , password} = await req.json()
        if(!username && !password){
            return Response.json(
                {
                    success:false,
                    message:"Both username and password are required in sign in "
                },
                { status:400 }
            )
        }
       const user = await UserModel.findOne({
            username,
        })
        if(!user){
             return Response.json(
                  {
                    success:false,
                    message:"user with this username  not found!"
                },
                { status:404 }
            )
        }
           if(!user.isVerified){
             return Response.json(
                  {
                    success:false,
                    message:"user with this username  not verified yet!"
                },
                { status:403 }
            )
        }
        
         const isPasswordSame =await bcrypt.compare(password,user.password)
        if(!isPasswordSame){
            return Response.json(
                  {
                    success:false,
                    message:"password is incorrect "
                },
                { status:400 }
            )
        }

         return Response.json(
                  {
                    success:true,
                    message:"user logged in successfully"
                },
                { status:200 }
            )
    } catch (error) {
        console.log("Error while loggin in ",error)
        return Response.json(
            {
                success:false,
                message:"Error while logging in the app !"
            },
            {status:500}
        )
    }
}