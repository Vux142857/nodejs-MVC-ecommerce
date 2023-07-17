const mongoose = require("mongoose");

const generateDescription = function ({ customer, total, status, products }) {
  const customerInfo = `Customer: ${customer.email} | Address: ${customer.address} | Phone: ${customer.phone}`;
  const productInfo = products
    .map((product) => `- Product: ${product.name} && Price: ${product.price}`)
    .join(", ");

  return `${customerInfo} | Total: ${total} | Status: ${status} | Products: ${productInfo}`;
};

const orderSchema = mongoose.Schema(
  {
    orderID: String,
    customer: {
      user_id: String,
      address: String,
      email: String,
      phone: String,
    },
    products: [Object],
    description: {
      type: String,
      default: function () {
        return generateDescription(this);
      },
    },
    status: { type: String, default: "active" },
    shipFee: String,
    total: Number,
    coupon: [Object],
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
