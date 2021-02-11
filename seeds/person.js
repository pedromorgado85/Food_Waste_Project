const mongoose = require("mongoose");
const express = require("express");
const Person = require("../models/Users/Person");
const people = [
  {
    name: "Joao",
    email: "a@a.com",
    password: "1234567",
  },
  {
    name: "Joaquim",
    email: "a@a.com",
    password: "1234567",
  },
  {
    name: "Lourenco",
    email: "a@a.com",
    password: "1234567",
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

Person.create(people)
  .then((person) => {
    console.log(`Created ${person} Model`);

    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while creating books from the DB: ${err}`)
  );
