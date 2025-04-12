import { useParams, useSearchParams } from "react-router-dom";
import BookInfoCard from "../components/book_info_card";
import { useEffect, useState } from "react";
import { PrivateLayout } from "../components/layout";
import { mockBooks, generateMockComments } from "../data/bookdata";

export default function BookPage() {
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = Number.parseInt(searchParams.get("pageIndex") ?? "0");
    const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "5");
    const sort = searchParams.get("sort") ?? "createdTime";

    let { id } = useParams();

    useEffect(() => {
        const selectedBook = mockBooks.find((b) => b.id === parseInt(id)) || mockBooks[0]; // 默认显示第一本书
        setBook(selectedBook);

        const mockComments = generateMockComments(id, pageIndex, pageSize, sort);
        setComments(mockComments);
    }, [id, pageIndex, sort]);

    const handleMutate = () => {
        const mockComments = generateMockComments(id, pageIndex, pageSize, sort);
        setComments(mockComments); // 模拟刷新评论
    };

    const handlePageChange = (page) => {
        setSearchParams({
            pageIndex: page - 1,
            pageSize,
            sort,
        });
    };

    const handleSortChange = (sort) => {
        setSearchParams({
            pageIndex: 0,
            pageSize,
            sort,
        });
    };

    return (
        <PrivateLayout>
            {book && comments && (
                <BookInfoCard
                    pageIndex={pageIndex}
                    sort={sort}
                    book={book}
                    comments={comments}
                    onMutate={handleMutate}
                    onPageChange={handlePageChange}
                    onSortChange={handleSortChange}
                />
            )}
        </PrivateLayout>
    );
}