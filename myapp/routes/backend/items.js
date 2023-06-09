const express = require("express");
const router = express.Router();
const itemService = require("../../services/itemService");
const utilStatusFilter = require("../../utils/utilCreateStatus");
const utilGetParam = require("../../utils/utilParam");
const validateItems = require("../../validates/items");

// ---------------------------------------------------------------GET 
// Get form edit or add
router.get("/form(/:id)?", async (req, res, next) => {
  let currentId = utilGetParam.getParam(req.params, "id", '');
  let title = '';
  let item = {};
  let errorsNotify = [];
  if (currentId != '') {
    title = "Edit item";
    item = await itemService.getOne({ _id: currentId });
  } else {
    title = "Add item"
  }
  res.render("backend/pages/items/form", {
    title,
    item,
    errorsNotify,
    currentId
  });
});

// Filter, show and find Items
router.get("(/list)?(/:status)?", async (req, res, next) => {
  try {
    let currentStatus = req.params.status;
    let condition = (currentStatus == "all" || currentStatus == undefined) ? {} : { status: currentStatus };
    let keyword = utilGetParam.getParam(req.query, "search", '');
    if (keyword != '') {
      const nameRegex = new RegExp(keyword, 'i');
      condition.name = nameRegex;
    } else {
      Reflect.deleteProperty(condition, 'name');
    }

    const statusFilter = await utilStatusFilter.createFilterStatus(currentStatus);
    const items = await itemService.getAll(condition);

    res.render("backend/pages/items/list", {
      title: "List items",
      items,
      statusFilter,
      currentStatus,
      keyword
    });
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Change status single
router.get("/change-status/:id/:status", async (req, res, next) => {
  try {
    let currentStatus = utilGetParam.getParam(req.params, "status", 'all');
    let currentId = utilGetParam.getParam(req.params, "id", '');
    let status = (currentStatus == 'active') ? 'inactive' : 'active';
    await itemService.updateOneById({ _id: currentId }, { status: status });
    res.redirect('/admin/items/list');
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Delete single
router.get("/delete/:id", async (req, res, next) => {
  try {
    let currentId = utilGetParam.getParam(req.params, "id", '');
    await itemService.delete(currentId);
    res.redirect('/admin/items/list');
  } catch (error) {
    console.log("Error: ", error);
  }
});

// ---------------------------------------------------------------POST 

// Change status multi
router.post("/change-status/:status", async (req, res, next) => {
  try {
    let currentStatus = utilGetParam.getParam(req.params, "status", 'active');
    await itemService.updateMany({ _id: { $in: req.body.cid } }, { status: currentStatus });
    res.redirect('/admin/items/list');
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Delete multi
router.post("/delete", async (req, res, next) => {
  try {
    await itemService.deleteMany({ _id: { $in: req.body.cid } });
    res.redirect('/admin/items/list');
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
        itemService.updateOneById({ _id: item }, { ordering: parseInt(orderings[index]) });
      })
    } else {
      await itemService.updateOneById({ _id: cids }, { ordering: parseInt(orderings) });
    }

    res.redirect('/admin/items/list');
  } catch (error) {
    console.log("Error: ", error);
  }
});

// Save new items
router.post("/save", validateItems.validateItemsQueries, async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  console.log(req.body);

  const errorsMsg = validateItems.validateItemsErros(req);
  let errorsNotify = Object.assign(errorsMsg.errors);

  let item = Object.assign(req.body);
  console.log(item);

  // if (item.id !== '') {
  //   if (!errorsMsg.isEmpty()) {
  //     res.render("backend/pages/items/form", {
  //       title: "Edit Item",
  //       item,
  //       errorsNotify
  //     });
  //   } else {
  //     await itemService.updateOneById({ _id: item.id }, {
  //       name: item.name,
  //       status: item.status,
  //       ordering: parseInt(item.ordering)
  //     });
  //     res.redirect('/admin/items/list');
  //   }
  // } else {
  //   if (!errorsMsg.isEmpty()) {
  //     console.log(errorsNotify);
  //     res.render("backend/pages/items/form", {
  //       title: "Add Item",
  //       item,
  //       errorsNotify
  //     });
  //   } else {
  //     await itemService.create(item);
  //     res.redirect('/admin/items/list');
  //   }
  // }
  if (!errorsMsg.isEmpty()) {
    console.log(errorsNotify);
    res.render("backend/pages/items/form", {
      title: "Add Item",
      item,
      errorsNotify
    });
  } else {
    await itemService.create(item);
    res.redirect('/admin/items/list');
  }
});

router.post("/edit", validateItems.validateItemsQueries, async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  console.log(req.body);

  const errorsMsg = validateItems.validateItemsErros(req);
  let errorsNotify = Object.assign(errorsMsg.errors);

  let item = Object.assign(req.body);
  console.log(item);

  if (!errorsMsg.isEmpty()) {
    console.log(errorsNotify);
    res.render("backend/pages/items/form", {
      title: "Add Item",
      item,
      errorsNotify
    });
  } else {
    await itemService.updateOneById({ _id: req.params.currentId }, {
      name: item.name,
      status: item.status,
      ordering: parseInt(item.ordering)
    });
    res.redirect('/admin/items/list');
  }
});

module.exports = router;
