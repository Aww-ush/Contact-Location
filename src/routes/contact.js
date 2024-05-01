const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    console.log("here");
    const contact = await req.db.getContacts();
    res.json(contact);
});

// router.get("/:id/edit", logged_in, async (req, res) => {
//   console.log(req.params.id);
//   res.render("editContact", {
//     contact: await req.db.findContact(req.params.id),
//   });
// });
// router.post("/:id/edit", logged_in, async (req, res) => {
//   const contact = {
//     id: req.params.id,
//     firstName: req.body.first_name,
//     lastName: req.body.last_name,
//     phone: req.body.phone,
//     email: req.body.email,
//     street: req.body.street,
//     city: req.body.city,
//     state: req.body.state,
//     zip: req.body.zip,
//     country: req.body.country,
//     contact_by_email: req.body.contact_by_email ? 1 : 0,
//     contact_by_phone: req.body.contact_by_phone ? 1 : 0,
//     contact_by_mail: req.body.contact_by_mail ? 1 : 0,
//   };
//  await req.db.updateContact(contact);
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const contact = await req.db.findContact(req.params.id);
//     if (!contact) {
//       // Handle case where contact is not found
//       return res.status(404).send("Contact not found");
//     }
//     res.render("contactInfo", { contact: contact });
//   } catch (error) {
//     console.error("Error fetching contact:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
