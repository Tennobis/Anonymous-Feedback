import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req:Request){
    await dbConnect();

   try {
     const {username, code} = await req.json();
     const decodedUsername = decodeURIComponent(username)

     const user = await UserModel.findOne({username:decodedUsername})

     if(!user){
        return Response.json(
            {
                success: false,
                message: "Username does not exists"
            },
            { status: 400 })
     }

     const isCodeValid = user.verifyCode === code 
     const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
     
     if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()
         return Response.json(
            {
                success: true,
                message: "Account Verified successfully "
            },
            { status: 200 })
     } else if(!isCodeNotExpired){
          return Response.json(
            {
                success: false,
                message: "Verification code is expired please sign-up again to get a new verify code"
            },
            { status: 400 })
     } else {
         return Response.json(
            {
                success: false,
                message: "Verification code is incorrect"
            },
            { status: 400 })
     }
 
   } catch (error) {
     console.log("Error checking username:", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status: 500 })
   }

}