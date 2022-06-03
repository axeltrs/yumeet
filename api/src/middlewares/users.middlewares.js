const Users = require("../models/users.model");
const jwt = require('jsonwebtoken');
const httpStatus = require("http-status");
const multer = require('multer');

const auth = (schema) => (req, res, next) => {
    const token = req.header('jwt');
    if (!token)
        return res.status(httpStatus.BAD_REQUEST).send({ message: "You need to login first" });

    try {
        req.reference = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "Bad JWT token" });
    };
    return next()
};

const checkRank = async (userID, expectedRank) => {
    const user = await Users.findOne({ _id: userID, rank: expectedRank })

    if (user != null)
        return true
    else
        return false
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadImg = multer({storage: storage}).single('photo');

module.exports = {
    auth,
    checkRank,
    uploadImg
};