

const run = async () => {
  const { createApp } = require('./app')
  const app = await createApp()
  const port = 5000
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
}

run()