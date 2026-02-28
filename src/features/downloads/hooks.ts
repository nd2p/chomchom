interface DownloadItem {
  id: string;
  title: string;
}

export const useDownloads = () => ({ list: [] as DownloadItem[] });
