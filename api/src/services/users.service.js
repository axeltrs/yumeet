const { response } = require("express");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Airtable = require("airtable-plus");
const config = require("../config/config");

const getUser = async (email, password) => {
  try {
    var base = new Airtable({
      baseID: 'appQNnagJVGnvkNbF',
      apiKey: config.apiKey.airtable,
      tableName: 'Main',
    });

    // Check if the user exist
    const user = await base.read({
      maxRecords: 1,
      fields: ["email", "password", "reference"],
      filterByFormula: `{email} = "${email}"`
    });

    if (user.length < 1) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    const validPass = await bcrypt.compare(password, user[0].fields.password);
    if (!validPass) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password !");
    const token = jwt.sign({
      _reference: user[0].fields.reference
    }, process.env.JWT_SECRET);

    return {
      email: user[0].fields.email,
      token: token,
      reference: user[0].fields.reference
    }
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e);
  }
};

const createUser = async (email, password, firstName, lastName, company, phone) => {
  const salt = await bcrypt.genSalt(10);
  var reference = Math.random().toString(36).slice(2, 7);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    var base = new Airtable({
      baseID: 'appQNnagJVGnvkNbF',
      apiKey: config.apiKey.airtable,
      tableName: 'Main',
    });

    // Check if the reference exist
    var user = await base.read({
      maxRecords: 1,
      fields: ["reference"],
      filterByFormula: `{reference} = "${reference}"`
    });
    while (user.length > 0) {
      reference = Math.random().toString(36).slice(2, 7);
      user = await base.read({
        maxRecords: 1,
        fields: ["reference"],
        filterByFormula: `{reference} = "${reference}"`
      });
    }

    // Check if an user already exists
    const userExist = await base.read({
      maxRecords: 1,
      fields: ["email"],
      filterByFormula: `{email} = "${email}"`
    });

    // Throw an error if user exists
    if (userExist.length > 0) throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
    else {
      // Create the user
      const user = await base.create({
        email: email,
        password: hashPassword,
        firstName: firstName,
        lastName: lastName,
        linkedin: "",
        phone: phone,
        description: company,
        photo: "",
        reference: reference,
        status: "active"
      });
      return user.createdTime
    }
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exist");
  }
};

const modifyUser = async (reference, email, firstName, LastName, description, linkedin, phone, photo) => {
  try {
    var base = new Airtable({
      baseID: 'appQNnagJVGnvkNbF',
      apiKey: config.apiKey.airtable,
      tableName: 'Main',
    });

    // Check if the user exist
    const user = await base.read({
      maxRecords: 1,
      fields: ["reference"],
      filterByFormula: `{reference} = "${reference._reference}"`
    });
    // Throw an error if user exists
    if (user.length < 1) throw new ApiError(httpStatus.BAD_REQUEST, "User is not authorized");

    // Modify the user
    const userModified = await base.update(user[0].id, {
      email: email,
      firstName: firstName,
      lastName: LastName,
      description: description,
      linkedin: linkedin,
      phone: phone,
      photo: photo && photo.includes("/") ? photo.split('/')[2] : photo
    });
    return userModified.createdTime
  } catch (e) {
    console.log(e)
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't find this user");
  }
};

const modifyFiche = async (reference, ficheFirstName, ficheLastName, ficheCompany, fichePhone, ficheEmail) => {
  try {
    var base = new Airtable({
      baseID: 'appQNnagJVGnvkNbF',
      apiKey: config.apiKey.airtable,
      tableName: 'Main',
    });

    // Check if the user exist
    const user = await base.read({
      maxRecords: 1,
      fields: ["reference"],
      filterByFormula: `{reference} = "${reference._reference}"`
    });
    // Throw an error if user exists
    if (user.length < 1) throw new ApiError(httpStatus.BAD_REQUEST, "User is not authorized");

    // Modify the user
    const userModified = await base.update(user[0].id, {
      ficheFirstName: ficheFirstName,
      ficheLastName: ficheLastName,
      ficheCompany: ficheCompany,
      fichePhone: fichePhone,
      ficheEmail: ficheEmail
    });
    return userModified.createdTime
  } catch (e) {
    console.log(e)
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't find this user");
  }
};

const getUserInfo = async (reference) => {
  try {
    var base = new Airtable({
      baseID: 'appQNnagJVGnvkNbF',
      apiKey: config.apiKey.airtable,
      tableName: 'Main',
    });

    // Check if the user exist
    const user = await base.read({
      fields: ["email", "linkedin", "phone", "description", "photo", "firstName", "lastName", "reference", "ficheFirstName", "ficheLastName", "fichePhone", "ficheEmail", "ficheCompany"],
      filterByFormula: `{reference} = "${reference}"`
    });

    return user[0].fields
  } catch (e) {
    console.log(e)
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't find this users");
  }
};

module.exports = {
  getUser,
  createUser,
  modifyUser,
  getUserInfo,
  modifyFiche
};
