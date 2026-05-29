import { describe, expect, it } from "vitest";
import { ref } from "vue";

import {
  applyOptimisticFollow,
  rollbackOptimisticFollow,
  runFollowMutation,
} from "../social";

describe("social follow helpers", () => {
  it("updates and restores follow state", () => {
    const suggestedUsers = ref([
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ] as any[]);
    const notifications = ref([
      {
        id: "n1",
        fromUser: { id: 2 },
        isFollowedByMe: false,
      },
    ] as any[]);

    const snapshot = applyOptimisticFollow(
      {
        suggestedUsers,
        notifications,
      },
      2,
      true,
    );

    expect(suggestedUsers.value).toHaveLength(1);
    expect(suggestedUsers.value[0].id).toBe(1);
    expect(notifications.value[0].isFollowedByMe).toBe(true);

    rollbackOptimisticFollow(
      {
        suggestedUsers,
        notifications,
      },
      snapshot,
    );

    expect(suggestedUsers.value).toHaveLength(2);
    expect(notifications.value[0].isFollowedByMe).toBe(false);
  });

  it("rolls back when the follow request fails", async () => {
    const userProfile = ref({
      id: 2,
      followersCount: 10,
      isFollowedByMe: false,
    } as any);
    const notifications = ref([
      {
        id: "n1",
        fromUser: { id: 2 },
        isFollowedByMe: false,
      },
    ] as any[]);

    await expect(
      runFollowMutation({
        state: { userProfile, notifications },
        userId: 2,
        nextIsFollowed: true,
        onRequest: async () => {
          throw new Error("network failed");
        },
      }),
    ).rejects.toThrow("network failed");

    expect(userProfile.value.isFollowedByMe).toBe(false);
    expect(userProfile.value.followersCount).toBe(10);
    expect(notifications.value[0].isFollowedByMe).toBe(false);
  });
});
