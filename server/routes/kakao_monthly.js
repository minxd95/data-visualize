import express from "express";
import fs from "fs";
import parseXlsx from "excel";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

export default router;
