const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const faker = require("faker");

const User = require("../models/user");

const generateHash = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateUser = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password
) => {
  const hash = await generateHash(password);
  const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,    
    password: hash
  });
  return await newUser.save();
};

const generateAccessToken = ({ email }) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "14d"
  });
};

const checkAccessToken = (req, res, next) => {
  const { token } = req.headers;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("incorrect token");
    } else {
      req.user = decoded;
      req.token = token;
      next();
    }
  });
};

const createFakeData = numberOfData => {
  let productTypes = ["standard cake", "custom cake"];
  let occasionTypes = [
    "birthday",
    "wedding"
  ];
  let flavourTypes = ["chocolate", "vanilla", "strawberry"];

  let data = [];
  for (i = 0; i < numberOfData; i++) {
    let randomNum = Math.floor(Math.random() * 4);
    let newData = {
      userData: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber()
      },
      quoteData: {
        productType: productTypes[randomNum],
        eventType: occasionTypes[randomNum],
        pickUpDateAndTime: faker.date.future(),
        numberOfGuests: faker.random.number(),
        cakeFlavour: flavourTypes[randomNum],
        cakeFilling: flavourTypes[randomNum],
        otherInfo: faker.lorem.text()
      }
    };
    data.push(newData);
  }
  return data;
};

module.exports = {
  checkPassword,
  generateUser,
  generateAccessToken,
  checkAccessToken,
  createFakeData
};
