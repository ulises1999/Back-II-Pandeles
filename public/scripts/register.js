
document.querySelector("#register").addEventListener("click", async () => {
  try {
    const data = {
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };

    if (!data.name || !data.email || !data.password) {
      return alert("All fields are required");
    }

    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    };

    const response = await fetch("/api/auth/register", opts);
    const result = await response.json();

    if (result.error) {
      alert(result.error.message || result.error);
    } else {
      alert("Usuario registrado. Ahora inicia sesión.");
      location.replace("/login");
    }
  } catch (error) {
    console.log(error);
    alert("Ocurrió un error al registrarse.");
  }
});
