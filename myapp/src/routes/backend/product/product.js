const express = require("express");
const router = express.Router();

// Model Control
const containService = require("../../../services/containService");
const currentModel = containService.modelControl.product;
const sizeModel = containService.modelControl.size;
const colorModel = containService.modelControl.color;
const categoryModel = containService.modelControl.category;

const mainService = currentModel.productService; // Service
const sizeService = sizeModel.sizeService;
const colorService = colorModel.colorService;
const categoryService = categoryModel.categoryService;

// Utility
const utilStatusFilter = require("../../../utils/utilCreateStatus");
const utilGetParam = require("../../../utils/utilParam");
const validateItems = require("../../../validates/article");
const utilUpload = require("../../../utils/utilUploadMulti");
const uploadFileMiddleware = utilUpload.upload("imgs", "product");

// ---------------------------------------------------------------GET

// Get form edit or add ${currentModel.save}
router.get("/form(/:id)?", async (req, res, next) => {
  const currentId = utilGetParam.getParam(req.params, "id", "");
  const title = currentId
    ? `Edit ${currentModel.name}`
    : `Add ${currentModel.name}`;
  const category = await categoryService.getAll();
  const size = await sizeService.getAll();
  const color = await colorService.getAll();

  const item = currentId ? await mainService.getOne({ _id: currentId }) : {};
  const errorsNotify = [];
  res.render(`backend/pages/product/form`, {
    title,
    item,
    currentId,
    errorsNotify,
    collection: currentModel.name,
    category,
    size,
    color,
  });
});

// Filter, show and find Items, Pagination
router.get("(/list)?(/:status)?", async (req, res, next) => {
  const currentStatus = utilGetParam.getParam(req.params, "status", "all");
  const category = await categoryService.getAll();
  const category_id = utilGetParam.getParam(req.session, "category_id", "");
  // Find
  const keyword = utilGetParam.getParam(req.query, "search", "");
  let condition = currentStatus === "all" ? {} : { status: currentStatus };
  if (keyword) {
    condition.name = new RegExp(keyword, "ig");
  } else {
    delete condition.name;
  }

  condition =
    category_id !== ""
      ? {
          $or: [
            { category: { $elemMatch: { $eq: category_id } } },
            { status: currentStatus },
          ],
        }
      : condition;

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

  let items = await mainService
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
    category_id,
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

// Change special single
router.get("/change-special/:id/:special", async (req, res, next) => {
  const { id, special } = req.params;
  const newSpecial = special === "on" ? "off" : "on";
  await mainService.updateOneById(id, { special: newSpecial });
  res.send({ newSpecial });
});

// Delete single
router.delete("/delete/:id/:status", async (req, res, next) => {
  const { id, status } = req.params;
  let item = await mainService.getOne(id);
  utilUpload.remove(currentModel.folderUpload, item.thumb);
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

// Change special multi
router.post("/change-special/:special", async (req, res, next) => {
  const currentSpecial = utilGetParam.getParam(req.params, "special", "on");
  await mainService.updateMany(
    { _id: { $in: req.body.cid } },
    { special: currentSpecial }
  );
  res.redirect(`/admin/${currentModel.index}`);
});

// Delete multi
router.post("/delete", async (req, res, next) => {
  const cids = req.body.cid;
  if (Array.isArray(cids)) {
    cids.forEach(async (element, index) => {
      let item = await mainService.getOne({ _id: element });
      if (item && item.thumb) {
        utilUpload.remove(currentModel.folderUpload, item.thumb);
      }
    });
  } else {
    let item = await mainService.getOne({ _id: element });
    if (item && item.thumb) {
      utilUpload.remove(currentModel.folderUpload, item.thumb);
    }
  }
  await mainService.deleteMany({ _id: { $in: cids } });
  res.redirect(`/admin/${currentModel.index}`);
});

// Change ordering multi
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
  uploadFileMiddleware,
  // validateItems.validateItemsQueries,
  async (req, res, next) => {
    try {
      const item = req.body;
      let size = [];
      console.log(req.files);
      console.log(item.imgs);

      // Upload and Edit image

      
      if (Array.isArray(item.sizes)) {
        item.sizes.forEach((element, index) => {
          let sizeObj = {
            name: element,
            amount: parseInt(item.amount[index]),
          };
          size.push(sizeObj);
        });
      } else {
        let sizeObj = {
          name: item.sizes,
          amount: parseInt(item.amount),
        };
        size.push(sizeObj);
      }

      const data = {
        name: item.name,
        category: item.category,
        color: item.color,
        price: parseInt(item.price),
        desciption: item.desciption,
        status: item.status,
        size,
        img: item.image,
      };
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  }
);

// Filter category
router.get("/filter-category(/:category_id)?", (req, res, next) => {
  req.session.category_id = utilGetParam.getParam(
    req.params,
    "category_id",
    ""
  );
  res.redirect(`/admin/${currentModel.index}`);
});

module.exports = router;
