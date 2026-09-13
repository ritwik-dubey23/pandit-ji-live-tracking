    //    import jwt from "jsonwebtoken";
    //    const isAuth = async(req, res, next) => {
    //        try {

    //            const token = req.cookies.token;
    //            if (!token) {
    //                return res.status(400).json({ message: "Token Not Found , User not Exists ...." });

    //            }
    //            const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
    //            if (!decodeToken) {
    //                return res.status(400).json({ message: "Token Not  Verified  , User not Exists ...." })
    //            }

    //            console.log(decodeToken);

    //            req.userId = decodeToken.userId;

    //            // userid token wali  id nikal jyegi and   req se userId me chali jyegii  

    //            // then ham controller se match  kr lenge 
    //            next();


    //        } catch (error) {
    //            console.log("AUTH ERROR:", error);
    //            return res.status(500).json({ message: "isAuth Error , User not Exists ...." })





    //        }
    //    }

    //    export default isAuth;







    import jwt from "jsonwebtoken";

    const isAuth = async(req, res, next) => {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ message: "Token Not Found, Please Login" });
            }

            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodeToken)
            req.userId = decodeToken.userId;
            next();

        } catch (error) {
            console.log("AUTH ERROR:", error.message);
            // expired ya invalid token -> 401, server crash nahi
            return res.status(401).json({ message: "Invalid or Expired Token, Please Login Again" });
        }
    };

    export default isAuth;