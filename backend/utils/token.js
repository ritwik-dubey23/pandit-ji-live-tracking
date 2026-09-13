/// creating the jwt



// user id keliyee   


import jwt from "jsonwebtoken"






const genToken = async(userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" })
        return token;
    } catch (error) {
        console.log("Error in # token.js fiile  in generating token ", error)
    }
}


export default genToken;