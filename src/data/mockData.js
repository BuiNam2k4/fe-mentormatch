export const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: "Nguyễn Văn B",
      avatar: "https://i.pravatar.cc/150?u=vanb",
      role: "Cần tìm Mentor",
    },
    time: "10 phút trước",
    title: "Cần tìm mentor hướng dẫn về Golang",
    content: "Mình đang tìm kiếm mentor có kinh nghiệm về Golang để hướng dẫn project thực tế về Microservices. Ưu tiên các bạn đã từng làm việc với Kubernetes và gRPC. Các bạn ở Hà Nội offline được thì càng tốt ạ!",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    likes: 12,
    comments: 5,
    actionText: "Liên hệ ngay",
  },
  {
    id: 2,
    author: {
      name: "Trần Thị C",
      avatar: "https://i.pravatar.cc/150?u=tranthic",
      role: "Mở lớp mới",
      isMentor: true,
    },
    time: "2 giờ trước",
    title: "Mở lớp hướng dẫn UI/UX cho người mới",
    content: "Khoá học 8 buổi tập trung vào tư duy thiết kế và công cụ Figma. Dành cho các bạn đang muốn chuyển ngành hoặc sinh viên muốn tìm hiểu sâu về UX. Số lượng giới hạn 5 người để đảm bảo chất lượng.",
    image: null,
    likes: 28,
    comments: 14,
    actionText: "Đăng ký học",
  }
];

export const MOCK_TOP_MENTORS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?u=nguyenvana",
    tag: "FRONTEND",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Lê Thị D",
    avatar: "https://i.pravatar.cc/150?u=lethid",
    tag: "BACKEND",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Hoàng Quốc E",
    avatar: "https://i.pravatar.cc/150?u=hoangquoce",
    tag: "DATA SCIENCE",
    rating: 5.0,
  }
];

export const MOCK_TAGS = ["#Golang", "#UIUX", "#ReactJS", "#CareerAdvice"];

export const MOCK_SEARCH_MENTORS = [
  {
    id: 1,
    name: "Nguyễn Văn Nam",
    role: "Senior Java Developer @ TechCorp",
    avatar: "https://i.pravatar.cc/150?u=nam",
    isVerified: true,
    rating: 4.9,
    students: 128,
    price: "450k",
    tags: ["Java", "Spring Boot", "Microservices", "MySQL"],
    description: "Với hơn 8 năm kinh nghiệm trong phát triển hệ thống Backend quy mô lớn. Mình sẽ giúp bạn làm chủ Java Core, Spring Framework và tư duy giải quyết vấn đề thực chiến trong dự án.",
    responseTime: "Phản hồi trong 1h",
    availability: "3 buổi trống/tuần",
    isOnline: true,
  },
  {
    id: 2,
    name: "Trần Thị Minh Anh",
    role: "Product Designer @ CreativeLab",
    avatar: "https://i.pravatar.cc/150?u=minhanh",
    isVerified: true,
    rating: 5.0,
    students: 86,
    price: "350k",
    tags: ["UI/UX Design", "Figma", "Web Design"],
    description: "Chuyên gia thiết kế sản phẩm với tư duy User-Centric. Đồng hành cùng bạn từ lý thuyết căn bản đến khi hoàn thiện Portfolio chuyên nghiệp để ứng tuyển vào các tập đoàn lớn.",
    responseTime: "Phản hồi trong 15p",
    availability: "Luôn sẵn sàng",
    isOnline: false,
  },
  {
    id: 3,
    name: "Lê Hoàng Long",
    role: "IELTS 8.5 | TESOL Certified",
    avatar: "https://i.pravatar.cc/150?u=long",
    isVerified: true,
    rating: 4.8,
    students: 210,
    price: "600k",
    tags: ["IELTS", "Giao tiếp", "Academic Writing"],
    description: "Phương pháp học tiếng Anh hiện đại, tập trung vào thực hành. Đặc biệt mạnh về kỹ năng Writing và Speaking, giúp học viên bứt phá band điểm từ 5.5 lên 7.0+ chỉ trong 3 tháng.",
    responseTime: "Phản hồi trong 24h",
    availability: "Cuối tuần",
    isOnline: true,
  }
];

export const MOCK_FILTER_SKILLS = ["Java", "React", "Python", "UI/UX Design", "IELTS"];
