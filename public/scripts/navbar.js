const selector = document.querySelector("#opts");

const isOnline = async () => {
  try {
    const opts = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const url = "/api/auth/online";
    const res = await fetch(url, opts);
    const data = await res.json();
    const user = data?.response?.user;

    if (user && user.user_id) {
      const uid = user.user_id;

      selector.innerHTML = `
        <a class="btn btn-success py-1 px-2 m-1" href="/profile/${uid}">Profile</a>
        <a class="btn btn-success py-1 px-2 m-1" href="/cart/${uid}">Cart</a>
        <button class="btn btn-success py-1 px-2 m-1" id="signout">Sign out</button>
      `;

      document.querySelector("#signout").addEventListener("click", async () => {
        try {
          await fetch("/api/auth/signout", {
            method: "GET",
            credentials: "include",
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
    console.log("Error en isOnline", error);
  }
};

isOnline();

