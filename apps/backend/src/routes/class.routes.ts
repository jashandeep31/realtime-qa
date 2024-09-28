import { Router } from "express";
import {
  createClass,
  getAllLiveClasses,
} from "../controllers/class.controllers.js";

const routes: Router = Router();

routes.route("/").post(createClass).get(getAllLiveClasses);

export default routes;
