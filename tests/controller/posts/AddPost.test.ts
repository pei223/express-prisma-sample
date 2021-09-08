import request from 'supertest'
import app from '../../../src/app'
import { login, signup } from '../testUtils/authUtil'

beforeAll(async () => {
  await signup('addpost1@test.com', 'addpost1', 'addpost1pw')
})

describe('Add post', () => {
  test('Add post with valid token', async () => {
    const token = await login('addpost1', 'addpost1pw')

    return request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Add post with valid token',
        content: 'Add post with valid token content',
      })
      .then((res) => {
        expect(res.status).toBe(200)

        const data = res.body
        expect(data.post.title).toBe('Add post with valid token')
        expect(data.post.content).toBe('Add post with valid token content')
        expect(data.post.authorId).toBeDefined()
        expect(data.post.createdAt).toBeDefined()
        expect(data.post.updatedAt).toBeDefined()
        expect(data.post.authorId).toBeDefined()
      })
  })

  test('Add post with no token', async () => {
    return request(app)
      .post('/api/v1/posts')
      .send({
        title: 'Add post with no token',
        content: 'Add post with no token content',
      })
      .then((res) => {
        expect(res.status).toBe(401)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('Add post with title exceed limit', async () => {
    const token = await login('addpost1', 'addpost1pw')

    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '1'.repeat(200),
        content: 'Add post with title exceed limit content.',
      })
      .then((res) => {
        expect(res.status).toBe(200)
      })

    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '1'.repeat(200) + '1',
        content: 'Add post with title exceed limit content',
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })

    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'あ'.repeat(200) + 'あ',
        content: 'Add post with title exceed limit content',
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('Add post with content exceed limit', async () => {
    const token = await login('addpost1', 'addpost1pw')

    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Add post with content exceed limit1',
        content: '1'.repeat(2000),
      })
      .then((res) => {
        expect(res.status).toBe(200)
      })

    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Add post with content exceed limit2',
        content: '1'.repeat(2001),
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })

    await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Add post with content exceed limit2',
        content: 'あ'.repeat(2001),
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })
  })
})
