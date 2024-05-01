const loadContact = async () => {
  console.log("Loading contacts");

  const response = await axios.get("/contacts");
  const contacts = response.data; 
  const contactList = document.getElementById("contact-list");

  if (contacts.length === 0) {
    contactList.innerHTML = '<h1 class="text-center">No Contacts Found</h1>'; 
  } else {
    let html = "<ul>"; 
    contacts.forEach((element) => {
      html += `<li class="list-group-item">
                <div class="row">
                    <div class="col-md-8">
                        <h5 class="mb-1">${element.firstName} ${
        element.lastName
      }</h5>
                        <p class="mb-1">Phone: ${element.phone}</p>
                        <p class="mb-1">Email: ${element.email}</p>
                        <p class="mb-1">Address: ${element.street}, ${
        element.city
      }, ${element.state}, ${element.zip}</p>
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
    });
    html += "</ul>"; 
    contactList.innerHTML = html; 
  }
};
