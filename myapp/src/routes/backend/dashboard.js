const express = require("express");
const router = express.Router();
// const socket = require("../../../app/socketio");
// Model Control
const containService = require("../../services/containService");
const articleModel = containService.modelControl.article;
const productModel = containService.modelControl.product;
const orderModel = containService.modelControl.order;
const couponModel = containService.modelControl.coupon;
const articleService = articleModel.articleService; // Service
const productService = productModel.productService;
const orderService = orderModel.orderService;
const couponService = couponModel.couponService;

router.get("/", async (req, res, next) => {
  try {
    const [articleCount, productCount, orderList, orderLatest, couponList] =
      await Promise.all([
        articleService.count({ status: "active" }),
        productService.count({ status: "active" }),
        orderService.getAll({}),
        orderService.getAll({}).sort({ createdAt: -1 }).limit(10),
        couponService.getAll({}),
      ]);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const ordersToday = orderList.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today;
    });

    const incomeToday = calcIncome(ordersToday);

    const orderDone = orderList.filter((order) => {
      return order.status === "done";
    });

    const totalOrder = orderList.length;

    const incomeTotal = calcIncome(orderDone);

    couponList.forEach((coupon) => {
      updateCouponStatus(coupon);
    });

    // updateStock(orderDone);
    const article = {
      count: articleCount,
      index: articleModel.index,
    };
    const product = {
      count: productCount,
      index: productModel.index,
    };

    res.render("backend/pages/dashboard/index", {
      title: "Dashboard",
      article,
      product,
      orderLatest,
      incomeToday,
      incomeTotal,
      totalOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

calcIncome = (orderList) => {
  let total = 0;
  orderList.forEach((element) => {
    total += element.total;
  });
  return total;
};

updateCouponStatus = async (coupon) => {
  const now = new Date(); // Get the current date and time

  // Convert expired_at date to a Date object for comparison
  const expiredDate = new Date(coupon.expired_at);

  if (now > expiredDate) {
    // Coupon has expired, update the status to 'expired'
    try {
      await couponService.updateOneById(
        { _id: coupon._id },
        { $set: { status: "inactive" } }
      );
      console.log("Coupon status updated to 'expired'");
    } catch (error) {
      console.log("Error updating coupon status:", error);
    }
  } else {
    console.log("Coupon is still active.");
  }
};

updateStock = async (ordersDone) => {
  ordersDone.forEach((order) => {
    order.products.forEach((product) => {
      product.sizes.forEach((size) => {
        updateSizeAmount(product._id, size.id, size.amount);
      });
    });
  });
};

async function updateSizeAmount(productId, sizeId, newAmount) {
  try {
    // Find the product by its _id
    const product = await productService.getOne(productId);

    if (!product) {
      console.log("Product not found");
      return;
    }

    // Find the index of the size with the given sizeId in the size array
    const sizeIndex = product.size.findIndex(
      (size) => size.id.toString() === sizeId
    );

    if (sizeIndex === -1) {
      console.log("Size not found in the product");
      return;
    }

    product.size[sizeIndex].amount = product.size[sizeIndex].amount - newAmount;

    await product.save();
    console.log("Size amount updated successfully");
  } catch (error) {
    console.log("Error updating size amount:", error);
  }
}

module.exports = router;
