document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('frm-auth');

  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const response = await fetch('http://localhost:8080/ExamenRecuperacion/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if(!result.success){
      alert("Error al iniciar sesión. Verifica tus credenciales.");	
      return;
    }

    Cookies.set('token', result.token);
    Cookies.set('user', result.username);

    window.location.href = 'http://localhost:8080/ExamenRecuperacion/principal.html';
    
  })

});
