import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import GoogleUser from "../model/googleModel";

dotenv.config();

interface EnvironmentVariables {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URL: string;
}

const processEnv: EnvironmentVariables = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL || "",
};

//Persists user data inside session
passport.serializeUser((user: any, done) => {
  console.log("Session ID:", user); // Logging session ID
  done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(async (id: string, done) => {
  try {
    const findUser = await GoogleUser.findByPk(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: processEnv.GOOGLE_CLIENT_ID,
      clientSecret: processEnv.GOOGLE_CLIENT_SECRET,
      callbackURL: processEnv.GOOGLE_REDIRECT_URL,
      scope: [
        "email",
        "profile",
        // "https://www.googleapis.com/auth/youtube",
        // "https://www.googleapis.com/auth/youtube.force-ssl",
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("Google profile", profile);
      try {
        let user = await GoogleUser.findOne({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        } else {
          // If the user doesn't exist, create a new user
          const newUser = new GoogleUser({
            username: profile.displayName, // You can use profile.displayName or any other field from the profile
            googleId: profile.id,
          });

          console.log("newUser:", newUser);

          // Save the new user to the database
          await newUser.save();

          // Return the newly created user
          return done(null, newUser);
        }
      } catch (err: any) {
        return done(err);
      }
    }
  )
);

export default passport;
