const express = require("express");
const session = require("express-session");
const router = express.Router();
const geo = require("node-geocoder");
const geocoder = geo({ provider: "openstreetmap" });

router.get("/", async (req, res) => {
  const contact = await req.db.getContacts();
  res.json(contact);
});
router.post("/", async (req, res) => {
  console.log(req.body);
  const result = await geocoder.geocode(req.body.address);
    if (result.length > 0) {
      req.body.address = result[0].formattedAddress;
      console.log(
        `The location from geocoder is ${result[0].latitude}/${result[0].longitude}`
      );
    } else {
      return res
        .status(200)
        .send({ success: false, message: "Address not found." });
    }
  req.body.latitude = result[0].latitude == null ? 0 : result[0].latitude;
  req.body.longitude = result[0].longitude == null ? 0 : result[0].longitude;

  const id = await req.db.createContact(req.body);
  res.status(200).send({ success: true, id: id});
});
router.get("/:id", async (req, res) => {
  contact = await req.db.findContact(req.params.id);
  res.json(contact);
});

router.post("/:id", async (req, res) => {
  console.log("updating contact");
  if (!req.session.user) {
    return res
      .status(200)
      .send({
        success: false,
        session: true,
        message: "You must be logged in to edit a contact",
      });
  }

  const result = await geocoder.geocode(req.body.address);

  if (result.length > 0) {
    req.body.address = result[0].formattedAddress;
  } else {
    return res
      .status(200)
      .send({ success: false, address: true, message: "Address not found" });
  }
  console.log("updating contact", req.body);
  const contact = {
    id: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    contact_by_email: req.body.contact_by_email,
    contact_by_phone: req.body.contact_by_phone,
    contact_by_mail: req.body.contact_by_mail,
    latitude: result[0].latitude == undefined ? 0 : result[0].latitude,
    longitude: result[0].longitude == undefined ? 0 : result[0].longitude,
  };
  console.log(contact);
  await req.db.updateContact(contact);
  res.status(200).send({ success: true, message: "Contact updated" });
});

router.delete("/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(200).send({
      success: false,
      message: "You must be logged in to delete a contact",
    });
  }
  await req.db.deleteContact(req.params.id);
  res.status(200).send({ success: true, message: "Contact deleted" });
});

module.exports = router;
