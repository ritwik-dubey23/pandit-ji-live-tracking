import jwt from "jsonwebtoken";

const gentoken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "PANDIT_JI_SECRET_KEY", {
        expiresIn: "15d"
    });
};

export default gentoken;
