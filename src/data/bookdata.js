// bookdata.js
export const mockBooks = [
    {
        id: 1,
        title: "JavaScript 编程思想",
        author: "张三",
        tag: "编程",
        cover: "https://img3m0.ddimg.cn/4/24/9317290-1_u_6.jpg",
        price: 2990, // 29.90元
        sales: 150,
        tags: [{ name: "编程" }, { name: "JavaScript" }],
        description: "深入探讨 JavaScript 的核心概念和编程思想，适合中高级开发者。",
    },
    {
        id: 2,
        title: "Java 核心技术 卷一",
        author: "李四",
        tag: "编程",
        cover: "https://img3m8.ddimg.cn/7/0/29411818-1_u_28.jpg",
        price: 3990,
        sales: 200,
        tags: [{ name: "编程" }, { name: "Java" }],
        description: "Java 编程的经典教材，涵盖基础到进阶内容。",
    },
    {
        id: 3,
        title: "C++ Primer 中文版（第 5 版）",
        author: "王五",
        tag: "小说", // 这里应该是“编程”，但保留原数据
        cover: "https://img3m5.ddimg.cn/18/16/11186350875-1_u_1.jpg",
        price: 1990,
        sales: 80,
        tags: [{ name: "编程" }, { name: "C++" }],
        description: "C++ 学习的入门经典，全面覆盖语言特性。",
    },
    {
        id: 4,
        title: "一九八四",
        author: "乔治·奥威尔",
        tag: "历史",
        cover: "https://img3m4.ddimg.cn/96/20/25215594-2_u_11.jpg",
        price: 2590,
        sales: 300,
        tags: [{ name: "小说" }, { name: "反乌托邦" }],
        description: "经典的反乌托邦小说，揭示极权社会的恐怖。",
    },
    {
        id: 5,
        title: "Python 编程",
        author: "钱七",
        tag: "编程",
        cover: "https://img3m9.ddimg.cn/25/3/11468685319-1_b_1696299193.jpg",
        price: 3490,
        sales: 120,
        tags: [{ name: "编程" }, { name: "Python" }],
        description: "从入门到精通的 Python 编程指南。",
    },
    {
        id: 6,
        title: "人间失格",
        author: "太宰治",
        tag: "小说",
        cover: "https://img3m5.ddimg.cn/56/4/23761145-1_b_13.jpg",
        price: 1590,
        sales: 250,
        tags: [{ name: "小说" }, { name: "日本文学" }],
        description: "太宰治的自传体小说，深刻剖析人性。",
    },
    {
        id: 7,
        title: "唐朝那些事儿",
        author: "钓雪人",
        tag: "历史",
        cover: "https://img3m7.ddimg.cn/73/5/20822347-1_b_2.jpg",
        price: 2290,
        sales: 90,
        tags: [{ name: "历史" }, { name: "唐朝" }],
        description: "以轻松幽默的方式讲述唐朝历史。",
    },
    {
        id: 8,
        title: "三体",
        author: "刘慈欣",
        tag: "小说",
        cover: "https://upload.wikimedia.org/wikipedia/zh/0/0f/Threebody.jpg",
        price: 4990,
        sales: 500,
        tags: [{ name: "小说" }, { name: "科幻" }],
        description: "中国科幻巅峰之作，描绘宇宙文明的博弈。",
    },
];

export const mockTags = ["编程", "小说", "历史", "全部"];

// 模拟评论数据（适用于所有书籍）
export const generateMockComments = (bookId, pageIndex, pageSize, sort) => {
    const totalComments = 20; // 假设每本书有 20 条评论
    const allComments = Array.from({ length: totalComments }, (_, i) => ({
        id: i + 1,
        userId: (i % 5) + 1, // 模拟 5 个用户循环评论
        username: `用户${(i % 5) + 1}`,
        content: `这是关于书籍 ${bookId} 的第 ${i + 1} 条评论`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(), // 模拟时间递减
        like: Math.floor(Math.random() * 20), // 随机点赞数 (0-19)
        liked: false,
        avatar: null,
        reply: i % 3 === 0 ? `用户${(i % 5) + 2}` : null, // 每 3 条有一条是回复
    }));

    // 根据 sort 排序
    const sortedComments = [...allComments].sort((a, b) => {
        if (sort === "like") return b.like - a.like; // 按点赞数降序
        return new Date(b.createdAt) - new Date(a.createdAt); // 按时间降序
    });

    // 分页
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paginatedComments = sortedComments.slice(start, end);

    return {
        total: totalComments,
        items: paginatedComments,
    };
};

// 模拟用户信息
export const mockUser = {
    id: 1,
    username: "testuser",
    nickname: "测试用户",
    balance: 10000, // 100.00 元
    introduction: "你好，我是一个热爱读书的人！",
    avatar: null,
    email: "testuser@example.com",
};

// 模拟用户的订单数据
export const mockOrders = [
    {
        id: 1,
        bookId: mockBooks[0].id,
        bookTitle: mockBooks[0].title,
        price: mockBooks[0].price,
        quantity: 2,
        status: "已完成",
        createdAt: "2025-03-01T10:00:00Z",
    },
    {
        id: 2,
        bookId: mockBooks[3].id,
        bookTitle: mockBooks[3].title,
        price: mockBooks[3].price,
        quantity: 1,
        status: "待发货",
        createdAt: "2025-04-01T15:30:00Z",
    },
    {
        id: 3,
        bookId: mockBooks[7].id,
        bookTitle: mockBooks[7].title,
        price: mockBooks[7].price,
        quantity: 3,
        status: "已完成",
        createdAt: "2025-02-15T09:15:00Z",
    },
];

// 获取用户的订单数据（带分页）
export const getMockOrders = (pageIndex, pageSize) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paginatedOrders = mockOrders.slice(start, end);

    return {
        total: mockOrders.length,
        items: paginatedOrders,
    };
};

export const initialCartItems = [
    {
        id: 1,
        book: {
            id: 1,
            title: "JavaScript 编程思想",
            author: "张三",
            tag: "编程",
            cover: "https://img3m0.ddimg.cn/4/24/9317290-1_u_6.jpg",
            price: 2990, // 29.90元
            sales: 150,
            tags: [{ name: "编程" }, { name: "JavaScript" }],
            description: "深入探讨 JavaScript 的核心概念和编程思想，适合中高级开发者。",
        },
        number: 2,
    },
    {
        id: 2,
        book: {
            id: 2,
            title: "Java 核心技术 卷一",
            author: "李四",
            tag: "编程",
            cover: "https://img3m8.ddimg.cn/7/0/29411818-1_u_28.jpg",
            price: 3990,
            sales: 200,
            tags: [{ name: "编程" }, { name: "Java" }],
            description: "Java 编程的经典教材，涵盖基础到进阶内容。",
        },
        number: 1,
    },
];