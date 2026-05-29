import { describe, expect, it, vi } from "vitest";

import { applyOptimisticLike, rollbackOptimisticLike, runLikeMutation } from "../posts";

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
