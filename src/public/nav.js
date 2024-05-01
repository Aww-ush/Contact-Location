const addContact = async () => {
  console.log("Adding contact");
  const addItem = document.getElementById("add-item");

  const modal = `
    <div class="modal" tabindex="-1" id="exampleModal">

    `;

  addItem.onclick = async () => {
    // Append the modal HTML to the document body
    openAddEquipmentModal();

  };
};

const openAddEquipmentModal = () => {
  const modal = document.getElementById("addContactModal");
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
};

function closeContactModal() {
  const modal = document.getElementById("addContactModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}

const submit = async () => {
  console.log("submitting form called")
  const contactForm = document.getElementsByTagName("form")
  console.log(contactForm);

};

  // try {
  //   // Make a POST request to add equipment
  //   await axios.post("/admin/addEquipment", { name, quantity });

  //   // Reload equipment list after adding
  //   await loadEquipment();

  //   // Close the modal
  //   closeAddEquipmentModal();
  // } catch (error) {
  //   console.error("Error adding equipment:", error);
  //   // Handle error if needed
  // }
