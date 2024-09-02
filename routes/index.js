const { Router: expressRouter } = require("express");
const router = expressRouter();
const authRouter = require("./auth/authRoutes");
const documentRouter = require("./document/documentRoutes");
const templateRouter = require("./template/templateRoutes");
const userRouter = require("./user/userRoutes");

// auth routes
router.use("/auth", authRouter);

// document routes
router.use("/documents", documentRouter);

// template routes
router.use("/templates", templateRouter);

// user routes
router.use("/users", userRouter);

module.exports = router;
