const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,

  forgotPassword,

  resetPassword,
  getUserDetails,
  updatePassword,
  getAllUsers,
  getSingleUserDetails,

} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUserDetails);

router.route("/password/forgot").post(forgotPassword);



router.route("/logout").get(logoutUser);

module.exports = router;
