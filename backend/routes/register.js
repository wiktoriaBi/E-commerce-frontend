const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const {sha256} = require("js-sha256");
const {body, validationResult} = require("express-validator");

router.post('/',
    [
        [
            body("username").notEmpty().withMessage("username is required"),
            body("password").notEmpty().withMessage("password is required"),
            body("email").notEmpty().withMessage("Email is required"),
            body("phone").notEmpty().withMessage("Phone number is required")
        ],
    ], async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email, phone } = req.body;

        const existingUser = await User.where({ username }).fetch({ require: false });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Username already exists', existingUser });
        }

        let hashedPassword = sha256(password)

        try {
            const newUser = await new User({
                username,
                password: hashedPassword,
                email,
                phone,
                role: 'CLIENT'
            }).save();
            res.status(StatusCodes.CREATED).json(newUser);
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send(err.message);
        }
    });

module.exports = router;