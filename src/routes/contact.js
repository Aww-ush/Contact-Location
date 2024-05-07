const express = require("express");
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

    console.log("here :", result);
    if (result.length > 0) {
      req.body.address = result[0].formattedAddress;
      console.log(
        `The location from geocoder is ${result[0].latitude}/${result[0].longitude}`
      );
    }
  req.body.latitude = result[0].latitude == null ? 0 : result[0].latitude;
  req.body.longitude = result[0].longitude == null ? 0 : result[0].longitude;
  const id = await req.db.createContact(req.body);
  res.status(200).send({ id: id });
});
router.get("/:id", async (req, res) => {
    contact = await req.db.findContact(req.params.id);
    res.json(contact);
});

router.post("/:id", async (req, res) => {
  console.log("updating contact", req.body);

  const result = await geocoder.geocode(req.body.address);
    console.log("updating lat and long here :", result);
    if (result.length > 0) {
      req.body.address = result[0].formattedAddress;
      console.log(
        `The location from geocoder is ${result[0].latitude}/${result[0].longitude}`
      );
    }
    console.log('updating contact', req.body);
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
    res.status(200).send("Contact updated");
});

router.delete("/:id", async (req, res) => {
    
  await req.db.deleteContact(req.params.id);
  res.status(200).send("Contact deleted");
});




module.exports = router;
