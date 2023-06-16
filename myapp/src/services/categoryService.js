const Item = require("../models/category");

exports.getAll = (params) => {
  try {
    return Item.find(params).sort({
      createdAt: -1
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getOne = async (id) => {
  try {
    const item = await Item.findById(id);
    return item;
  } catch (error) {
    console.log(error);
  }
};

exports.create = (params) => {
  try {
    return Item.create(params);
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (id) => {
  try {
    await Item.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
};

exports.count = async (status) => {
  try {
    return await Item.count(status);
  } catch (error) {
    console.log(error);
  }
};

exports.updateOneById = async (id, params) => {
  try {
    return await Item.updateOne({ _id: id }, params);
  } catch (error) {
    console.log(error);
  }
};

exports.updateMany = async (conditions, params) => {
  try {
    return await Item.updateMany(conditions, params);
  } catch (error) {
    console.log(error);
  }
}

exports.deleteMany = async (conditions) => {
  try {
    return await Item.deleteMany(conditions);
  } catch (error) {
    console.log(error);
  }
}