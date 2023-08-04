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
const validateItems = require("../../../validates/product");
const utilUpload = require("../../../utils/utilUploadMulti");
const uploadFileMiddleware = utilUpload.upload("images", "product");

// ---------------------------------------------------------------GET

// Get form edit or add ${currentModel.save}
router.get("/form(/:id)?", async (req, res, next) => {
  const currentId = utilGetParam.getParam(req.params, "id", "");
  const title = currentId
    ? `Edit ${currentModel.name}`
    : `Add ${currentModel.name}`;

  const [category, size, color, item] = await Promise.all([
    categoryService.getAll({ special: "off" }),
    sizeService.getAll(),
    colorService.getAll(),
    currentId ? mainService.getOne({ _id: currentId }) : {},
  ]);

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
          $or: [{ category: category_id }, { status: currentStatus }],
        }
      : condition;

  // Pagination
  const pagination = {
    currentPage: parseInt(utilGetParam.getParam(req.query, "page", 1)),
    itemsPerPage: 4,
  };

  const [category, statusFilter, items] = await Promise.all([
    categoryService.getAll({ special: "off" }),
    utilStatusFilter.createFilterStatus(currentStatus, mainService), // Filter status
    mainService
      .getAll(condition)
      .skip((pagination.currentPage - 1) * pagination.itemsPerPage)
      .limit(pagination.itemsPerPage),
  ]);

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
  const [item, recount] = await Promise.all([
    mainService.updateOneById(id, { status: newStatus }),
    utilStatusFilter.createFilterStatus(status, mainService),
  ]);
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
  validateItems.validateItemsQueries,
  async (req, res, next) => {
    try {
      const errorsMsg = validateItems.validateItemsErros(req);
      const errorsNotify = Object.assign(errorsMsg.errors);
      const item = req.body;
      let size = [];
      item.images_old =
        item.images_old !== "" && typeof item.images_old !== "undefined"
          ? item.images_old.split(",")
          : [];
      console.log("Checked: " + req.files);
      let taskCurrent =
        typeof item !== "undefined" && item.id !== "" ? "Edit" : "Add";
      if (!errorsMsg.isEmpty()) {
        console.log(errorsNotify);
        if (typeof req.files != "undefined")
          req.files.forEach((element) => {
            utilUpload.remove(currentModel.folderUpload, element.filename);
          });
        res.render(`backend/pages/${currentModel.save}`, {
          title: `${taskCurrent} ${currentModel.name}`,
          item,
          currentId: utilGetParam.getParam(req.params, "id", ""),
          errorsNotify,
        });
      } else {
        // Upload and Edit image
        if (typeof req.files === "undefined" || req.files.length === 0) {
          // No files were uploaded
          if (Array.isArray(item.images)) {
            // Remove any existing images that were previously uploaded
            item.images.forEach((imageName) => {
              utilUpload.remove(currentModel.folderUpload, imageName);
            });
          }
          item.images = item.images_old || ["no-img.jpg"];
        } else {
          // New files were uploaded
          item.images = req.files.map((file) => file.filename);
          if (Array.isArray(item.images_old)) {
            // Remove any existing images that were previously uploaded and not replaced
            item.images_old.forEach((imageName) => {
              if (!item.images.includes(imageName)) {
                utilUpload.remove(currentModel.folderUpload, imageName);
              }
            });
          } else {
            // Single existing image was replaced with multiple new images
            if (!item.images.includes(item.images_old)) {
              utilUpload.remove(currentModel.folderUpload, item.images_old);
            }
          }
        }
        // Create size object
        console.log(item.size_name);

        if (Array.isArray(item.size_id)) {
          item.size_id.forEach((element, index) => {
            let sizeObj = {
              id: element,
              name: item.size_name[index],
              amount: parseInt(item.amount[index]),
            };
            size.push(sizeObj);
          });
        } else {
          let sizeObj = {
            id: item.size_id,
            name: item.size_name,
            amount: parseInt(item.amount),
          };
          size.push(sizeObj);
        }
        console.log(item.size_id);

        const data = {
          name: item.name,
          category: item.category,
          color: item.color,
          description: item.description,
          status: item.status,
          size,
          img: item.images,
          special: item.special,
          category: item.category,
          price: item.price,
        };
        if (item.id && typeof item.id !== "undefined") {
          await mainService.updateOneById(item.id, data);
          req.flash("successMessage", "Item updated successfully");
        } else {
          await mainService.create(data);
          req.flash("successMessage", "Item created successfully");
        }
        res.redirect(`/admin/${currentModel.index}`);
      }
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
