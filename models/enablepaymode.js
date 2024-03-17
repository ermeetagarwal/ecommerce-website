const mongoose = require("mongoose");

const enablepaySchema =new mongoose.Schema({
  cod: { type: Boolean, default: false },
  online: { type: Boolean, default: false }
});

const EnablePayMode = new mongoose.model("EnablePayMode", enablepaySchema);

module.exports = EnablePayMode;
