import express from 'express'
import router from './routes'

const app: express.Express = express()
const todos = [
  {
    username: 'user1',
    title: 'title1',
  },
  {
    username: 'user2',
    title: 'title2',
  },
]
app.get('/todos', (req, res) => {
  res.send({
    todos: todos,
  })
})
app.post('/todos', (req, res) => {
  todos.push(req.body)
  res.send(200)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.REMOVE_CORS === 'true') {
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', '*')
      res.header('Access-Control-Allow-Headers', '*')
      next()
    }
  )
}

app.use('/api/v1', router)

export default app
