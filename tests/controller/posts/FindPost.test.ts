import request from 'supertest'
import app from '../../../src/app'
import { login, signup } from '../testUtils/authUtil'
import { addPost } from '../testUtils/postUtil'

beforeAll(async () => {
  await signup('findpost1@test.com', 'findpost1', 'findpost1pw')
  await signup('findpost2@test.com', 'findpost2', 'findpost2pw')
  await signup('findpost3@test.com', 'findpost3', 'findpost3pw')
})

describe('Find post', () => {
  test('Find postn', async () => {
    const token = await login('findpost1', 'findpost1pw')

    const _ = await addPost(
      'Find post with valid token1',
      'Find post with valid token content1',
      token
    )

    const createRes2 = await addPost(
      'Find post with valid token2',
      'Find post with valid token content2',
      token
    )

    return request(app)
      .get(`/api/v1/posts/${createRes2.body.post.id}`)
      .then((res) => {
        expect(res.status).toBe(200)
        const data = res.body
        expect(data.post.id).toBe(createRes2.body.post.id)
        expect(data.post.title).toBe('Find post with valid token2')
        expect(data.post.content).toBe('Find post with valid token content2')
        expect(data.post.authorId).toBeDefined()
        expect(data.post.createdAt).toBeDefined()
        expect(data.post.updatedAt).toBeDefined()
      })
  })

  test('Find post with not exist id', async () => {
    const token = await login('findpost1', 'findpost1pw')

    const createRes = await addPost(
      'Find post with not exist id title',
      'Find post with not exist id content',
      token
    )

    return request(app)
      .get(`/api/v1/posts/${Number(createRes.body.post.id) * 10}`)
      .then((res) => {
        expect(res.status).toBe(404)
        expect(res.body.error.code).toBeDefined()
      })
  })
})
