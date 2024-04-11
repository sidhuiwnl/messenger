import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?:number
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Aldready  connected to database")
        return
    }

    try {
       const db = await mongoose.connect(process.env.DATABASE_URL!)
       connection.isConnected = db.connections[0].readyState
    } catch (error) {
        console.log("Databse connection failed",error)
        process.exit(1)
    }
}