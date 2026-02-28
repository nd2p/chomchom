interface Story {
  id: string;
  title: string;
}

export const useStories = () => ({ data: [] as Story[] });
