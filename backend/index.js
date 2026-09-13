import express from "express";
import dotenv from "dotenv";

// iske through ni ham acees kar pa re h .env file koo

dotenv.config();
import userRouter from "./routes/user.routes.js";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();

// for port from.env file
const port = process.env.PORT || 5000;


//using cors ki hamri frontend and backend ki apis ko block 
// block na kre browser kyki dono diff port pe rahe gi nna

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// middleware for all routes
// express.json se sara 
// frontend wla data convert  ho jyega into json form

app.use(express.json());
// ye ni use krnge to req.body se data undefined ayega



// token into cookie ki parsing ke liye / change  karne ke liyee

app.use(cookieParser());

// AUTH KE ROUTES
// common route sari  routes ke liye of authrouter ke liyye
// for authentication apis
app.use("/api/auth", authRouter)





//USER ke routes ke liyee


app.use("/api/user", userRouter)


// SHOP aor ITEMS ke liye routes


app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter)

// Order ke liiyye
app.use("/api/order", orderRouter)

//  

app.listen(port, () => {

    // calling the connect db function
    // ## configg folder  me  db.js fileee kooo
    connectDb();
    console.log(`port is listenig to port ${port}`)
})