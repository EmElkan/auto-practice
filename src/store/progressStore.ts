import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ChallengeStatus = 'not_started' | 'in_progress' | 'completed'

type ProgressState = {
  challenges: Record<string, ChallengeStatus>
  setStatus: (challengeId: string, status: ChallengeStatus) => void
  getStatus: (challengeId: string) => ChallengeStatus
  resetAll: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      challenges: {},

      setStatus: (challengeId: string, status: ChallengeStatus) => {
        set((state) => ({
          challenges: {
            ...state.challenges,
            [challengeId]: status,
          },
        }))
      },

      getStatus: (challengeId: string) => {
        return get().challenges[challengeId] || 'not_started'
      },

      resetAll: () => {
        set({ challenges: {} })
      },
    }),
    {
      name: 'challenge-progress',
    }
  )
)
