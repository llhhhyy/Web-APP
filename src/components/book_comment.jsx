import { Avatar, List, Space } from "antd";
import UsernameAvatar from "./username_avatar";
import LikeButton from "./like_button";
import CommentInput from "./comment_input";
import axios from "axios";
import { BASEURL } from "../service/common";
import { message } from "antd";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function BookComment({ comment, isReplying, onReply, onMutate }) {
    const { user } = useContext(UserContext);
    const replyMessage = comment.reply ? `回复 ${comment.reply}：` : "";

    const handleReply = (e) => {
        e.preventDefault();
        onReply();
    };

    const handleSubmitReply = async (content) => {
        if (content === "") {
            message.error("回复不得为空！");
            return;
        }
        try {
            const response = await axios.post(`${BASEURL}/comments/add/${comment.id}`, {
                content,
                username: user?.username || "匿名用户",
            });
            if (response.data.code === 200) {
                message.success("回复提交成功");
                onMutate();
            } else {
                message.error("回复提交失败：" + response.data.message);
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
        }
    };

    const handleLikeComment = async () => {
        if (!user?.id) {
            message.error("请先登录");
            return false;
        }
        try {
            const response = await axios.put(`${BASEURL}/comments/${comment.id}/like`, {
                userId: user.id,
            });
            if (response.data.code === 200) {
                message.success("点赞成功");
                onMutate({
                    ...comment,
                    likes: response.data.data.likes,
                    liked: response.data.data.liked,
                });
                return true;
            } else {
                message.error(`点赞失败：${response.data.message || "未知错误"}`);
                return false;
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
            return false;
        }
    };

    const handleUnlikeComment = async () => {
        if (!user?.id) {
            message.error("请先登录");
            return false;
        }
        try {
            const response = await axios.put(`${BASEURL}/comments/${comment.id}/unlike`, {
                userId: user.id,
            });

            if (response.data.code === 200) {
                message.success("取消点赞成功");
                onMutate({
                    ...comment,
                    likes: response.data.data.likes,
                    liked: response.data.data.liked,
                });
                return true;
            } else {
                message.error(`取消点赞失败：${response.data.message || "未知错误"}`);
                return false;
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
            return false;
        }
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
                    defaultNumber={comment.likes}
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