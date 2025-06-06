import { Card, Col, Row, Select, Space, Tag } from "antd";
import { PrivateLayout } from "../components/layout";
import BookList from "../components/book_list";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TagOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { Carousel } from "antd";
import axios from "axios"; // 引入 axios
import { BASEURL } from "../service/common"; // 假设 BASEURL 已定义
import "../css/home.css";
import car1 from "../image/car1.png";
import car2 from "../image/car2.png";
import car3 from "../image/car3.png";
import car4 from "../image/car4.png";
import {hasUnreliableEmptyValue} from "@testing-library/user-event/dist/utils";
import useMessage from "antd/es/message/useMessage";

const { Search } = Input;
axios.defaults.withCredentials = true; // 全局启用 withCredentials，确保发送 cookie
export default function HomePage() {
    const [books, setBooks] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [loading, setLoading] = useState(false); // 新增加载状态
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const pageIndex = searchParams.get("pageIndex") != null ? Number.parseInt(searchParams.get("pageIndex")) : 0;
    const pageSize = searchParams.get("pageSize") != null ? Number.parseInt(searchParams.get("pageSize")) : 5;
    const searchRef = useRef(null);
    const [messageApi, contextHolder] = useMessage();

    // 获取所有标签
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${BASEURL}/books/tags`);
                if (response.data.code === 200) {
                    setTags(["全部", ...response.data.data]); // 添加“全部”选项
                } else {
                    console.error("获取标签失败");
                }
            } catch (error) {
                console.error("获取标签失败：", error);
            }
        };
        fetchTags();
    }, [messageApi]);

    // 获取书籍列表
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // 构造查询参数
                const params = {
                    pageIndex,
                    pageSize,
                    keyword: keyword || undefined,
                    tag: selectedTag && selectedTag !== "全部" ? selectedTag : undefined,
                };

                // 调用后端接口
                const response = await axios.get(`${BASEURL}/books/find`, { params });
                if (response.data.code === 200) {
                    setBooks(response.data.data);
                    setTotalPage(Math.ceil(response.data.total / pageSize)); // 假设后端返回 total 字段
                } else {
                    console.error("获取书籍失败");
                    setBooks([]);
                    setTotalPage(0);
                }
            } catch (error) {
                console.error("获取书籍失败：", error);
                setBooks([]);
                setTotalPage(0);
            }
        };
        fetchBooks();
    }, [selectedTag, keyword, pageIndex, pageSize, messageApi]);

    const handleSearch = (keyword) => {
        setSearchParams({
            keyword,
            pageIndex: "0",
            pageSize: "5",
        });
    };

    const handlePageChange = (page) => {
        setSearchParams({
            keyword,
            pageIndex: (page - 1).toString(),
            pageSize: pageSize.toString(),
        });
    };

    const handleSelectTag = (tag) => {
        setSelectedTag(tag);
        setSearchParams({
            keyword,
            pageIndex: "0",
            pageSize: pageSize.toString(),
        });
        searchRef.current?.focus();
    };

    return (
        <PrivateLayout>
            <Carousel autoplay autoplaySpeed={5000} dots={true}>
                <div>
                    <img src={car1} alt="Bookshelf with Warm Lighting" className="contentStyle" />
                </div>
                <div>
                    <img src={car2} alt="E-reader with Coffee" className="contentStyle" />
                </div>
                <div>
                    <img src={car3} alt="Fantasy Book Scene" className="contentStyle" />
                </div>
                <div>
                    <img src={car4} alt="People Reading Outdoors" className="contentStyle" />
                </div>
            </Carousel>

            <Card className="card-container">
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Row justify="center" gutter={10}>
                        <Col span={8}>
                            <Search
                                ref={searchRef}
                                placeholder="输入关键字"
                                onSearch={handleSearch}
                                enterButton
                                size="large"
                                loading={loading}
                            />
                        </Col>
                        <Col span={2}>
                            <Select
                                size="large"
                                style={{ width: "100px" }}
                                placeholder={
                                    <Space>
                                        <TagOutlined />
                                        标签
                                    </Space>
                                }
                                options={tags.map((tag) => ({
                                    label: <Tag>{tag}</Tag>,
                                    value: tag,
                                }))}
                                onChange={handleSelectTag}
                                value={selectedTag || "全部"}
                                loading={loading}
                            />
                        </Col>
                    </Row>
                    <BookList
                        books={books}
                        pageSize={pageSize}
                        total={totalPage * pageSize}
                        current={pageIndex + 1}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                </Space>
            </Card>
        </PrivateLayout>
    );
}