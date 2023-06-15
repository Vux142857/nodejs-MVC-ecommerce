const express = require("express");
const router = express.Router();

// Model Control
const mainService = require("../../services/mainService");
const currentService = mainService.modelControl.item.itemService;
const currentModel = mainService.modelControl.item;

// Utility
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
    item = await currentService.getOne({ _id: currentId });
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
    let currentStatus = req.params.status || "all";
    let keyword = utilGetParam.getParam(req.query, "search", "");

    const condition = currentStatus === "all" ? {} : { status: currentStatus };

    if (keyword !== "") {
      const nameRegex = new RegExp(keyword, "ig");
      condition.name = nameRegex;
    } else {
      Reflect.deleteProperty(condition, "name");
    }

    const statusFilter = await utilStatusFilter.createFilterStatus(
      currentStatus
    );

    const pagination = {
      currentPage: parseInt(utilGetParam.getParam(req.query, "page", 1)),
      itemsPerPage: 4,
    };

    const items = await currentService
      .getAll(condition)
      .skip((pagination.currentPage - 1) * pagination.itemsPerPage)
      .limit(pagination.itemsPerPage);

    res.render(`backend/pages/${currentModel.index}`, {
      title: "List items",
      items,
      statusFilter,
      currentStatus,
      keyword,
      itemsPerPage: pagination.itemsPerPage,
      currentPage: pagination.currentPage,
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
    await currentService.updateOneById(id, { status: newStatus });
    const recount = await utilStatusFilter.createFilterStatus(status);
    res.send({ newStatus, recount });
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Delete single
router.delete("/delete/:id/:status", async (req, res, next) => {
  try {
    let currentStatus = req.params.status || "all";
    let currentId = utilGetParam.getParam(req.params, "id", "");
    await currentService.delete(currentId);
    let recount = await utilStatusFilter.createFilterStatus(currentStatus);
    res.send({ recount });
  } catch (error) {
    console.log("Error: ", error);
  }
});

// ---------------------------------------------------------------POST

// Change status multi
router.post("/change-status/:status", async (req, res, next) => {
  try {
    let currentStatus = utilGetParam.getParam(req.params, "status", "active");
    await currentService.updateMany(
      { _id: { $in: req.body.cid } },
      { status: currentStatus }
    );
    res.redirect(`/admin/${currentModel.index}`);
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Delete multi
router.post("/delete", async (req, res, next) => {
  try {
    await currentService.deleteMany({ _id: { $in: req.body.cid } });
    res.redirect(`/admin/${currentModel.index}`);
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
        currentService.updateOneById(
          { _id: item },
          { ordering: parseInt(orderings[index]) }
        );
      });
    } else {
      await currentService.updateOneById(
        { _id: cids },
        { ordering: parseInt(orderings) }
      );
    }
    res.redirect(`/admin/${currentModel.index}`);
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Change ordering single
router.post("/change-ordering/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let ordering = req.body.ordering;
    await currentService.updateOneById(id, { ordering: parseInt(ordering) });
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
    item.slug = item.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    if (!errorsMsg.isEmpty()) {
      console.log(errorsNotify);
      res.render("backend/pages/items/form", {
        title: "Add Item",
        item,
        currentId: utilGetParam.getParam(req.params, "id", ""),
        errorsNotify,
      });
    } else {
      await currentService.create(item);
      res.redirect(`/admin/${currentModel.index}`);
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
    // const { id, name, ordering, status, slug, imgURL } = req.body;
    let item = req.body;
    slug = item.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    if (!errorsMsg.isEmpty()) {
      console.log(errorsNotify);
      res.render("backend/pages/items/form", {
        title: "Edit Item",
        item,
        currentId: utilGetParam.getParam(req.params, "id", ""),
        errorsNotify,
      });
    } else {
      await currentService.updateOneById(id, {
        name: item.name,
        ordering: parseInt(item.ordering),
        status: item.status,
        slug: item.slug,
        imgURL: item.imgURL
      });
      res.redirect(`/admin/${currentModel.index}`);
    }
  }
);

module.exports = router;
