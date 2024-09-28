import { Router } from "express";

import passport from "passport";
const routes: Router = Router();

routes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

routes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    console.log("passed");
    res.send("Authentication successful");
  }
);

routes.route("/session").get((req, res) => {
  const user = req.user;
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

routes.route("/logout").get((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.redirect("http://localhost:5173/");
  });
});
export default routes;
