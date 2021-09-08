import { Router } from 'express'
import { RequireAuth } from '../controllers/auth/RequireAuth'
import { AddPost } from '../controllers/posts/AddPost'
import { FindPost } from '../controllers/posts/FindPost'
import { Posts } from '../controllers/posts/Posts'
import { UpdatePost } from '../controllers/posts/UpdatePost'
import { UserPost } from '../controllers/posts/UserPost'

const PostRouter = Router()

// TODO as anyは良くないがインターフェースはControllerに全て定義
PostRouter.get('/posts/:id', FindPost as any)
PostRouter.get('/users/:username/posts', UserPost)
PostRouter.post('/posts/', RequireAuth(AddPost))
PostRouter.get('/posts/', Posts)
PostRouter.put('/posts/:id', RequireAuth(UpdatePost))

export default PostRouter
