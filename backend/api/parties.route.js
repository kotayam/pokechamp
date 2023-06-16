import express from "express";
import PartiesCtrl from "./parties.controller.js";

const router = express.Router();

router.route("/:id")
    .get(PartiesCtrl.apiGetParty) 
    .put(PartiesCtrl.apiUpdateParty)
    .delete(PartiesCtrl.apiDeleteParty); 

router.route("/")
    .get(PartiesCtrl.apiGetAllParties)
    .post(PartiesCtrl.apiPostParty);

router.route("/login")
    .post(PartiesCtrl.apiLogin);

router.route("/create-account")
    .post(PartiesCtrl.apiCreateAccount);
    
export default router;