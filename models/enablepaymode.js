const mongoose = require("mongoose");

const enablepaySchema = mongoose.Schema({
  cod: { type: Boolean, default: false },
  online: { type: Boolean, default: false }
});

const EnablePayMode = mongoose.model("EnablePayMode", enablepaySchema);

module.exports = EnablePayMode;
