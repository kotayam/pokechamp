import express from "express";
import PartiesCtrl from "./parties.controller.js";

const router = express.Router();

router.route("/party/:partyId")
    .get(PartiesCtrl.authenticateToken, PartiesCtrl.apiGetParty) 
    .put(PartiesCtrl.authenticateToken, PartiesCtrl.apiUpdateParty)
    .delete(PartiesCtrl.authenticateToken, PartiesCtrl.apiDeleteParty); 

router.route("/home")
    .get(PartiesCtrl.authenticateToken, PartiesCtrl.apiGetAllParties)
    .post(PartiesCtrl.authenticateToken, PartiesCtrl.apiPostParty);

router.route("/user")
    .get(PartiesCtrl.apiGetUserInfo);

router.route("/create-account")
    .post(PartiesCtrl.apiCreateAccount);

router.route("/login")
    .post(PartiesCtrl.apiLogin);

router.route("/refresh")
    .post(PartiesCtrl.apiRefresh);

router.route("/logout")
    .post(PartiesCtrl.authenticateToken, PartiesCtrl.apiLogout);
    
export default router;