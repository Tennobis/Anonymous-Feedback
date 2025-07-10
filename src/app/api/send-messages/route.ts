import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(req:Request){
    await dbConnect()
    const { username, content } = await req.json()
    if(!content){
         return Response.json(
            {
                success: false,
                message: 'content is required',
            },
            { status: 400 }
        );
    }

    try {
        const user = await UserModel.findOne({username})
        if(!user){
             return Response.json(
            {
                success: false,
                message: 'User with this username not found',
            },
            { status: 404 }
        );
        }
        if(!user.isAcceptingMessage){
             return Response.json(
            {
                success: false,
                message: 'User is not accepting the messages',
            },
            { status: 403 }
        );
        }

        const newMessage = { content , createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
         return Response.json(
            {
                success: true,
                message: 'Message sent successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error Sending new Message",error)
         return Response.json(
            {
                success: false,
                message: 'Error while sending message',
            },
            { status: 500 }
        );
    }
}



