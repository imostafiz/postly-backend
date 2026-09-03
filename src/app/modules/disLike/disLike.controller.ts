/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import prisma from '../../prisma';

export const toggleDislike = async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  try {
    const existingDislike = await prisma.dislike.findFirst({
      where: { userId: parseInt(userId), postId: parseInt(postId) },
    });

    if (existingDislike) {
      await prisma.dislike.delete({ where: { id: existingDislike.id } });
      return res.status(200).json({ message: 'Dislike removed' });
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId: parseInt(userId), postId: parseInt(postId) },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });

      await prisma.dislike.create({
        data: { userId: parseInt(userId), postId: parseInt(postId) },
      });

      return res.status(200).json({ message: 'Dislike added' });
    }

    await prisma.dislike.create({
      data: { userId: parseInt(userId), postId: parseInt(postId) },
    });

    const updatedPost = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: {
        dislikes: { include: { user: { select: { id: true } } } },
      },
    });

    return res.status(201).json({ message: 'Dislike added', post: updatedPost });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
