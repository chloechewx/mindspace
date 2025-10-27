import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunityActivity, CommunityGroup, ForumPost } from '../types';

interface CommunityState {
  activities: CommunityActivity[];
  groups: CommunityGroup[];
  forumPosts: ForumPost[];
  registeredActivities: string[];
  joinedGroups: string[];
  
  registerForActivity: (activityId: string) => void;
  unregisterFromActivity: (activityId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  addForumPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'replies' | 'likes'>) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      activities: [],
      groups: [],
      forumPosts: [],
      registeredActivities: [],
      joinedGroups: [],

      registerForActivity: (activityId) =>
        set((state) => ({
          registeredActivities: [...state.registeredActivities, activityId],
          activities: state.activities.map((a) =>
            a.id === activityId ? { ...a, registered: a.registered + 1 } : a
          ),
        })),

      unregisterFromActivity: (activityId) =>
        set((state) => ({
          registeredActivities: state.registeredActivities.filter(
            (id) => id !== activityId
          ),
          activities: state.activities.map((a) =>
            a.id === activityId ? { ...a, registered: a.registered - 1 } : a
          ),
        })),

      joinGroup: (groupId) =>
        set((state) => ({
          joinedGroups: [...state.joinedGroups, groupId],
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, memberCount: g.memberCount + 1 } : g
          ),
        })),

      leaveGroup: (groupId) =>
        set((state) => ({
          joinedGroups: state.joinedGroups.filter((id) => id !== groupId),
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, memberCount: g.memberCount - 1 } : g
          ),
        })),

      addForumPost: (post) =>
        set((state) => ({
          forumPosts: [
            {
              ...post,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              replies: 0,
              likes: 0,
            },
            ...state.forumPosts,
          ],
        })),
    }),
    {
      name: 'community-storage',
    }
  )
);
