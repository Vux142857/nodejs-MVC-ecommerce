const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.user;
const mainService = currentModel.userService; // Service

// Utility
const utilStatusFilter = require("../../utils/utilCreateStatus");
const utilGetParam = require("../../utils/utilParam");
const validateItems = require("../../validates/items");
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

  // Filter
  const statusFilter = await utilStatusFilter.createFilterStatus(
    currentStatus,
    mainService
  );

  // Pagination
  const pagination = {
    currentPage: parseInt(utilGetParam.getParam(req.query, "page", 1)),
    itemsPerPage: 4,
  };

  const items = await mainService
    .getAll(condition)
    .skip((pagination.currentPage - 1) * pagination.itemsPerPage)
    .limit(pagination.itemsPerPage);
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
  const newStatus = status === "active" ? "inactive" : "active";
  await mainService.updateOneById(id, { status: newStatus });
  const recount = await utilStatusFilter.createFilterStatus(
    status,
    mainService
  );
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

// Change role single
router.get("/change-role/:id/:role", async (req, res, next) => {
  const { id, role } = req.params;
  const newRole = role === "on" ? "off" : "on";
  await mainService.updateOneById(id, { isAdmin: newRole });
  res.send({ newRole });
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

// Change status multi
router.post("/change-ordering", async (req, res, next) => {
  const cids = req.body.cid;
  const orderings = req.body.ordering;

  if (Array.isArray(cids)) {
    cids.forEach(async (item, index) => {
      await mainService.updateOneById(
        { _id: item },
        { ordering: parseInt(orderings[index]) }
      );
    });
  } else {
    await mainService.updateOneById(
      { _id: cids },
      { ordering: parseInt(orderings) }
    );
  }
  res.redirect(`/admin/${currentModel.index}`);
});

// Change ordering single
router.post("/change-ordering/:id", async (req, res, next) => {
  const { id } = req.params;
  const ordering = req.body.ordering;
  await mainService.updateOneById(id, { ordering: parseInt(ordering) });
  res.send({ data: ordering });
});

// Create and Update items
router.post(
  "/save",
  validateItems.validateItemsQueries,
  async (req, res, next) => {
    const errorsMsg = validateItems.validateItemsErros(req);
    const errorsNotify = Object.assign(errorsMsg.errors);
    const item = req.body;
    if (!errorsMsg.isEmpty()) {
      console.log(errorsNotify);
      res.render(`backend/pages/${currentModel.save}`, {
        title: "Invalid input",
        item,
        currentId: utilGetParam.getParam(req.params, "id", ""),
        errorsNotify,
      });
    } else {
      if (item.id != "" && typeof item.id != "undefined") {
        await mainService.updateOneById(item.id, {
          item,
        });
        req.flash("successMessage", "Item updated successfully");
      } else {
        await mainService.create(item);
        req.flash("successMessage", "Item created successfully");
      }
      res.redirect(`/admin/${currentModel.index}`);
    }
  }
);

module.exports = router;
