import express from "express";
import PartiesCtrl from "./parties.controller.js";

const router = express.Router();

router.route("/:id")
    .get(PartiesCtrl.apiGetParty) 
    .put(PartiesCtrl.apiUpdateParty);

router.route("/")
    .get(PartiesCtrl.apiGetAllParties)
    .post(PartiesCtrl.apiPostParty)
    .delete(PartiesCtrl.apiDeleteParty); 
    
export default router;