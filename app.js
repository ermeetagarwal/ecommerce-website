import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
// Importing all routes
import homeRouter from "./routes/home.js";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import Cart from "./routes/cart.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import options from "./config/swagger.js";
// const allowedOrigins = ["http://0.0.0.0:5500"];

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Check if the requesting origin is allowed
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(swaggerSpec
  ))

app.use("/api/home", homeRouter);
app.use("/api/product", productRouter);
app.use("/user",userRouter);
app.use("/cart",Cart)
connectDB();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started at port ",port);
});
