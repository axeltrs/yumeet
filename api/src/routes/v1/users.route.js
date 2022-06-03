const express = require("express");
const validate = require('../../middlewares/validate');
const usersController = require("../../controllers/users.controller");
const usersValidation = require('../../validations/users.validation');
const userMiddleware = require('../../middlewares/users.middlewares');

const router = express.Router();

router.post("/login", validate(usersValidation.userCredentials), usersController.getUser);

router.post("/register", validate(usersValidation.userRegisterCredentials), usersController.createUser);

// Need to be logged in to get user information
router.get("/profile", validate(usersValidation.userProfile), usersController.getUserInfo)

// Need to be logged in to modify user
router.put("/profile", validate(usersValidation.userProfile), userMiddleware.uploadImg, userMiddleware.auth(), usersController.modifyUser);

// Need to be logged in to modify user
router.put("/ficheProfile", validate(usersValidation.userProfile), userMiddleware.uploadImg, userMiddleware.auth(), usersController.modifyFiche);


module.exports = router;
