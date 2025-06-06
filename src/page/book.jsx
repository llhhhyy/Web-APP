import { useParams, useSearchParams } from "react-router-dom";
import BookInfoCard from "../components/book_info_card";
import { useEffect, useState } from "react";
import { PrivateLayout } from "../components/layout";
import axios from "axios";
import { BASEURL } from "../service/common";
import { message } from "antd";

export default function BookPage() {
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = Number.parseInt(searchParams.get("pageIndex") ?? "0");
    const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "5");
    const sort = searchParams.get("sort") ?? "createdTime";
    const { id } = useParams();

    useEffect(() => {
        // 获取书籍详情
        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASEURL}/books/find/${id}`);
                if (response.data.code === 200) {
                    setBook(response.data.data);
                } else {
                    message.error("获取书籍详情失败");
                }
            } catch (error) {
                message.error("网络错误，请稍后重试");
            } finally {
                setLoading(false);
            }
        };

        // 获取评论列表
        const fetchComments = async () => {
            try {
                setLoading(true);
                const params = { pageIndex, pageSize, sort };
                const response = await axios.get(`${BASEURL}/books/get/${id}/comments`, { params });
                if (response.data.code === 200) {
                    setComments({
                        items: response.data.data,
                        total: response.data.total || response.data.data.length, // 假设后端返回 total
                    });
                } else {
                    message.error("获取评论失败");
                }
            } catch (error) {
                message.error("网络错误，请稍后重试");
                setComments({ items: [], total: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
        fetchComments();
    }, [id, pageIndex, pageSize, sort]);

    const handleMutate = () => {
        // 触发评论刷新
        const fetchComments = async () => {
            try {
                const params = { pageIndex, pageSize, sort };
                const response = await axios.get(`${BASEURL}/books/get/${id}/comments`, { params });
                if (response.data.code === 200) {
                    setComments({
                        items: response.data.data,
                        total: response.data.total || response.data.data.length,
                    });
                }
            } catch (error) {
                message.error("刷新评论失败");
            }
        };
        fetchComments();
    };

    const handlePageChange = (page) => {
        setSearchParams({
            pageIndex: (page - 1).toString(),
            pageSize: pageSize.toString(),
            sort,
        });
    };

    const handleSortChange = (sort) => {
        setSearchParams({
            pageIndex: "0",
            pageSize: pageSize.toString(),
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
                    loading={loading}
                />
            )}
        </PrivateLayout>
    );
}