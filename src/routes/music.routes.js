import express from "express";
import multer from "multer";
import * as musicController from "../controllers/music.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post("/upload",authMiddleware.authArtistMiddleware, upload.fields([
    {name: "music", maxCount: 1},
    {name: "coverImage", maxCount: 1}
]), musicController.uploadMusic)

/* GET /api/music */
router.get('/', authMiddleware.authUserMiddleware, musicController.getAllMusics)

/* GET /api/music/search */
router.get('/search', authMiddleware.authUserMiddleware, musicController.searchMusic)

/* GET /api/music/get-details/:id */
router.get('/get-details/:id', authMiddleware.authUserMiddleware, musicController.getMusicById)

/* GET /api/music/artist-musics */
router.get('/artist-musics', authMiddleware.authArtistMiddleware, musicController.getArtistMusics)

/* DELETE /api/music/:id */
router.delete('/:id', authMiddleware.authArtistMiddleware, musicController.deleteMusic)

/* POST /api/music/playlist */
router.post('/playlist', authMiddleware.authArtistMiddleware, musicController.createPlaylist)

/* GET /api/music/playlist/artist */
router.get('/playlist/artist', authMiddleware.authArtistMiddleware, musicController.getArtistPlaylists)

/* GET /api/music/playlists */
router.get('/playlist', authMiddleware.authUserMiddleware, musicController.getPlaylists)

/* GET /api/music/playlist/:id */
router.get('/playlist/:id', authMiddleware.authUserMiddleware, musicController.getPlaylistById)

/* PUT /api/music/playlist/:id */
router.put('/playlist/:id', authMiddleware.authArtistMiddleware, musicController.updatePlaylist)

/* DELETE /api/music/playlist/:id */
router.delete('/playlist/:id', authMiddleware.authArtistMiddleware, musicController.deletePlaylist)

/* POST /api/music/playlist/add-music */
router.post('/playlist/add-music', authMiddleware.authUserMiddleware, musicController.addMusicToPlaylist)

export default router;