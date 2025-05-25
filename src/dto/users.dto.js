    import crypto from "crypto";
    import { createHash } from "../helpers/hash.helper.js"; // Importa createHash

    const { PERSISTENCE } = process.env;

    class userDTO {
        constructor(data) {
            if (PERSISTENCE !== "mongo") {
                this._id = crypto.randomBytes(12).toString("hex");
            }
            this.name = data.name;
            this.email = data.email;
            // *** CAMBIO CLAVE AQUÍ: Hashear la contraseña en el DTO ***
            this.password = createHash(data.password); // Hashea la contraseña al construir el DTO
            
            this.role = data.role || "USER";
            this.photo = data.photo || "https://media.lordicon.com/icons/wired/lineal/44-avatar-user-in-circle.svg";
            
            this.isVerify = data.isVerify || false;
            this.verifyCode = crypto.randomBytes(12).toString("hex");
        }
    }

    export default userDTO;