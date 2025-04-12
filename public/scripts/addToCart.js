document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".add-to-cart");
  
    buttons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.dataset.pid;
  
        try {
          const res = await fetch("/api/carts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ pid: productId })
          });
  
          const result = await res.json();
  
          if (res.ok) {
            alert("Producto agregado al carrito");
          } else {
            alert(result.message || "Error al agregar al carrito");
          }
        } catch (error) {
          console.log(error);
          alert("Error al conectar con el servidor");
        }
      });
    });
  });
  