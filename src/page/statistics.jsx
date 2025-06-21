import React, { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Table } from "antd";
import { PrivateLayout } from "../components/layout";
import axios from "axios";
import { BASEURL } from "../service/common";
import { UserContext } from "../lib/context";
import { message } from "antd";
import { Bar } from '@ant-design/charts';

function StatisticsPage() {
    const { user } = useContext(UserContext);
    const [salesData, setSalesData] = useState([]);
    const [consumptionData, setConsumptionData] = useState([]);
    const [salesLoading, setSalesLoading] = useState(false);
    const [consumptionLoading, setConsumptionLoading] = useState(false);

    const fetchSalesRank = async () => {
        try {
            setSalesLoading(true);
            const response = await axios.get(`${BASEURL}/books/salesRank`);
            if (response.data.code === 200) {
                const books = response.data.data;
                const chartData = books.map(book => ({
                    title: book.title,
                    sales: book.sales
                }));
                setSalesData(chartData);
            } else {
                message.error("获取销量数据失败：" + response.data.message);
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
        } finally {
            setSalesLoading(false);
        }
    };

    const fetchConsumptionRanking = async () => {
        try {
            setConsumptionLoading(true);
            const response = await axios.get(`${BASEURL}/users/consumption-ranking`);
            if (response.data.code === 200) {
                // 格式化消费金额为两位小数
                const formattedData = response.data.data.map(item => ({
                    ...item,
                    totalConsumption: parseFloat(item.totalConsumption.toFixed(2))
                }));
                setConsumptionData(formattedData);
            } else {
                message.error("获取消费排行榜失败：" + response.data.message);
            }
        } catch (error) {
            message.error("网络错误，请稍后重试");
        } finally {
            setConsumptionLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.id) {
            message.error("请先登录");
            return;
        }
        fetchSalesRank();
        fetchConsumptionRanking();
    }, [user]);

    const salesColumns = [
        {
            title: '书名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '销量',
            dataIndex: 'sales',
            key: 'sales',
        },
    ];

    const consumptionColumns = [
        {
            title: '排名',
            key: 'rank',
            render: (text, record, index) => index + 1,
            align: 'center',
            width: 80,
        },
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
            align: 'center',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '消费总额 (¥)',
            dataIndex: 'totalConsumption',
            key: 'totalConsumption',
            align: 'center',
            render: (amount) => amount.toFixed(2),
            sorter: (a, b) => a.totalConsumption - b.totalConsumption,
        },
    ];

    const salesConfig = {
        data: salesData,
        xField: 'sales',
        yField: 'title',
        seriesField: 'title',
        legend: false,
        meta: {
            sales: { alias: '销量' },
        },
        yAxis: {
            label: null,
        },
    };

    return (
        <PrivateLayout>
            <div className="statistics-page">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title="图书销量数据" loading={salesLoading} className="card-container">
                            <Table
                                columns={salesColumns}
                                dataSource={salesData}
                                pagination={false}
                                rowKey="title"
                                className="sales-table"
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="图书销量排行榜" loading={salesLoading} className="card-container">
                            <div className="chart-container">
                                <Bar {...salesConfig} />
                            </div>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card
                            title="用户消费排行榜"
                            loading={consumptionLoading}
                            className="card-container"
                            extra={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>按消费总额降序排列</span>}
                        >
                            <Table
                                columns={consumptionColumns}
                                dataSource={consumptionData}
                                rowKey="userId"
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 'max-content' }}
                                bordered
                                size="middle"
                                className="consumption-table"
                                summary={pageData => {
                                    const total = consumptionData.reduce((sum, item) => sum + item.totalConsumption, 0);
                                    return (
                                        <Table.Summary fixed>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={4} align="right">
                                                    <strong>所有用户消费总额</strong>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1} align="center">
                                                    <strong style={{ color: '#f5222d' }}>¥{total.toFixed(2)}</strong>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                    );
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </PrivateLayout>
    );
}

export default StatisticsPage;