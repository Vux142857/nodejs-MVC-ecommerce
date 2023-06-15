const itemService = require("./itemService");

exports.modelControl = {
  item: { itemService, index: "items/list", createIndex: ""},
};
