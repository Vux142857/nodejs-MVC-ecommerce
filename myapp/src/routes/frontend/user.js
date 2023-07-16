const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Model Control
const containService = require("../../services/containService");
const currentModel = containService.modelControl.user;
const mainService = currentModel.userService; // Service
const authToken = require("../../middleware/verifyToken");

// // Utility
// const utilGetParam = require("../../utils/utilParam");
// const validateItems = require("../../validates/article");
// const utilUpload = require("../../utils/utilUpload.js");


module.exports = router;
