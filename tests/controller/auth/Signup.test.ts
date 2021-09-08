import request from 'supertest'
import app from '../../../src/app'

describe('Signup Controller', () => {
  test('signup', async () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'signup@test.com',
        username: 'signupuser',
        password: 'signuppasswd',
      })
      .then((res) => {
        expect(res.status).toBe(200)

        const data = res.body
        expect(data.user.email).toBe('signup@test.com')
        expect(data.user.username).toBe('signupuser')
        expect(data.user.id).toBeDefined()
        expect(data.user.createdAt).toBeDefined()
        expect(data.user.updatedAt).toBeDefined()
      })
  })

  test('signup with invalid params(email)', async () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email:
          '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891',
        username: 'invalidemail',
        password: 'signuppasswd',
      })
      .expect(400)
  })

  test('signup with invalid params(username)', async () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'invalidusername@test.com',
        username:
          '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891',
        password: 'signuppasswd',
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('signup with duplicate email', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      email: 'duplicateemail@test.com',
      username: 'duplicateemail',
      password: 'signuppasswd',
    })
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'duplicateemail@test.com',
        username: 'duplicateemail2',
        password: 'signuppasswd',
      })
      .then((res) => {
        expect(res.status).toBe(409)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('signup with duplicate username', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      email: 'duplicateeusername@test.com',
      username: 'duplicateusername',
      password: 'duplicateusernamepw',
    })
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'duplicateeusername2@test.com',
        username: 'duplicateusername',
        password: 'duplicateusernamepw',
      })
      .then((res) => {
        expect(res.status).toBe(409)
        expect(res.body.error.code).toBeDefined()
      })
  })
})
