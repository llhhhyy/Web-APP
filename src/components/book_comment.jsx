import { Avatar, List, Space } from "antd";
import UsernameAvatar from "./username_avatar";
import LikeButton from "./like_button";
import CommentInput from "./comment_input";

export default function BookComment({ comment, isReplying, onReply, onMutate }) {
    const replyMessage = comment.reply ? `回复 ${comment.reply}：` : "";

    const handleReply = (e) => {
        e.preventDefault();
        onReply();
    };

    const handleSubmitReply = (content) => {
        if (content === "") {
            alert("回复不得为空！");
            return;
        }
        alert(`回复已提交：${content}（模拟）`);
        onMutate();
    };

    const handleLikeComment = () => {
        alert("已点赞（模拟）");
        return true;
    };

    const handleUnlikeComment = () => {
        alert("已取消点赞（模拟）");
        return true;
    };

    const contentComponent = (
        <Space direction="vertical" style={{ width: "100%" }}>
            <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                {replyMessage}
                {comment.content}
            </p>
            <Space>
                {new Date(comment.createdAt).toLocaleString()}
                <LikeButton
                    defaultNumber={comment.like}
                    liked={comment.liked}
                    onLike={handleLikeComment}
                    onUnlike={handleUnlikeComment}
                />
                <a style={{ color: "grey", fontSize: 14 }} onClick={handleReply}>
                    回复
                </a>
            </Space>
            {isReplying && (
                <CommentInput
                    placeholder={`回复 ${comment.username}：`}
                    onSubmit={handleSubmitReply}
                    autoFocus
                />
            )}
        </Space>
    );

    return (
        <List.Item key={comment.id}>
            <List.Item.Meta
                avatar={
                    comment.avatar ? (
                        <Avatar src={comment.avatar} />
                    ) : (
                        <UsernameAvatar username={comment.username} />
                    )
                }
                title={<div style={{ color: "grey" }}>{comment.username}</div>}
                description={contentComponent}
            />
        </List.Item>
    );
}