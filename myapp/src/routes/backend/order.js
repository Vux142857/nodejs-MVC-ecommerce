const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.order;
const mainService = currentModel.orderService; // Service

// Utility
const utilStatusFilter = require("../../utils/utilCreateOrderStatus");
const utilGetParam = require("../../utils/utilParam");
// const validateItems = require("../../validates/items");
// ---------------------------------------------------------------GET

// Get form edit or add
router.get("/form(/:id)?", async (req, res, next) => {
  const currentId = utilGetParam.getParam(req.params, "id", "");
  const title = currentId ? "Edit item" : "Add item";
  const item = currentId ? await mainService.getOne({ _id: currentId }) : {};
  const errorsNotify = [];
  res.render(`backend/pages/${currentModel.save}`, {
    title,
    item,
    currentId,
    errorsNotify,
    collection: currentModel.name,
  });
});

// Filter, show and find Items, Pagination
router.get("(/list)?(/:status)?", async (req, res, next) => {
  const currentStatus = req.params.status || "all";
  // Find
  const keyword = utilGetParam.getParam(req.query, "search", "");
  const condition = currentStatus === "all" ? {} : { status: currentStatus };
  if (keyword) {
    condition.name = new RegExp(keyword, "ig");
  } else {
    delete condition.name;
  }

  // Pagination
  const pagination = {
    currentPage: parseInt(utilGetParam.getParam(req.query, "page", 1)),
    itemsPerPage: 4,
  };

  const [statusFilter, items] = await Promise.all([
    utilStatusFilter.createFilterStatus(currentStatus, mainService),
    mainService
      .getAll(condition)
      .skip((pagination.currentPage - 1) * pagination.itemsPerPage)
      .limit(pagination.itemsPerPage),
  ]);

  // Render
  res.render(`backend/pages/${currentModel.index}`, {
    title: "List items",
    items,
    statusFilter,
    currentStatus,
    keyword,
    itemsPerPage: pagination.itemsPerPage,
    currentPage: pagination.currentPage,
    collection: currentModel.name,
  });
});

// Change status single
router.get("/change-status/:id/:status", async (req, res, next) => {
  const { id, status } = req.params;
  const newStatus = status;
  const [item, recount] = await Promise.all([
    mainService.updateOneById(id, { status: newStatus }),
    utilStatusFilter.createFilterStatus(status, mainService),
  ]);
  res.send({ newStatus, recount });
});

// Delete single
router.delete("/delete/:id/:status", async (req, res, next) => {
  const { id, status } = req.params;
  await mainService.delete(id);
  const recount = await utilStatusFilter.createFilterStatus(
    status,
    mainService
  );
  res.send({ recount });
});

// ---------------------------------------------------------------POST

// Change status multi
router.post("/change-status/:status", async (req, res, next) => {
  const currentStatus = utilGetParam.getParam(req.params, "status", "active");
  await mainService.updateMany(
    { _id: { $in: req.body.cid } },
    { status: currentStatus }
  );
  res.redirect(`/admin/${currentModel.index}`);
});

// Delete multi
router.post("/delete", async (req, res, next) => {
  await mainService.deleteMany({ _id: { $in: req.body.cid } });
  res.redirect(`/admin/${currentModel.index}`);
});

// Create and Update items
// router.post("/save", async (req, res, next) => {
//   const data = req.body;
//   await mainService.updateOneById(data.id, {
//     orderID: data.orderID,
//     customer: {
//       user_id: data.user_id,
//       address: data.address,
//       email: data.email,
//       phone: data.phone,
//     },
//     total: data.total,
//     status: data.status,
//     shipFee: data.shipFee,
//   });
//   req.flash("successMessage", "Item updated successfully");
//   res.redirect(`/admin/${currentModel.index}`);
// });

module.exports = router;
