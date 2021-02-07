const mongoose = require("mongoose");
const express = require("express");
const Institution = require("../models/Institution");
const institutions = [
  {
    name: "institution of Joao",
    email: "a@a.com",
    password: "1234567",
    taxNumber: "123456",
  },
  {
    name: "institution of Joaquim",
    email: "a@a.com",
    password: "1234567",
    taxNumber: "123456",
  },
  {
    name: "institution of Lourenco",
    email: "a@a.com",
    password: "1234567",
    taxNumber: "123456",
  },
];

mongoose
  .connect("mongodb://localhost/food-waste-project", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

Institution.create(institutions)
  .then((institution) => {
    console.log(`Created ${institution} Model`);

    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while creating books from the DB: ${err}`)
  );
