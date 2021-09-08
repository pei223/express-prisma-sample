import request from 'supertest'
import app from '../../../src/app'

describe('Login test', () => {
  test('Normal sequence', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      email: 'login@test.com',
      username: 'loginuser',
      password: 'loginpasswd',
    })

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'loginuser',
        password: 'loginpasswd',
      })
      .then((res) => {
        expect(res.status).toBe(200)

        const data = res.body
        expect(data.user.email).toBe('login@test.com')
        expect(data.user.username).toBe('loginuser')
        expect(data.user.id).toBeDefined()
        expect(data.user.createdAt).toBeDefined()
        expect(data.user.updatedAt).toBeDefined()
        expect(data.token).toBeDefined()
      })
  })

  test('Try login with invalid password', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      email: 'otherlogin@test.com',
      username: 'otherloginuser',
      password: 'otherloginpw',
    })

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'otherloginuser',
        password: 'dsaklfja90',
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })
  })

  test('Try login with invalid username', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      email: 'otherlogin@test.com',
      username: 'otherloginuser',
      password: 'otherloginpw',
    })

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'fdjsalkfhoge',
        password: 'otherloginpw',
      })
      .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error.code).toBeDefined()
      })
  })
})
