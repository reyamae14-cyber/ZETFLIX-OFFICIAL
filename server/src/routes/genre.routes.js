import express from "express"

import genresController from "../controllers/genres.controller.js"

const router = express.Router({ mergeParams: true })

router.get("/list", genresController.getGenres)

router.get("/:mediaType", genresController.getDiscoverMediaList)

export default router