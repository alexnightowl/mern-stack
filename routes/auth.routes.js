const { Router } = require("express")
const bcrypt = require("bcryptjs")
const { check, validationResult } = require("express-validator")
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require("../models/User")
const router = Router()

router.post(
    "/register",

    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Minimal length of password is 6 letters").isLength({
            min: 6
        })
    ],

    async(req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data during registration"
                })
            }

            const { email, password } = req.body

            const candidate = await User.findOne({ email })

            if (candidate) {
                return res
                    .status(400)
                    .json({ message: "User with the same email is exist" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword })

            await user.save()

            res.status(201).json({ message: "User was created" })
        } catch (error) {
            res
                .status(500)
                .json({ message: "Something went wrong, please try again" })
        }
    }
)

router.post(
    "/login",

    [
        check("email", "Input correct email")
        .normalizeEmail()
        .isEmail(),
        check("password", "Input password").exists()
    ],

    async(req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data during log into system"
                })
            }
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "User with this username does not exist" })
            }

            const isMatch = await bcrypt.compare(req.password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'wrong password, please try again' })
            }

            const token = jwt.token({ userId: user.id },
                config.get('jwtSecret'), { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id })

        } catch (error) {
            res
                .status(500)
                .json({ message: "Something went wrong, please try again" })
        }
    }
)

module.exports = router