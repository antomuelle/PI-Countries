import { Router } from 'express'
import multer from 'multer';
import * as CountryController from '../controllers/countryController.js'
import authRouter from './auth.js'

const upload = multer({ dest: 'uploads' })
const router = Router();

router.get('/countries', CountryController.getCountries)
router.get('/countries/:id', CountryController.getCountry)
router.post('/activities', CountryController.createActivity)

router.post('/upload', upload.single('image'), CountryController.uploadImage)

router.use('/', authRouter)

export default router