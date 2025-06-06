import { Card, Divider, Pagination, Space, Tabs } from "antd";
import BookDetails from "./book_details";
import BookCommentList from "./book_comment_list";
import CommentInput from "./comment_input";
import axios from "axios";
import { BASEURL } from "../service/common";
import { message } from "antd";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function BookInfoCard({
                                         pageIndex,
                                         sort,
                                         book,
                                         comments,
                                         onMutate,
                                         onPageChange,
                                         onSortChange,
                                         loading,
                                     }) {
    const { user } = useContext(UserContext); // 获取当前用户信息

    const handleAddComment = async (comment) => {
        if (comment === "") {
            message.error("评论不得为空！");
            return;
        }
        try {
            const response = await axios.post(`${BASEURL}/books/add/${book.id}/comments`, {
                content: comment,
                username: user?.username || "匿名用户",
            });
            if (response.data.code === 200) {
                message.success("评论发布成功");
                onMutate(); // 刷新评论列表
            } else {
                message.error("评论发布失败：" + response.data.message);
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
        }
    };

    const tabItems = [
        { key: "createdTime", label: "最新评论" },
        { key: "like", label: "最热评论" },
    ];

    return (
        <Card className="card-container" loading={loading}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <BookDetails book={book} />
                <div style={{ margin: 20 }}>
                    <Divider>书籍评论</Divider>
                    <Tabs
                        items={tabItems}
                        defaultActiveKey={sort}
                        onChange={(sort) => onSortChange(sort)}
                    />
                    <CommentInput
                        placeholder="发布一条友善的评论"
                        onSubmit={handleAddComment}
                    />
                    <BookCommentList comments={comments.items} onMutate={onMutate} />
                </div>
                <Pagination
                    current={pageIndex + 1}
                    pageSize={5}
                    total={comments.total}
                    onChange={onPageChange}
                />
            </Space>
        </Card>
    );
}