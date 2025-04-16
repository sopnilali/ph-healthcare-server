import app from "./app"
import config from "./app/config"


async function server() {
    try {
      app.listen(config.port, function () {
        console.log(`Server is running on port ${config.port}`)
      })
    } catch (error) {
      console.error('Error connecting to Prisma', error)
    }
  }
  
  server()