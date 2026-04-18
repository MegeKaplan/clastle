import app from "./app.js"

const startServer = async () => {
  try {
    await app.ready()

    await app.listen({
      port: Number(app.config.PORT),
      host: "0.0.0.0"
    })
    console.log(`Server is running on http://localhost:${app.config.PORT}`);
  } catch (error) {
    console.error(error)
  }
}

startServer()