// const bcrypt = require("bcrypt");
async function loginOpen() {
  const modal = document.getElementById("loginModal");
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  const loginHtml = document.getElementById("loginError");
  loginHtml.innerHTML = "";
}
function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}
function closeSignUpModal() {
  const modal = document.getElementById("signUpModal");
  const backdrop = document.querySelector(".modal-backdrop");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  backdrop.parentNode.removeChild(backdrop);
}
async function signup() {
  console.log("signup");
  document.getElementById("signUpError").innerHTML = "";
  // find the contact modal
  const firstName = document.getElementById("signUp_first_name").value;
  const lastName = document.getElementById("signUp_last_name").value;
  const userName = document.getElementById("signUp_user_name").value;
  const p1 = document.getElementById("signUp_password").value;
  const p2 = document.getElementById("signUp_password2").value;

  if (p1 != p2) {
    const message = "Passwords do not match!";
    document.getElementById("signUpError").innerHTML = message;
    return;
  }
  const response = await axios.post(`/users/signin`, {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    password: p1,
  });
  //backend put the user in session
  // forntend need to update the user in the frontend
  if (response.data.success) {
      await manageSession();
      closeSignUpModal();
  } else {
    document.getElementById("signUpError").innerHTML = response.data.message;
  }
}
const login = async (req, res) => {
  const loginHtml = document.getElementById("loginError");
  loginHtml.innerHTML = "";
  const userName = document.getElementById("login_user_name").value.trim();
  const password = document.getElementById("login_password").value.trim();
  try {
    const res = await axios.post("/users/login", {
      userName: userName,
      password: password,
    });
    if (res.data.success) {
      manageSession();
      closeLoginModal();
      await loadContact();
    } else {
      console.log("Error logging in:", res.data.message);
      loginHtml.innerHTML = res.data.message;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    closeModal();
  }
};
const logout = async (req, res) => {
    try {
        const response = await axios.get(`/users/logout`);
    } catch (error) {
        console.error("Error logging out:", error);
    }
  manageSession();
};
async function clickFromLoginToSignUp() {
  signupOpen();
}
async function clickFromSignUpToLogin() {
  closeSignUpModal();
  loginOpen();
}
async function signupOpen() {
  console.log("clickFromSignUp");
  closeLoginModal();
  const modal = document.getElementById("signUpModal");

  // Create and append backdrop
  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);
  modal.classList.add("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
}
async function manageSession() {
  try {
    console.log("getting session");
    const response = await axios.get(`/users/session`);
    // Handle successful response
    console.log("Session data:", response.data);
    if (response.data != null) {
      document.getElementById("loginLink").style.display = "none";
      document.getElementById("logoutLink").style.display = "block";
      document.getElementById(
        "displayName"
      ).innerHTML = `Welcome ${response.data.firstName}`;
    } else {
      document.getElementById("loginLink").style.display = "block";
      document.getElementById("logoutLink").style.display = "none";
      document.getElementById("displayName").innerHTML = "";
    }
  } catch (error) {
    // Handle error
    console.error("Error retrieving session data:", error);
  }
}
