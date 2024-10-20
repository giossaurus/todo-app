const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { connectMongoDB, connectRedis } = require('./config/database')
const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

connectMongoDB()
connectRedis()

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app