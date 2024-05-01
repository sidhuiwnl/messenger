import { z } from "zod"
import { dbConnect } from "@/lib/dbConnect"
import { usernameValidation } from "@/schema/signUpSchema"
import UserModel from "@/model/User"


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request:Request){

    
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
         username: searchParams.get('username')
        }
       const isValidUsername =  UsernameQuerySchema.safeParse(queryParam)
       console.log(isValidUsername)
       if(!isValidUsername.success){
        const usernameError = isValidUsername.error.format().username?._errors || []
        return Response.json({
            success : false,
            message :"Invalid query parameter"
        },{status : 400})
       }

       const {username} = isValidUsername.data
       const existingUsername = await UserModel.findOne({
        username,
        isVerified : true
       })

       if(existingUsername){
        return Response.json({
            success : false,
            message : "Username is aldready taken"
        },{status : 400})
       }

       return Response.json({
        success : true,
        message : "Username is uniques"
       },{status : 200})
    } catch (error) {
        console.log("Error checking username",error)
        return Response.json({
            success : false,
            message : "Error checking username"
        },{status : 500})
    }
}