const registerBtn = document.querySelector("#signBtn");
const registerMsg = document.querySelector(".register-msg");

const loginBtn = document.querySelector("#loginBtn");
const loginMsg = document.querySelector(".login-msg");

const authBtn = document.querySelector(".connect");
const logoutBtn = document.querySelector(".logoutBtn");
const dashboardBtn = document.querySelector(".dashboardBtn");

async function register() {
  const firstName = document.querySelector("#firstNameRegister").value;
  const lastName = document.querySelector("#lastNameRegister").value;
  const email = document.querySelector("#emailRegister").value;
  const password = document.querySelector("#passwordRegister").value;

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newUser),
  };
  const apiRequest = await fetch(
    "http://localhost:3500/user/register",
    request
  );
  const result = await apiRequest.json();
  if (apiRequest.status === 201) {
    registerMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-green-500 font-bold">Registration successful, you can now log in</p>`;
  }else {
    registerMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500 font-bold">Wrong credentials !</p>`;
    return
  }
}
async function login() {
  let email = document.querySelector("#emailLogin").value;
  let password = document.querySelector("#passwordLogin").value;

  let user = {
    email: email,
    password: password,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };

  let apiRequest = await fetch("http://localhost:3500/user/login", request);
  let result = await apiRequest.json();

  if (apiRequest.status !== 200) {
    loginMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-500 font-bold">Invalid credentials</p>`;
    return;
    
  } else {
    const data = await result;
    window.localStorage.setItem("token", data.jwt);
    loginMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-green-500 font-bold">Login successful,<br>
    you will be redirected to your dashboard</p>`;
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, "4000");
    return
  }
}
if (registerBtn) {
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    register();
  });
}
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    login();
  });
}
(function isConnected() {
  const jwt = localStorage.getItem("token");

  if (jwt === null) {
  } else {
    if (authBtn) {
      authBtn.classList.add("hidden");
    }
    if (logoutBtn) {
      logoutBtn.classList.remove("hidden");
    }
    if (dashboardBtn) {
      dashboardBtn.classList.remove("hidden");
    }
  }
})();

function logout() {
  window.localStorage.removeItem("token");
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    logout();
    window.alert("Disconnected successfull");
    window.location.href = "./index.html";
  });
}
