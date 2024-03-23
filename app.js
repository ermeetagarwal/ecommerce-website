// CommonJS modules
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const carousel = require("./routes/carousel.js");
const productRouter = require("./routes/product.js");
const userRouter = require("./routes/user.js");
const Cart = require("./routes/cart.js");
const dropaline = require("./routes/dal.js");
const discountcode = require("./routes/discountcode.js");
const checkout = require('./routes/checkout.js');
const category = require('./routes/category.js')
const forgetpassword = require('./routes/forgetpassword.js');
const payselect = require("./routes/enablepay.js");
const bodyParser = require('body-parser');
// const allowedOrigins = ["http://0.0.0.0:5500"];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Enable CORS for all routes
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

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

app.use("/api/discountcode",discountcode);
app.use("/api/carousel",carousel );
app.use("/api/product", productRouter);
app.use("/user",userRouter);
app.use("/cart",Cart)
app.use("/api/dal",dropaline);
app.use("/checkout",checkout);
app.use("/api/category",category);
app.use("/api/forgetpassword",forgetpassword);
app.use("/api",payselect)
connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started at port ",port);
});
