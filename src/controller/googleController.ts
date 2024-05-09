import passport from "passport";

export const google = passport.authenticate("google");

export const redirectGoogle = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login",
});
