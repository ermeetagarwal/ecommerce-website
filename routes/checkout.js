const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const billingdetails = require("../models/checkout.js");
const authenticateToken = require("../middleware/index.js");
const nodemailer = require("nodemailer");
const request = require("request");
const crypto = require("crypto");
const generateOrderNumber = () => {
    const prefix = "ORD";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const orderNo = `${prefix}-${timestamp}-${random}`;
    return orderNo;
};

router.get("/billingdetailsforadmin", async (req, res) => {
    try {
        const allBillingDetails = await billingdetails.find();
        res.json(allBillingDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/billingdetails", authenticateToken, async (req, res) => {
    try {
        const user = req.user;

        // Find billing details for the specific user
        const userBillingDetails = await billingdetails.find({
            "cart.user": user._id,
        });
        res.json(userBillingDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/billingdetails", authenticateToken, async (req, res) => {
    const orderNo = generateOrderNumber();
    const date = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    try {
        const user = req.user;
        const userCart = await Cart.findOne({ user: user._id.toString() });

        // Create a new billing detail object
        const newBillingDetail = new billingdetails({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            CompanyName: req.body.CompanyName,
            StreetAddress: req.body.StreetAddress,
            city: req.body.city,
            state: req.body.state,
            PinCode: req.body.PinCode,
            Phone: req.body.Phone,
            Email: req.body.Email,
            OrderNote: req.body.OrderNote,
            PaymentMethod: req.body.PaymentMethod,
            cart: userCart.toObject(), // Save the user's cart directly
            orderNo,
            date,
        });

        // Send payment request to PayU
        const data = {
            key: process.env.PAYU_MERCHANT_KEY,
            txnid: `${orderNo}`,
            amount: Math.round(userCart.total), // Use total from cartSchema
            productinfo: userCart.items, // Convert items array to JSON string
            firstname: req.body.FirstName,
            email: req.body.Email,
            phone: req.body.Phone,
            surl: process.env.PAYU_SUCCESS_URL,
            furl: process.env.PAYU_FAILURE_URL,
            // service_provider: 'payu_paisa',
        };
        const cryp = crypto.createHash("sha512");
        // const string = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.phone}||||||${data.salt}`;
        const string = (hashString =
            data.key +
            "|" +
            data.txnid +
            "|" +
            data.amount +
            "|" +
            data.productinfo +
            "|" +
            data.firstname +
            "|" +
            data.email +
            "|" +
            "||||||||||" +
            process.env.PAYU_SALT);

        cryp.update(string);
        const hash = cryp.digest("hex");

        data.hash = hash;

        console.log(data);
        console.log(string);

        // Clear the user's cart
        userCart.items = [];
        userCart.total = 0;
        userCart.discountFromCode = 0;
        await userCart.markModified("items");
        await userCart.save();

        // Save the new billing detail
        const savedBillingDetail = await newBillingDetail.save();

        return res.status(200).send({
            data: data,
        });

        // request.post({ url: process.env.PAYU_PAYMENT_URL, form: formData }, (error, response, body) => {
        //     if (error) {
        //         console.error('Error:', error);
        //         return res.status(500).json({ message: 'Failed to process payment' });
        //     }
        //     // Redirect user to PayU payment page
        //     res.redirect(response.headers.location);
        // });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post("/paymentresponse", async (req, res) => {
    const status = req.body.status; // Payment status from the payment gateway
    const orderNo = req.body.txnid; // Transaction ID or order number from the payment gateway

    try {
        // Find the order in your database using the order number
        const order = await billingdetails.findOne({ orderNo: req.body.txnid });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update the order status based on the payment status
        if (status === "success") {
            order.paymentStatus = "paid";
        } else {
            order.paymentStatus = "failed";
        }

        // Save the updated order status
        await order.save();

        // Send an email to the customer based on the payment status
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log(order);
        console.log(order.cart[0].items);

        // Send a thank you email to the customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject:
                status === "success"
                    ? "Thank you for your order!"
                    : "Order processing failed",
            html:
                status === "success"
                    ? `
              <h1>Thank you for your order!</h1>
              <p>Order Number: ${orderNo}</p>
              <p>Order Date: ${order.date}</p>
              <p>Name: ${order.FirstName} ${order.LastName}</p>
              <p>Address: ${order.StreetAddress}, ${order.city}, ${
                          order.state
                      }, ${order.PinCode}</p>
              <p>Email: ${order.Email}</p>
              <p>Payment Method: ${order.PaymentMethod}</p>
              <h2>Products:</h2>
              <ul>
                  ${order.cart[0].items
                      .map(
                          (item) => `
                      <li>${item.quantity} x ${item.product} - ${item.subtotal}</li>
                  `
                      )
                      .join("")}
              </ul>
              <p>Total: ${Math.round(order.cart[0].total)}</p>
          `
                    : `
              <h1>Order processing failed</h1>
              <p>Your payment for order (${orderNo}) has failed. Please try again.</p>
              <p>Status: ${
                  status === "success" ? "Payment successful" : "Payment failed"
              }</p>
          `,
        };

        transporter.sendMail(customerMailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Customer email sent: " + info.response);
            }
        });

        // Send an email to the owner
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL, // Email of the owner
            subject: "New order received!",
            html: `
              <h1>New order received!</h1>
              <p>Order Number: ${orderNo}</p>
              <p>Order Date: ${order.date}</p>
              <p>Name: ${order.FirstName} ${order.LastName}</p>
              <p>Address: ${order.StreetAddress}, ${order.city}, ${
                order.state
            }, ${order.PinCode}</p>
              <p>Email: ${order.Email}</p>
              <p>Payment Method: ${order.PaymentMethod}</p>
              <h2>Products:</h2>
              <ul>
                  ${order.cart[0].items
                      .map(
                          (item) => `
                      <li>${item.quantity} x ${item.product} - ${item.subtotal}</li>
                  `
                      )
                      .join("")}
              </ul>
              <p>Total: ${Math.round(order.cart[0].total)}</p>
              <p>Status: ${
                  status === "success" ? "Payment successful" : "Payment failed"
              }</p>
          `,
        };

        transporter.sendMail(ownerMailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Owner email sent: " + info.response);
            }
        });

        res.status(200).json({ message: "Payment status updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
