const express = require("express");
const router = express.Router();
const itemService = require("../../services/itemService");
const utilStatusFilter = require("../../utils/utilCreateStatus");
const utilGetParam = require("../../utils/utilParam");
const validateItems = require("../../validates/items");

// ---------------------------------------------------------------GET

// Get form edit or add
router.get("/form(/:id)?", async (req, res, next) => {
  let currentId = utilGetParam.getParam(req.params, "id", "");
  let title = "";
  let item = {};
  let errorsNotify = [];
  if (currentId != "") {
    title = "Edit item";
    item = await itemService.getOne({ _id: currentId });
  } else {
    title = "Add item";
  }
  res.render("backend/pages/items/form", {
    title,
    item,
    currentId,
    errorsNotify,
  });
});

// Filter, show and find Items, Pagination
router.get("(/list)?(/:status)?", async (req, res, next) => {
  try {
    let currentStatus = req.params.status;

    // Find items
    let condition =
      currentStatus == "all" || currentStatus == undefined
        ? {}
        : { status: currentStatus };

    let keyword = utilGetParam.getParam(req.query, "search", "");
    if (keyword != "") {
      const nameRegex = new RegExp(keyword, "ig");
      condition.name = nameRegex;
    } else {
      Reflect.deleteProperty(condition, "name");
    }

    // Filter status
    const statusFilter = await utilStatusFilter.createFilterStatus(
      currentStatus
    );

    // Pagination
    const pagination = {
      totalItems: statusFilter[0].count,
      currentPage: parseInt(utilGetParam.getParam(req.query, "page", 1)),
      itemsPerPage: 4,
    };

    await itemService
      .getAll(condition)
      .skip((pagination.currentPage - 1) * pagination.itemsPerPage)
      .limit(pagination.itemsPerPage)
      .then((items) => {
        res.render("backend/pages/items/list", {
          title: "List items",
          items,
          statusFilter,
          currentStatus,
          keyword,
          totalItems: pagination.totalItems,
          itemsPerPage: pagination.itemsPerPage,
          currentPage: pagination.currentPage,
        });
      });
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Change status single
router.get("/change-status/:id/:status", async (req, res, next) => {
  try {
    const { id, status } = req.params;
    let newStatus = status == "active" ? "inactive" : "active";
    await itemService.updateOneById(id, { status: newStatus });
    res.send({ data: newStatus });
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Delete single
router.get("/delete/:id", async (req, res, next) => {
  try {
    let currentId = utilGetParam.getParam(req.params, "id", "");
    await itemService.delete(currentId);
    res.redirect("/admin/items/list");
  } catch (error) {
    console.log("Error: ", error);
  }
});

// ---------------------------------------------------------------POST

// Change status multi
router.post("/change-status/:status", async (req, res, next) => {
  try {
    let currentStatus = utilGetParam.getParam(req.params, "status", "active");
    await itemService.updateMany(
      { _id: { $in: req.body.cid } },
      { status: currentStatus }
    );
    res.redirect("/admin/items/list");
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Delete multi
router.post("/delete", async (req, res, next) => {
  try {
    await itemService.deleteMany({ _id: { $in: req.body.cid } });
    res.redirect("/admin/items/list");
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Change status multi
router.post("/change-ordering", async (req, res, next) => {
  try {
    let cids = req.body.cid;
    let orderings = req.body.ordering;

    if (Array.isArray(cids)) {
      cids.forEach((item, index) => {
        itemService.updateOneById(
          { _id: item },
          { ordering: parseInt(orderings[index]) }
        );
      });
    } else {
      await itemService.updateOneById(
        { _id: cids },
        { ordering: parseInt(orderings) }
      );
    }

    res.redirect("/admin/items/list");
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Change ordering single
router.post("/change-ordering/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let ordering = req.body.ordering;
    await itemService.updateOneById(id, { ordering: parseInt(ordering) });
    res.send({ data: ordering });
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Save new items
router.post(
  "/save",
  validateItems.validateItemsQueries,
  async (req, res, next) => {
    const errorsMsg = validateItems.validateItemsErros(req);
    let errorsNotify = Object.assign(errorsMsg.errors);
    let item = req.body;
    if (!errorsMsg.isEmpty()) {
      console.log(errorsNotify);
      res.render("backend/pages/items/form", {
        title: "Add Item",
        item,
        currentId: utilGetParam.getParam(req.params, "id", ""),
        errorsNotify
      });
    } else {
      await itemService.create(item);
      res.redirect("/admin/items/list");
    }
  }
);

// Update items
router.post(
  "/updated",
  validateItems.validateItemsQueries,
  async (req, res, next) => {
    const errorsMsg = validateItems.validateItemsErros(req);
    let errorsNotify = Object.assign(errorsMsg.errors);
    const { id, name, ordering, status } = req.body;
    let item = { id, name, ordering, status };
    if (!errorsMsg.isEmpty()) {
      console.log(errorsNotify);
      res.render("backend/pages/items/form", {
        title: "Edit Item",
        item,
        currentId: utilGetParam.getParam(req.params, "id", ""),
        errorsNotify
      });
    } else {
      await itemService.updateOneById(id, {
        name: item.name,
        ordering: parseInt(item.ordering),
        status: item.status,
      });
      res.redirect("/admin/items/list");
    }
  }
);

module.exports = router;
