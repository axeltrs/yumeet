const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { usersService } = require("../services");
const usersValidation = require('../validations/users.validation');
const usersMiddleware = require('../middlewares/users.middlewares');

const getUser = catchAsync(async (req, res) => {
  const user = await usersService.getUser(req.body.email, req.body.password);

  if (user)
    res.status(httpStatus.CREATED).send({ message: "Success", data: user });
  else
    res.status(httpStatus.NOT_FOUND).send({ message: "Error" });
});

const createUser = catchAsync(async (req, res) => {
  const user = await usersService.createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.company, req.body.phone);

  if (user)
    res.status(httpStatus.CREATED).send({ message: "Success", data: user });
  else
    res.status(httpStatus.NOT_FOUND).send({ message: "Error" });
});

const modifyUser = catchAsync(async (req, res) => {
  const user = await usersService.modifyUser(req.reference, req.body.email, req.body.firstName, req.body.lastName, req.body.description, req.body.linkedin, req.body.phone, req.body.photo_name, req.body.ficheFirstName, req.body.ficheLastName, req.body.ficheCompany, req.body.fichePhone, req.body.ficheEmail);

  if (user)
    res.status(httpStatus.CREATED).send({ message: "Success", data: user });
  else
    res.status(httpStatus.NOT_FOUND).send({ message: "Error" });
});

const modifyFiche = catchAsync(async (req, res) => {
  const user = await usersService.modifyFiche(req.reference, req.body.ficheFirstName, req.body.ficheLastName, req.body.ficheCompany, req.body.fichePhone, req.body.ficheEmail);

  if (user)
    res.status(httpStatus.CREATED).send({ message: "Success", data: user });
  else
    res.status(httpStatus.NOT_FOUND).send({ message: "Error" });
});

const getUserInfo = catchAsync(async (req, res) => {
  const user = await usersService.getUserInfo(req.query.reference);

  if (user)
    res.status(httpStatus.CREATED).send({ message: "Success", data: user });
  else
    res.status(httpStatus.NOT_FOUND).send({ message: "Error" });
});

module.exports = {
  getUser,
  createUser,
  modifyUser,
  getUserInfo,
  modifyFiche
};
