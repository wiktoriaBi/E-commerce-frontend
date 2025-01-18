const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const passport = require("./passport");
const {StatusCodes} = require("http-status-codes");

// GET all categories passport.authenticate("jwt", {session : false}),
router.get('/',
    async (req, res) => {
    const categories = await Category.fetchAll();
    if (!categories || categories.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'No categories found' });
    }
    res.json(categories);
});

module.exports = router;

