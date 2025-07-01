import { Message } from "@/model/User"


export interface ApiResponse{
    success:boolean
    message:string
    isAccepting?:boolean
    messages?:Array<Message> 
}