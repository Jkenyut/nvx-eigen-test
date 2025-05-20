//import library
const express = require("express");

//import handler
const bookControllers = require("../controllers/book");
const memberControllers = require("../controllers/member");
const dataControllers = require("../controllers/data");
const router = express.Router();

//endpoints api
router.get("/", (req, res) => {
    res
        .status(200)
        .send(
            "enpoint: \n /pinjam  POST : pinjam buku\n /pengembalian POST: pengembalian buku\n /member GET: check member\n /buku GET: check buku\n /data GET :only for generate mocks data\n /api-docs GET:documentation API Swagger UI"
        );
});
router.post("/pinjam", dataControllers.updatePenalty, bookControllers.pinjam);
router.post("/pengembalian", bookControllers.pengembalian);
router.get("/book", bookControllers.checkBook);
router.get("/member", memberControllers.checkMember);
router.get("/data", dataControllers.updatePenalty, dataControllers.build);
module.exports = router;
