import { $Enums } from "@/generated/prisma";
import { create } from "zustand";

interface Character {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  backgroundUrl: string | null;
  themeId: string | null;
  avatarUrl: string | null;
  description: string;
  tagline: string;
  personality: string;
  prompt: string;
  voiceStyle: string | null;
  visibility: $Enums.CharacterVisibility;
  creatorId: string;
  tags: string | null;
  creator: {
    name: string;
    id: string;
    username: string | null;
  };
  _count: {
    likes: number;
    messages: number;
  };
}

interface CharactersStoreState {
  loadedCharacterIds: string[];
  setLoadedCharactersIds: ({
    newLoadedCharacterIds,
  }: {
    newLoadedCharacterIds: string[];
  }) => void;
  clearLoadedCharactersIds: () => void;

  characters: { hasMore: boolean; data: Character[] };
  setCharacters: ({
    characters,
    hasMore,
  }: {
    characters: Character[];
    hasMore: boolean;
  }) => void;
  clearCharacters: () => void;

  status: {
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };
  setStatus: (status: {
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  }) => void;
}

export const useCharactersStore = create<CharactersStoreState>((set, get) => ({
  loadedCharacterIds: [],
  setLoadedCharactersIds: ({ newLoadedCharacterIds }) => {
    set({
      loadedCharacterIds: [
        ...get().loadedCharacterIds,
        ...newLoadedCharacterIds,
      ],
    });
  },
  clearLoadedCharactersIds: () => {
    set({
      loadedCharacterIds: [],
    });
  },

  characters: { data: [], hasMore: false },
  setCharacters: ({ characters, hasMore }) => {
    set({
      characters: {
        data: [...get().characters.data, ...characters],
        hasMore,
      },
    });
  },
  clearCharacters: () => {
    set({
      characters: {
        data: [],
        hasMore: false,
      },
    });
  },

  status: {
    isLoading: true,
    isError: false,
    isFetching: true,
  },
  setStatus: (status) => {
    set({
      status,
    });
  },
}));
