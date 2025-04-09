import { Card, Divider, Pagination, Space, Tabs } from "antd";
import BookDetails from "./book_details";
import BookCommentList from "./book_comment_list";
import CommentInput from "./comment_input";

export default function BookInfoCard({
                                         pageIndex,
                                         sort,
                                         book,
                                         comments,
                                         onMutate,
                                         onPageChange,
                                         onSortChange,
                                     }) {


    const handleAddComment = (comment) => {
        if (comment === "") {
            alert("评论不得为空！");
            return;
        }
        alert(`评论已发布：${comment}`);
        onMutate(); // 模拟刷新
    };

    const tabItems = [
        { key: "createdTime", label: "最新评论" },
        { key: "like", label: "最热评论" },
    ];

    return (
        <Card className="card-container">
            <Space direction="vertical" style={{ width: "100%" }}>
                <BookDetails book={book}  />
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
                    total={5 * comments.total}
                    onChange={onPageChange}
                />
            </Space>
        </Card>
    );
}
