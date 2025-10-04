import express from "express"

import mediaController from "../controllers/media.controller.js"

const router = express.Router({ mergeParams: true })

router.get("/search", mediaController.search)

router.get("/detail/:mediaId", mediaController.getDetail)

router.get("/trending/:timeWindow", mediaController.getTrendingList)

router.get("/:mediaCategory", mediaController.getList)


export default router