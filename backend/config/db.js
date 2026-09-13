// database setup mongose ki help seeee

import mongoose from "mongoose";
import dns from "dns"
if (process.env.DNS_SERVER) { dns.setServers([process.env.DNS_SERVER]); } else { dns.setServers(['8.8.8.8']); }
console.log("DNS servers set to:", dns.getServers());



const connectDb = async() => {
    try {
        // mongodb ki url le aye hham from  env fileee
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(" ##n the dattabbase is connect with help of mongoosoe from the  $$ FOLDER  ==    ####db.js file")
    } catch (error) {
        console.log(" error occur in db in  $$ FOLDER  == config    #####db.js file", error.message)
    }
}






export default connectDb;