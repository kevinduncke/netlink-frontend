import type { Ref } from "vue";

import { idEquals } from "../idUtils";
import type { FollowUser, Followers, UserProfile } from "../../types/users";
import type { Notification } from "../../types/types";
import type { MutationFeedbackHandler } from "./feedback";

export interface FollowSnapshot {
  userId: string | number;
  isFollowedByMe: boolean;
  followersCount: number;
  suggestedUsers?: FollowUser[];
  followersUsers?: Followers[];
  followingUsers?: FollowUser[];
  selectedUserId?: string | number;
  notifications?: Notification[];
}

export interface FollowState {
  suggestedUsers?: Ref<FollowUser[]>;
  followersUsers?: Ref<Followers[]>;
  followingUsers?: Ref<FollowUser[]>;
  userProfile?: Ref<UserProfile>;
  notifications?: Ref<Notification[]>;
  selectedUserId?: Ref<string | number>;
}

export function createFollowSnapshot(
  userId: string | number,
  userProfile?: UserProfile,
): FollowSnapshot {
  return {
    userId,
    isFollowedByMe: userProfile?.isFollowedByMe ?? false,
    followersCount: userProfile?.followersCount ?? 0,
  };
}

export function applyOptimisticFollow(
  state: FollowState,
  userId: string | number,
  nextIsFollowed: boolean,
) {
  const userProfile = state.userProfile?.value;
  const snapshot = createFollowSnapshot(userId, userProfile);

  snapshot.suggestedUsers = state.suggestedUsers?.value.map((user) => ({ ...user }));
  snapshot.followersUsers = state.followersUsers?.value.map((user) => ({ ...user }));
  snapshot.followingUsers = state.followingUsers?.value.map((user) => ({ ...user }));
  snapshot.selectedUserId = state.selectedUserId?.value;
  snapshot.notifications = state.notifications?.value.map((notification) => ({ ...notification }));

  if (state.suggestedUsers) {
    state.suggestedUsers.value = state.suggestedUsers.value.filter(
      (user) => !idEquals(user.id, userId),
    );
  }

  if (state.followersUsers && nextIsFollowed) {
    state.followersUsers.value = state.followersUsers.value.filter(
      (user) => !idEquals(user.id, userId),
    );
  }

  if (state.followingUsers && !nextIsFollowed) {
    state.followingUsers.value = state.followingUsers.value.filter(
      (user) => !idEquals(user.id, userId),
    );
  }

  if (state.userProfile && userProfile && idEquals(userProfile.id, userId)) {
    state.userProfile.value.isFollowedByMe = nextIsFollowed;
    state.userProfile.value.followersCount = Math.max(
      0,
      (state.userProfile.value.followersCount ?? 0) + (nextIsFollowed ? 1 : -1),
    );
  }

  if (state.notifications) {
    state.notifications.value = state.notifications.value.map((notification) =>
      notification.fromUser?.id !== undefined && idEquals(notification.fromUser.id, userId)
        ? { ...notification, isFollowedByMe: nextIsFollowed }
        : notification,
    );
  }

  return snapshot;
}

export function rollbackOptimisticFollow(
  state: FollowState,
  snapshot: FollowSnapshot | null,
) {
  if (!snapshot) return;

  if (state.suggestedUsers && snapshot.suggestedUsers) {
    state.suggestedUsers.value = snapshot.suggestedUsers;
  }

  if (state.followersUsers && snapshot.followersUsers) {
    state.followersUsers.value = snapshot.followersUsers;
  }

  if (state.followingUsers && snapshot.followingUsers) {
    state.followingUsers.value = snapshot.followingUsers;
  }

  if (state.userProfile && idEquals(state.userProfile.value.id, snapshot.userId)) {
    state.userProfile.value.isFollowedByMe = snapshot.isFollowedByMe;
    state.userProfile.value.followersCount = snapshot.followersCount;
  }

  if (state.selectedUserId && snapshot.selectedUserId !== undefined) {
    state.selectedUserId.value = snapshot.selectedUserId;
  }

  if (state.notifications && snapshot.notifications) {
    state.notifications.value = snapshot.notifications;
  }
}

export interface FollowMutationOptions {
  state: FollowState;
  userId: string | number;
  nextIsFollowed: boolean;
  onRequest: (userId: string | number, nextIsFollowed: boolean) => Promise<void>;
  onFeedback?: MutationFeedbackHandler;
}

export async function runFollowMutation({
  state,
  userId,
  nextIsFollowed,
  onRequest,
  onFeedback,
}: FollowMutationOptions) {
  const snapshot = applyOptimisticFollow(state, userId, nextIsFollowed);

  try {
    await onRequest(userId, nextIsFollowed);
    onFeedback?.({
      kind: "success",
      title: nextIsFollowed ? "Followed user" : "Unfollowed user",
      description: "The follow state was updated successfully.",
    });
  } catch (error) {
    rollbackOptimisticFollow(state, snapshot);
    onFeedback?.({
      kind: "error",
      title: "Could not update follow state",
      description: "The previous state was restored because the request failed.",
      error,
    });

    throw error;
  }
}
