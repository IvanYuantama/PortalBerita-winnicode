const beritaController = require("../controllers/beritaController");
const express = require("express");
const beritaRouter = express.Router();

// Lengkapi semua route yang digunakan
beritaRouter.get("/getAll", beritaController.getAllBerita);
beritaRouter.get("/getBeritaById/:id", beritaController.getBeritaById);
beritaRouter.get("/getAllKategori", beritaController.getAllKategori);
beritaRouter.get("/getById/:id", beritaController.getBeritaById);
beritaRouter.get("/getByJurnalis/:jurnalis_id", beritaController.getBeritaByJurnalisId);
beritaRouter.get("/getChat/:berita_id", beritaController.getChatBeritaById);
beritaRouter.post("/addChat", beritaController.addChatBerita);
beritaRouter.post("/add", beritaController.addBerita);
beritaRouter.delete("/delete/:id", beritaController.deleteBerita);
beritaRouter.put("/edit/:id", beritaController.editBerita);

module.exports = beritaRouter;
