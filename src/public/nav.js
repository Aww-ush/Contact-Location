function addContact() {
  const modal = document.getElementById("addContactModal");

  // Create and append backdrop
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);

  // Show the modal
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
}

 function canBtn() {
  console.log("Closing");
  const modal = document.getElementById("addContactModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}
const addContactToDB = async () => {
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;
  const country = document.getElementById("country").value;
  const contact_by_phone = document.getElementById("contact_by_phone").checked
    ? 1
    : 0;
  const contact_by_email = document.getElementById("contact_by_email").checked
    ? 1
    : 0;
  const contact_by_mail = document.getElementById("contact_by_mail").checked
    ? 1
    : 0;
  const contact = {
    first_name,
    last_name,
    email,
    phone,
    address,
    state,
    zip,
    country,
    contact_by_phone,
    contact_by_email,
    contact_by_mail,
  };
  console.log("this is get data form modal", contact);
  try {
    await axios.post("/contacts", {
      firstName: first_name,
      lastName: last_name,
      email: email,
      phone: phone,
      address: address + "," + state + "," + zip,
      country: country,
      contact_by_phone: contact_by_phone,
      contact_by_email: contact_by_email,
      contact_by_mail: contact_by_mail,
    });
    canBtn();
  } catch (error) {
    console.error("Error adding contact:", error);
    canBtn();
  }
  await loadContact();
};
