function verifyRedirect() {
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");
  if (username === "ivzuser" && password === "explore2022") {
    window.location.replace("home.html")
  } else {
    console.log("stay")
  }
}

const validateUser = (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "ivzuser" && password === "explore2022") {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);
      window.location.replace("home.html")
    } else if (username !== "ivzuser") {
      showAlert({
        text: "Invalid credentials!",
        bgColor: "#f75f54",
      });
    } else if (password !== "explore2022") {
      showAlert({
        text: "Invalid password!",
        bgColor: "#f75f54",
      });
    } else {
      showAlert({
        text: "Invalid credentials!",
        bgColor: "#f75f54",
      });
    }
  };

  function showAlert(item) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = item.text;
    x.style.backgroundColor = item.bgColor;
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }