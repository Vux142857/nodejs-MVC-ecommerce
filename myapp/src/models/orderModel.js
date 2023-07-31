const mongoose = require("mongoose");

const generateDescription = function ({
  customer,
  total,
  status,
  products,
  coupon,
  shipFee,
}) {
  const customerInfo = `Customer: ${customer.email} | Address: ${customer.address} | Phone: ${customer.phone}`;
  const productInfo = products
    .map((product) => {
      const sizesInfo = product.sizes
        .map((size) => `${size.name}: ${size.amount}`)
        .join(", ");
      return `- Product: ${product.name} && Price: ${product.price} && Sizes: ${sizesInfo}`;
    })
    .join(", ");

  return `${customerInfo} | Total: ${total} | Status: ${status} | Products: ${productInfo} | Ship fee: ${shipFee} | Coupon: ${coupon}`;
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
    status: { type: String, default: "processing" },
    shipFee: Number,
    total: Number,
    coupon: String,
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
