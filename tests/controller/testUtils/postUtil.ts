import request, { Response } from 'supertest'
import app from '../../../src/app'

export const addPost = async (
  title: string,
  content: string,
  token: string
): Promise<Response> => {
  return await request(app)
    .post('/api/v1/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: title,
      content: content,
    })
}
