interface BookmarkItem {
  id: string;
  title: string;
}

export const useBookmarks = () => ({ items: [] as BookmarkItem[] });
