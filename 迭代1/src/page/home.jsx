import { Card, Col, Row, Select, Space, Tag } from "antd";
import { PrivateLayout } from "../components/layout";
import BookList from "../components/book_list";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TagOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import { mockBooks, mockTags } from "../data/bookdata";
import { Carousel } from 'antd';
import "../css/home.css"
import car1 from "../image/car1.png"
import car2 from "../image/car2.png"
import car3 from "../image/car3.png"
import car4 from "../image/car4.png"

const { Search } = Input;

export default function HomePage() {
    const [books, setBooks] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [selectedTag, setSelectedTag] = useState("");
    const [tags] = useState(mockTags);
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const pageIndex = searchParams.get("pageIndex") != null ? Number.parseInt(searchParams.get("pageIndex")) : 0;
    const pageSize = searchParams.get("pageSize") != null ? Number.parseInt(searchParams.get("pageSize")) : 5;
    const searchRef = useRef(null);

    useEffect(() => {
        const filterBooks = () => {
            let filteredBooks = mockBooks;

            // 如果选择了具体标签（非“全部”），按标签过滤
            if (selectedTag && selectedTag !== "全部") {
                filteredBooks = filteredBooks.filter(book => book.tag === selectedTag);
            }

            // 按关键字过滤
            if (keyword) {
                filteredBooks = filteredBooks.filter(book =>
                    book.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    book.author.toLowerCase().includes(keyword.toLowerCase())
                );
            }

            const total = Math.ceil(filteredBooks.length / pageSize);
            const start = pageIndex * pageSize;
            const end = start + pageSize;
            const pagedBooks = filteredBooks.slice(start, end);

            setBooks(pagedBooks);
            setTotalPage(total);
        };
        filterBooks();
    }, [selectedTag, keyword, pageIndex, pageSize]);

    const handleSearch = (keyword) => {
        setSearchParams({
            keyword,
            pageIndex: "0",
            pageSize: "5"
        });
    };

    const handlePageChange = (page) => {
        setSearchParams({
            keyword,
            pageIndex: (page - 1).toString(),
            pageSize: pageSize.toString()
        });
    };

    const handleSelectTag = (tag) => {
        setSelectedTag(tag);
        setSearchParams({
            keyword,
            pageIndex: "0",
            pageSize: pageSize.toString()
        });
        searchRef.current?.focus();
    };

    return (
        <PrivateLayout>
            {/*<div style={{ height: '300px' }}>*/}
                <Carousel
                    autoplay={{
                        dotDuration: true,
                    }}
                    autoplaySpeed={5000}
                    dots={true}
                >
                    <div>
                        <img
                            src={car1}
                            alt="Bookshelf with Warm Lighting"
                            className="contentStyle"
                        />
                    </div>
                    <div>
                        <img
                            src={car2}
                            alt="E-reader with Coffee"
                            className="contentStyle"
                        />
                    </div>
                    <div>
                        <img
                            src={car3}
                            alt="Fantasy Book Scene"
                            className="contentStyle"
                        />
                    </div>
                    <div>
                        <img
                            src={car4}
                            alt="People Reading Outdoors"
                            className="contentStyle"
                        />
                    </div>
                </Carousel>
            {/*</div>*/}

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
                            />
                        </Col>
                        <Col span={2}>
                            <Select
                                size="large"
                                style={{ width: "100px" }}
                                placeholder={<Space><TagOutlined />标签</Space>}
                                options={tags.map(tag => ({
                                    label: <Tag>{tag}</Tag>,
                                    value: tag
                                }))}
                                onChange={handleSelectTag}
                            />
                        </Col>
                    </Row>
                    <BookList
                        books={books}
                        pageSize={pageSize}
                        total={totalPage * pageSize}
                        current={pageIndex + 1}
                        onPageChange={handlePageChange}
                    />
                </Space>
            </Card>
        </PrivateLayout>
    );
}