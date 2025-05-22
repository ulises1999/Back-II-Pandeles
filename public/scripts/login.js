document.querySelector("#login").addEventListener("click", async () => {
  try {
    const data = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // mantiene cookies
    };
    const url = "/api/auth/login";
    const response = await fetch(url, opts);
    const result = await response.json();
    console.log(result);
    if (result.error) {
      alert(result.error);
    } else {
      location.replace("/");
    }
  } catch (error) {
    console.log(error);
    alert("Error al iniciar sesión");
  }
});
