import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { usersManager } from "../dao/index.factory.js";
import { createHash, verifyHash } from "../helpers/hash.helper.js"; 
import { createToken } from "../helpers/token.helper.js";
import sendEmailOfRegister from "../helpers/registerEmail.helper.js";
import UserDTO from "../dto/users.dto.js"; 

    const {
      SECRET,
      GOOGLE_ID: clientID,
      GOGGLE_SECRET: clientSecret,
    } = process.env;
    const callbackURL = "http://localhost:8080/api/auth/google/cb";

    passport.use(
      "register",
      new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
          try {

            const user = await usersManager.readBy({ email });
            if (user) {
              return done(null, null, {
                message: "Email already in use",
                statusCode: 400,
              });
            }

            
            const newUserDTO = new UserDTO(req.body); 
            
            
            const response = await usersManager.createOne(newUserDTO); 
            

            
            await sendEmailOfRegister({ email: response.email, verifyCode: response.verifyCode });
            
            
            done(null, response);

          } catch (error) {
            console.error("Error en estrategia de registro:", error);
            done(error);
          }
        }
      )
    );

    
    passport.use(
      "login",
      new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
          try {
            const response = await usersManager.readBy({ email });
            if (!response) {
              return done(null, null, {
                message: "Invalid credentials",
                statusCode: 401,
              });
            }
            const verifyAccount= response.isVerify
            if(!isVerify){
               return done(null, null, {
                message: "Invalid credentials",
                statusCode: 401,
              });
            }
            const verify = verifyHash(password, response.password);
            if (!verify) {
              return done(null, null, {
                message: "Invalid credentials",
                statusCode: 401,
              });
            }
            const data = {
              user_id: response._id,
              email: response.email,
              role: response.role,
            };
            console.log("Data for token:", data)
            const token = createToken(data);

            done(null, response, { token: token });

          } catch (error) {
            done(error);
          }
        }
      )
    );

    passport.use(
      "google",
      new GoogleStrategy(
        { clientID, clientSecret, callbackURL },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log(profile);
            const email = profile.id;
            let user = await usersManager.readBy({ email });
            if (!user) {
              user = {
                name: profile.name.givenName,
                photo: profile.picture,
                email: profile.id,
                password: createHash(profile.id), 
              };
              user = await usersManager.createOne(user);
            }
            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );

    export default passport;