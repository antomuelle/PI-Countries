import { Router } from "express"
import passport from "passport"
import { jsonError } from "../code/utils.js"
import * as AuthController from '../controllers/authController.js'

const router = Router()

router.post('/login', guestMiddleware, passport.authenticate('local'), AuthController.login)
router.post('/register', guestMiddleware, AuthController.register)
router.get('/logout', authMiddleware, AuthController.logout)
router.get('/check', AuthController.check)

export default router

// Middlewares
/** @param {Request} req */
function guestMiddleware(req, res, next) {
  if (req.isAuthenticated())
    jsonError(res, { message: 'user already authenticated' }, 301)
  else
    next()
}

/** @param {Request} req */
export function authMiddleware(req, res, next) {
  if (req.isUnauthenticated())
    jsonError(res, 'you need to log in to see this part')
  else
    next()
}