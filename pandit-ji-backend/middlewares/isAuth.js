import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Token Not Found, Please Login" });
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET || "PANDIT_JI_SECRET_KEY");
        req.userId = decodeToken.userId;
        next();
    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        return res.status(401).json({ message: "Invalid or Expired Token, Please Login Again" });
    }
};

export default isAuth;
