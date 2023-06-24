const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.article;
const subModel = containService.modelControl.category;
const mainService = currentModel.articleService; // Service
const subService = subModel.categoryService;

// Utility
const utilStatusFilter = require("../../utils/utilCreateStatus");
const utilGetParam = require("../../utils/utilParam");
const validateItems = require("../../validates/article");

// ---------------------------------------------------------------GET

// Get form edit or add
router.get("/form(/:id)?", async (req, res, next) => {
  const currentId = utilGetParam.getParam(req.params, "id", "");
  const title = currentId
    ? `Edit ${currentModel.name}`
    : `Add ${currentModel.name}`;
  const category = await subService.getAll();
  const item = currentId ? await mainService.getOne({ _id: currentId }) : {};
  const errorsNotify = [];
  res.render(`backend/pages/${currentModel.save}`, {
    title,
    item,
    currentId,
    errorsNotify,
    collection: currentModel.name,
    category,
  });
});

// router.get("/:id", async (req, res, next) => {
//   const category = await subService.getAll();

//   let category_id = req.params.id;
//   let items = await mainService.findOne({ "category.id": category_id });
//   // res.send(items)
// });

// Filter, show and find Items, Pagination
router.get("(/:id)?(/list)?(/:status)?", async (req, res, next) => {
  const currentStatus = req.params.status || "all";
  const category = await subService.getAll();

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

  let category_id = req.params.id;
  let items = (category_id)
    ? await mainService
        .findOne({ "category.id": category_id })
    : await mainService
        .getAll(condition)
        .skip((pagination.currentPage - 1) * pagination.itemsPerPage)
        .limit(pagination.itemsPerPage);

  // Render
  res.render(`backend/pages/${currentModel.index}`, {
    title: `List ${currentModel.name}`,
    items,
    statusFilter,
    currentStatus,
    keyword,
    itemsPerPage: pagination.itemsPerPage,
    currentPage: pagination.currentPage,
    collection: currentModel.name,
    category,
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
        title: `Edit ${currentModel.name}`,
        item,
        currentId: utilGetParam.getParam(req.params, "id", ""),
        errorsNotify,
      });
    } else {
      let data = [];
      if (Array.isArray(item.categories)) {
        item.categories.forEach((id) => {
          let ids = { id };
          data.push(ids);
        });
      } else {
        let id = item.categories;
        data.push({ id });
      }
      console.log(data);

      const articleData = {
        name: item.name,
        ordering: parseInt(item.ordering),
        status: item.status,
        category: data,
      };

      console.log(articleData);

      if (item.id && typeof item.id !== "undefined") {
        await mainService.updateOneById(item.id, articleData);
        req.flash("successMessage", "Item updated successfully");
      } else {
        await mainService.create(articleData);
        req.flash("successMessage", "Item created successfully");
      }
      res.redirect(`/admin/${currentModel.index}`);
    }
  }
);

// router.post(
//   "/save",
//   validateItems.validateItemsQueries,
//   async (req, res, next) => {
//     const item = req.body;
//     let data = await mainService.create(item);
//     res.send({data});
//   }
// );

module.exports = router;

// const express = require("express");
// const router = express.Router();

// // Model Control
// const containService = require("../../services/containService");
// const currentModel = containService.modelControl.category;
// const articleService = currentModel.articleService; // Service

// router.get("/(/:limit)?(/:next)?", async (req, res, next) => {
//   try {
//     let limit = parseInt(req.query.limit);
//     let next = parseInt(req.query.next);
//     let data= await articleService.getAll().limit(limit).skip(next);
//     res.send(data);
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// });

// router.post("/add", async (req, res, next) => {
//   try {
//     let item = req.body;
//     let data = await articleService.create(item);
//     res.send(data);
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// });
// module.exports = router;
