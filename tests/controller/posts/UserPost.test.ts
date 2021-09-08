import request from 'supertest'
import app from '../../../src/app'
import { login, signup } from '../testUtils/authUtil'
import { addPost } from '../testUtils/postUtil'

beforeAll(async () => {
  await signup('userpost1@test.com', 'userpost1', 'userpost1pw')
  await signup('userpost2@test.com', 'userpost2', 'userpost2pw')
  await signup('userpost3@test.com', 'userpost3', 'userpost3pw')

  const token1 = await login('userpost1', 'userpost1pw')
  const token2 = await login('userpost2', 'userpost2pw')

  await addPost('User1 post title1', 'User1 post content1', token1)
  await addPost('User1 post title2', 'User1 post content2', token1)

  await addPost('User2 post title1', 'User2 post content1', token2)
  await addPost('User2 post title2', 'User2 post content2', token2)
  await addPost('User2 post title3', 'User2 post content3', token2)
})

describe('User post', () => {
  test('Normal sequence', async () => {
    return request(app)
      .get(`/api/v1/users/userpost1/posts/`)
      .then((res) => {
        expect(res.status).toBe(200)
        const data = res.body
        expect(data.posts.length).toBe(2)
      })
  })

  test('User post of not exist user.', async () => {
    return request(app)
      .get(`/api/v1/users/userpost123/posts/`)
      .then((res) => {
        expect(res.status).toBe(404)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('User post with user has no post.', async () => {
    return request(app)
      .get(`/api/v1/users/userpost3/posts/`)
      .then((res) => {
        expect(res.status).toBe(200)
        const data = res.body
        expect(data.posts.length).toBe(0)
      })
  })
})
