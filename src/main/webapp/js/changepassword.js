document.addEventListener("DOMContentLoaded", function () {

  const frmChangePassword = document.getElementById("frmChangePassword");
  const username = Cookies.get("user");
  console.log(username);
  frmChangePassword.addEventListener("submit", async function (event) {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    
    const response = await fetch("http://localhost:8080/ExamenRecuperacion/changepassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        newPassword: newPassword
      })
    });

    const result = await response.json();
    if (!result.status) {
      alert("Error al cambiar la contraseña");
      return;
    }
    alert("Contraseña cambiada correctamente.");
    window.location.href = "http://localhost:8080/ExamenRecuperacion/principal.html";



  });

});