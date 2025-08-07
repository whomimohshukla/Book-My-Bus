const express = require("express");
const routes = express.Router();

// import the contact controller from controller

const contact=require("../../controllers/Contact.Controller/contact.controller")

// console.log(createContact)
// mount the route

routes.post("/contactMessage", contact.createContact);

module.exports = routes;
