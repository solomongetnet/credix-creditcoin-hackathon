export const planLimits = {
  UNAUTHENTICATED: {
    createdCharacters: 0,
    chats: 1,
    messagesPerChat: 10,
  },
  FREE: {
    createdCharacters: 5,
    chats: 10,
    messagesPerChat: 20,
  },
  PLUS: {
    createdCharacters: 1000,
    chats: 100,
    messagesPerChat: 100,
  },
};

export type PlanType = keyof typeof planLimits;

export const planFeatureFlags = {
  UNAUTHENTICATED: {
    themes: false,
    export: false,
    voice_calls: false,
    custom_personality: false,
  },
  FREE: {
    themes: false,
    export: false,
    voice_calls: false,
    custom_personality: false,
  },
  PLUS: {
    themes: true,
    export: true,
    voice_calls: true,
    custom_personality: true,
  },
} satisfies Record<PlanType, Record<string, boolean>>;

export type FeatureFlagKey = keyof (typeof planFeatureFlags)["FREE"];
