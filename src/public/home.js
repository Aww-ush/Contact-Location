let map = 0;
let markers = [];
const loadMapView = async () => {
  map = L.map("map").setView([41, -74], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
};

async function loadContact() {
  console.log("Loading contacts called");
  console.log("Loading contacts");
  markers = [];
  const response = await axios.get("/contacts");
  const contacts = response.data;
  console.log("this is contacts", contacts);
  const contactList = document.getElementById("contact-list");

  if (contacts.length === 0) {
    contactList.innerHTML = '<h1 class="text-center">No Contacts Found</h1>';
  } else {
    let html = "<ul>";
    contacts.forEach((element) => {
      html += `<li class="list-group-item border border-white" data-latitude=${
        element.latitude
      }
       data-longitude=${element.longitude}>
                <div class="row mx-1">
                    <div class="col-md-8 ">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-1">
                            ${element.firstName} ${element.lastName}
                          </h5>
                          <div>
                            <a href="#map" class="clickable mx-2" onClick="flyMap(${
                              element.latitude
                            }, ${element.longitude})">
                              View on Map
                              <svg class=" mx-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                              </svg>
                            </a>
                              <a class="clickable" onclick="editContact(${
                                element.id
                              })"  data-index-number="${
        element.id
      }" id="editBtn"> Edit </a>
                              <svg class="clickable" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil mx-2 " viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                              </svg>
                            </span>
                            <a id="deleteBtn" class="clickable" data-index-number="${
                              element.id
                            }" onclick="openDeleteModal(${element.id})"> Delete
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                              </svg>
                            </a>
                          </div>
                          
                        </div>
                        <p class="mb-1">Phone: ${element.phone}</p>
                        <p class="mb-1">Email: ${element.email}</p>
                        <p class="mb-1">Address: ${element.address}</p>
                        
                    </div>
                    <div class="col-md-4">
                        <p class="mb-1">Contact By:</p>
                        <ul class="list-unstyled">
                            <li>
                                <span>Phone</span>
                                <input type="checkbox" disabled ${
                                  element.contact_by_phone ? "checked" : ""
                                }/>
                            </li>
                            <li>
                                <span>Email</span>
                                <input type="checkbox" disabled ${
                                  element.contact_by_email ? "checked" : ""
                                }/>
                            </li>
                            <li>
                                <span>Mail</span>
                                <input type="checkbox" disabled ${
                                  element.contact_by_mail ? "checked" : ""
                                }/>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>`;
      lat = element.latitude;
      lng = element.longitude;
      console.log("this is lat and long", lat, lng);
      markers.push(
        L.marker([lat, lng]).addTo(map).bindPopup(`<b>${element.address}</b>`)
      );
    });
    html += "</ul>";
    contactList.innerHTML = "";
    contactList.innerHTML = html;
  }
}

async function editContact(id) {
  console.log("Edit contact with id: ");
    const sessionResponse = await axios.get(`/users/session`);
    if (!sessionResponse.data) {
      openSiginInfoModal();
      return;
    }
  const response = await axios.get(`/contacts/${id}`);
  const contact = response.data;
  console.log("this is contact", contact);
  const modal = document.getElementById("editContactModal");
  modal.dataset.id = id;

  // Create and append backdrop
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);
  // id
  // Show the modal
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  document.getElementById("edit_first_name").value = contact.firstName;
  document.getElementById("edit_last_name").value = contact.lastName;
  document.getElementById("edit_email").value = contact.email;
  document.getElementById("edit_phone").value = contact.phone;
  document.getElementById("edit_address").value = contact.address;
  document.getElementById("edit_contact_by_phone").checked =
    contact.contact_by_phone == 1;
  document.getElementById("edit_contact_by_email").checked =
    contact.contact_by_email == 1;
  document.getElementById("edit_contact_by_mail").checked =
    contact.contact_by_mail == 1;
}

function closeModal() {
  const modal = document.getElementById("editContactModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}

async function editContactToDB() {
  console.log("Editing contact to db");
  const modal = document.getElementById("editContactModal");
  console.log("this is modal id", modal.dataset.id);
  try {
    const response = await axios.post(`/contacts/${modal.dataset.id}`, {
      firstName: document.getElementById("edit_first_name").value,
      lastName: document.getElementById("edit_last_name").value,
      phone: document.getElementById("edit_phone").value,
      email: document.getElementById("edit_email").value,
      address: document.getElementById("edit_address").value,
      contact_by_phone: document.getElementById("edit_contact_by_phone").checked
        ? 1
        : 0,
      contact_by_email: document.getElementById("edit_contact_by_email").checked
        ? 1
        : 0,
      contact_by_mail: document.getElementById("edit_contact_by_mail").checked
        ? 1
        : 0,
    });
  } catch (error) {
    console.error("Error editing contact:", error);
    closeModal();
  }
  await loadContact();
}

async function deleteContact() {
  const id = document.getElementById("deleteModal").dataset.id;
  console.log(id);
  console.log("Delete contact");
  try {
    const response = await axios.delete(`/contacts/${id}`);

    loadContact();
    closeDeleteModal();
    if (!response.data.success) {
      openSiginInfoModal();
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}
function openSiginInfoModal() {
  const modal = document.getElementById("signInInfoModal");
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);

}
function closeSignInInfoModal() {
  const modal = document.getElementById("signInInfoModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}
async function openDeleteModal(id) {
  const response = await axios.get(`/users/session`); 
  if (!response.data) {
    openSiginInfoModal();
    return;
  }
  const modal = document.getElementById("deleteModal");
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);
  modal.dataset.id = id;
}
function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}
function flyMap(lat, lon) {
  map.flyTo([lat, lon], 12);
}
// loadMapView();
loadContact();
