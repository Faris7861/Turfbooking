import express from 'express';
import { verifyAdmin,  verifyClient } from '../utils/verifyToken.js';
import { deleteClient, getClient, getClients, updateClient } from '../controllers/client.js';

const router = express.Router();



/*router.get("/checkauth", verifyToken, (req, res, next) => {
    res.send("You are logged in!");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
    res.send("You can delete your account!");
});

router.get("/checkadmin/:id", verifAdmin , (req, res, next) => {
    res.send("Hello admin!");
});
*/


//UPDATE

router.put("/:id",verifyClient, updateClient);

//DELETE

router.delete("/:id",verifyClient, deleteClient);

//GET

router.get("/:id",verifyClient, getClient);

//GET ALL

router.get("/",verifyAdmin, getClients);

router.get("/:id/turf", verifyClient)

export default router;