const express = require("express");
const router = express.Router();

const submitListingRouter = require("./SubmitListing");
const userRoutes = require("./userRoutes");
const messageRoutes = require("./messageRoutes");
const chatRoutes = require("./chatRoutes");

router.use("/submitlisting", submitListingRouter);
router.use("/", userRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/message", messageRoutes);

module.exports = router;
