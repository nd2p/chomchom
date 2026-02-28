interface HistoryItem {
  id: string;
  title: string;
}

export const useHistory = () => ({ items: [] as HistoryItem[] });
