import mongoose from "mongoose"

const connectDatabase = async() => {
    try {
        const connectdb = await mongoose.connect(process.env.MONGODB_URL);
        if(connectdb) {
            console.log("Mongodb Connected successfully !")
        }else {
            console.log("Error occured while establising the database connection")
        }

    }catch(err) {
        console.log("Something went wrong while connecting the database ..", err)
        
    }
}

export default connectDatabase;