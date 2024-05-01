require("dotenv").config();
const Database = require("dbcmps369");
const bcrypt = require("bcryptjs");
class ContactDB {
  constructor() {
    this.db = new Database();
  }

  async initialize() {
    await this.db.connect();
    await this.db.schema(
      "Contacts",
      [
        { name: "id", type: "INTEGER" },
        { name: "firstName", type: "TEXT" },
        { name: "lastName", type: "TEXT" },
        { name: "phone", type: "INTEGER" },
        { name: "email", type: "TEXT" },
        { name: "address", type: "TEXT" },
        { name: "contact_by_email", type: "INTEGER" },
        { name: "contact_by_phone", type: "INTEGER" },
        { name: "contact_by_mail", type: "INTEGER" },
      ],
      "id"
    );
    await this.db.schema(
      "Users",
      [
        { name: "id", type: "INTEGER" },
        { name: "firstName", type: "TEXT" },
        { name: "lastName", type: "TEXT" },
        { name: "userName", type: "TEXT" },
        { name: "password", type: "TEXT" },
      ],
      "id"
    );
    if ((await this.findUserByUserName("cmps369")) === undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync("rcnj", salt);
      const newUser = {
        firstName: "cmps",
        lastName: "369",
        userName: "cmps369",
        password: hash,
      };
      await this.createUser(newUser);
    }
  }
  async createContact(contact) {
    console.log("Creating contact:");
    const id = await this.db.create("Contacts", [
      { column: "firstName", value: contact.firstName },
      { column: "lastName", value: contact.lastName },
      { column: "phone", value: contact.phone },
      { column: "email", value: contact.email },
      { column: "address", value: contact.address  + " " + contact.state + " " + contact.zip + " " + contact.country},
      { column: "contact_by_email", value: contact.contact_by_email },
      { column: "contact_by_phone", value: contact.contact_by_phone },
      { column: "contact_by_mail", value: contact.contact_by_mail },
    ]);
    return id;
  }
  async createUser(user) {
    const id = await this.db.create("Users", [
      { column: "firstName", value: user.firstName },
      { column: "lastName", value: user.lastName },
      { column: "userName", value: user.userName },
      { column: "password", value: user.password },
    ]);
    return id;
  }

  async findContact(id) {
    const contact = await this.db.read("Contacts", [
      { column: "id", value: id },
    ]);
    if (contact.length > 0) return contact[0];
    else {
      return undefined;
    }
  }

  async findUserById(id) {
    const users = await this.db.read("Users", [{ column: "id", value: id }]);
    if (users.length > 0) return users[0];
    else {
      return undefined;
    }
  }

  async findUserByUserName(userName) {
    const users = await this.db.read("Users", [
      { column: "userName", value: userName },
    ]);
    if (users.length > 0) return users[0];
    else {
      return undefined;
    }
  }
  async updateContact(contact) {
    console.log("Updating contact:");
    console.log(contact);
    await this.db.update(
      "Contacts",
      [
        { column: "firstName", value: contact.firstName },
        { column: "lastName", value: contact.lastName },
        { column: "phone", value: contact.phone },
        { column: "email", value: contact.email },
        { column: "address", value: contact.address },
        { column: "contact_by_email", value: contact.contact_by_email },
        { column: "contact_by_phone", value: contact.contact_by_phone },
        { column: "contact_by_mail", value: contact.contact_by_mail },
      ],
      [{ column: "id", value: contact.id }]
    );
  }
  async deleteContact(contact) {
    await this.db.delete("Contacts", [{ column: "id", value: contact.id }]);
  }
  async getContacts() {
    return await this.db.read("Contacts", []);
  }
}

module.exports = ContactDB;
