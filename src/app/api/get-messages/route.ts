import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(req:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if(!session || !session.user){
         return Response.json(
            {
                success: false,
                message: 'Not Authenticated',
            },
            { status: 401 }
        );
    }

    const userById = new mongoose.Types.ObjectId(user._id) 
    try {
        const user = await UserModel.aggregate([
            { $match: {_id: userById } },
            { $unwind:'$messages'},
            { $sort: {'messages.createdAt':-1} },
            { $group: {_id:'$_id', messages: { $push:'$messages'} } } 
        ])

        if(!user || user.length===0){
             return Response.json(
            {
                success: false,
                message: 'User cannot be found',
            },
            { status: 404 }
        );
        }
         return Response.json(
            {
                success: true,
                message: user[0].messages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json(
            {
                success: false,
                message: 'Error in getting message acceptance status',
            },
            { status: 500 }
        );
    }
}