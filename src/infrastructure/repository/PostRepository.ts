import { Post } from '@prisma/client'
import BaseRepository from './BaseRepository'

const ONE_PAGE_NUM = 10

export default class PostRepo extends BaseRepository {
  async add(post: Post): Promise<Post> {
    return await this.prisma.post.create({
      data: post,
      include: {
        author: false,
      },
    })
  }

  async find(id: number): Promise<Post | null> {
    return await this.prisma.post.findFirst({
      where: {
        id: id,
      },
    })
  }

  async userPosts(userId: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }

  async isMyPost(postId: number, userId: number): Promise<boolean> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    })
    return post && userId === post.authorId
  }

  async update(postId: number, title: string, content: string): Promise<Post> {
    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: title,
        content: content,
      },
    })
    return updatedPost
  }

  async getPosts(page: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      skip: (page - 1) * ONE_PAGE_NUM,
      take: ONE_PAGE_NUM,
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }
}
