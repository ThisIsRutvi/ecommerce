import express from 'express'
import chatbotController from './chatController.js'

const router = express.Router()

router.post('/chat',chatbotController)

export default router