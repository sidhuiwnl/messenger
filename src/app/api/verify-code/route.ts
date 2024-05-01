import { z } from "zod"
import { dbConnect } from "@/lib/dbConnect"

import UserModel from "@/model/User"


export async function POST(request : Request){
    await dbConnect()
    try {
        const {username,code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success : false,
                message : "Username does not exist"
            },{status:404})
        }

        const isValidCode = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isValidCode && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success : true,
                message :"Account verified successfully"
            },{status:200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success : false,
                message :"Code has been expired please signup for getting new code"
            },{status:405})

        }else{
            return Response.json({
                success : false,
                message :"The code entered is wrong please check thoroughly"
            },{status:405})

        }
    } catch (error) {
        console.log("Error checking code",error)
        return Response.json({
            success : false,
            message : "Error checking code"
        },{status : 500})
    }
}