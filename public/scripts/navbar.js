const selector = document.querySelector("#opts");

const isOnline = async () => {
  try {
    const opts = {
      method: "POST",
      credentials: "include"
    };
    const url = "/api/auth/online";
    let response = await fetch(url, opts);
    response = await response.json();
    console.log("response recibido de /api/auth/online:", response);

    const uid = response?.response?.user?.user_id;

    if (uid) {
      selector.innerHTML = `
        <a class="btn btn-success py-1 px-2 m-1" href="/profile/${uid}">Profile</a>
        <a class="btn btn-success py-1 px-2 m-1" href="/cart/${uid}">Cart</a>
        <button class="btn btn-success py-1 px-2 m-1" id="signout">Sign out</button>
      `;
      document
        .querySelector("#signout")
        .addEventListener("click", async () => {
          try {
            await fetch("/api/auth/signout", {
              method: "GET",
              credentials: "include"
            });
            location.replace("/");
          } catch (error) {
            console.log(error);
          }
        });
    } else {
      selector.innerHTML = `
        <a class="btn btn-success py-1 px-2 m-1" href="/register">Register</a>
        <a class="btn btn-success py-1 px-2 m-1" href="/login">Login</a>
      `;
    }
  } catch (error) {
    console.log("Error en isOnline:", error);
  }
};

isOnline();
