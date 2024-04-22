function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:8080/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          const errorMessage = `Status: ${error.status}, Message: ${error.message}`;
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then((data) => {
      alert("Registration successful. Please login.");
      //redirect to login page
      window.location.href = "auth-login.html";
    })
    .catch((error) => {
      alert(error.message);
      console.error("Error:", error);
    });
}

function checkAuthentication() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return accessToken && refreshToken;
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
  })
  .then((response) => {
      if (!response.ok) {
          return response.json().then(error => {
              const errorMessage = `Status: ${error.status}, Message: ${error.message}`;
              throw new Error(errorMessage);
          });
      }
      return response.json();
  })
  .then((data) => {
      if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          document.getElementById("loginForm").style.display = "none";
          document.getElementById("userInfo").style.display = "block";
          document.getElementById("usernameDisplay").textContent = email;
      } else {
          alert("Authentication failed");
      }
  })
  .catch((error) => {
      alert(error.message);
      console.error("Error:", error);
  });
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function logoutAndRemoveUserInfo() {
  logout();
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("userInfo").style.display = "none";
}

if (checkAuthentication()) {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("userInfo").style.display = "block";
}
