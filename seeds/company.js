const mongoose = require("mongoose");
const express = require("express");
const Company = require("../models/Company");
const companies = [
  {
    name: "company of Joao",
    email: "a@a.com",
    password: "1234567",
    taxNumber: "123457",
  },
  {
    name: "company of Joaquim",
    email: "a@a.com",
    password: "1234567",
    taxNumber: "123458",
  },
  {
    name: "company of Lourenco",
    email: "a@a.com",
    password: "1234567",
    taxNumber: "123459",
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

Company.create(companies)
  .then((company) => {
    console.log(`Created ${company} Model`);

    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while creating books from the DB: ${err}`)
  );
