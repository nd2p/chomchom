export interface Story {
  id: string;
  title: string;
  author: string;
  cover: string;
  description?: string;
  chapters: number;
  views: number;
  rating: number;
  isCompleted: boolean;
}

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'Yêu Anh Từ Lần Gặp Đầu Tiên',
    author: 'Nguyễn Minh Châu',
    cover: 'https://via.placeholder.com/150x200?text=Story+1',
    description: 'Một tình yêu bắt đầu từ lần gặp gỡ tình cờ',
    chapters: 45,
    views: 5000,
    rating: 4.5,
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Vương Quốc Của Những Giấc Mơ',
    author: 'Trần Thảo Linh',
    cover: 'https://via.placeholder.com/150x200?text=Story+2',
    description: 'Hành trình khám phá thế giới kỳ bí đầy phép thuật',
    chapters: 32,
    views: 3200,
    rating: 4.2,
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Gặp Anh Là Hạnh Phúc',
    author: 'Lê Hương Giang',
    cover: 'https://via.placeholder.com/150x200?text=Story+3',
    description: 'Câu chuyện tình yêu ngọt ngào và nước mắt',
    chapters: 28,
    views: 2100,
    rating: 4.8,
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Bí Ẩn Đằng Sau Lầu Xanh',
    author: 'Hoàng Văn Tùng',
    cover: 'https://via.placeholder.com/150x200?text=Story+4',
    description: 'Những điều bí mật chờ khám phá',
    chapters: 50,
    views: 7800,
    rating: 4.6,
    isCompleted: true,
  },
  {
    id: '5',
    title: 'Pháp Sư Trong Thế Giới Loạn',
    author: 'Phạm Quốc Anh',
    cover: 'https://via.placeholder.com/150x200?text=Story+5',
    description: 'Cuộc phiêu lưu của một pháp sư tài ba',
    chapters: 60,
    views: 9200,
    rating: 4.9,
    isCompleted: false,
  },
  {
    id: '6',
    title: 'Đấu Tranh Để Sống Sót',
    author: 'Vũ Hồng Nhân',
    cover: 'https://via.placeholder.com/150x200?text=Story+6',
    description: 'Hành trình sinh tồn đầy kịch tính và hồi hộp',
    chapters: 35,
    views: 4500,
    rating: 4.3,
    isCompleted: true,
  },
];

// Section-specific stories
export const recommendedStories = mockStories.slice(0, 3);
export const recentlyReadStories = mockStories.slice(1, 4);
export const popularStories = mockStories.filter((_, i) => i % 2 === 0);
