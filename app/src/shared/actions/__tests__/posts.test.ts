import { describe, expect, it, vi } from "vitest";

import { applyOptimisticLike, rollbackOptimisticLike, runCreatePost, runLikeMutation } from "../posts";

describe("post like helpers", () => {
  it("updates and restores like state", () => {
    const post = {
      id: 10,
      author: { liked: false },
      _count: { likes: 3 },
    } as any;

    const snapshot = applyOptimisticLike(post, true);

    expect(post.author.liked).toBe(true);
    expect(post._count.likes).toBe(4);

    rollbackOptimisticLike(post, snapshot);

    expect(post.author.liked).toBe(false);
    expect(post._count.likes).toBe(3);
  });

  it("emits failure feedback and rolls back on request errors", async () => {
    const post = {
      id: 20,
      author: { liked: false },
      _count: { likes: 1 },
    } as any;
    const onFeedback = vi.fn();

    await expect(
      runLikeMutation({
        post,
        nextLiked: true,
        onRequest: async () => {
          throw new Error("like failed");
        },
        onFeedback,
      }),
    ).rejects.toThrow("like failed");

    expect(post.author.liked).toBe(false);
    expect(post._count.likes).toBe(1);
    expect(onFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "error" }),
    );
  });
});

describe("create post helpers", () => {
  it("preserves optimistic nested fields when the server response is partial", async () => {
    const posts = {
      value: [
        {
          id: "temp-1",
          author: {
            id: 5,
            name: "Alex",
            username: "alex",
            bio: "",
            followers: 0,
            liked: false,
          },
          repostedBy: {
            id: 5,
            name: "Alex",
            username: "alex",
            bio: "",
            followers: 0,
            liked: false,
          },
          _count: { likes: 0, comments: 0, shares: 0 },
          comments: [],
          mentions: [],
        },
      ],
    } as any;

    await runCreatePost({
      posts,
      post: posts.value[0],
      onRequest: async () => ({
        id: 99,
        content: "hello",
        createdAt: new Date().toISOString(),
      } as any),
    });

    expect(posts.value[0].author.username).toBe("alex");
    expect(posts.value[0].author.name).toBe("Alex");
    expect(posts.value[0].id).toBe(99);
  });
});
