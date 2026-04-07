import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Select, Button, Space, Typography, List, Tag, theme, DatePicker } from "antd";
import { ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import { getStats, getFlaggedLogs } from "../service/log";
import dayjs from "dayjs";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(() => localStorage.getItem("selectedSubject") || "code");
  const [dateRange, setDateRange] = useState(null);
  const [totalFlagged, setTotalFlagged] = useState(0);
  const [flaggedLogs, setFlaggedLogs] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 30;
  const { token } = theme.useToken();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const startTime = dateRange && dateRange[0] ? dateRange[0].toISOString() : null;
      const endTime = dateRange && dateRange[1] ? dateRange[1].toISOString() : null;

      const res = await getStats(subject, startTime, endTime);
      setTotalFlagged(res.flagged_logs);

      setStats([
        {
          label: "Tổng log thu thập",
          value: res.total_logs,
          desc: "Tất cả hành vi ghi nhận",
        },
        {
          label: "Số lượng user",
          value: res.total_distinct_users,
          desc: "User truy cập trong khoảng thời gian",
        },
        {
          label: "Log bị gắn cờ",
          value: res.flagged_logs,
          desc: "Có dấu hiệu nghi vấn",
        },
        {
          label: "User cần xem",
          value: res.users_need_review,
          desc: "Có ≥ 1 nghi vấn",
        },
      ]);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlagged = async () => {
    try {
      const startTime = dateRange && dateRange[0] ? dateRange[0].toISOString() : null;
      const endTime = dateRange && dateRange[1] ? dateRange[1].toISOString() : null;
      const res = await getFlaggedLogs(subject, limit, page * limit, startTime, endTime);
      setFlaggedLogs(res);
    } catch (err) {
      console.error("Failed to load flagged logs", err);
    }
  };

  const handleRefresh = () => {
    setPage(0);
    fetchStats();
    fetchFlagged();
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, dateRange]);

  useEffect(() => {
    fetchFlagged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, page, dateRange]);

  useEffect(() => {
    setPage(0);
  }, [subject, dateRange]);

  const paginationProps = {
    current: page + 1,
    pageSize: limit,
    total: totalFlagged,
    onChange: (newPage) => setPage(newPage - 1),
    showSizeChanger: false,
  };

  return (
    <div>
      {/* FILTER SUBJECT + REFRESH */}
      <Space
        align="center"
        style={{
          marginBottom: 24,
          flexWrap: "wrap",
        }}
        size="middle"
      >
        <Text strong>Lọc chủ đề:</Text>
        <Select
          value={subject}
          onChange={(val) => {
            setSubject(val);
            localStorage.setItem("selectedSubject", val);
          }}
          style={{ width: 160 }}
          options={[
            { value: "code", label: "Lập trình" },
            { value: "trr", label: "Toán rời rạc" },
            { value: "sql", label: "Cơ sở dữ liệu" },
            { value: "ai-challenge", label: "AI-Challenge" },
          ]}
        />
        <RangePicker 
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={["Từ ngày", "Đến ngày"]}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          Làm mới
        </Button>
      </Space>

      {/* STATS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((s) => (
          <Col xs={24} sm={12} md={6} key={s.label}>
            <Card bordered={false} loading={loading}>
              <Statistic
                title={s.label}
                value={s.value}
                valueStyle={{ fontWeight: "bold", fontSize: "2rem" }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {s.desc}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* RECENT FLAGS */}
      <Card
        title="Log nghi vấn gần nhất"
        bordered={false}
        extra={<WarningOutlined style={{ color: token.colorWarning }} />}
      >
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={flaggedLogs}
          pagination={flaggedLogs.length > 0 ? paginationProps : false}
          renderItem={(log) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{log.username}</Text>
                    <Text type="secondary">{log.fullname}</Text>
                    <Tag color="gold">{log.title}</Tag>
                  </Space>
                }
                description={new Date(log.time + "Z").toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              />
            </List.Item>
          )}
          locale={{ emptyText: "Không có log nghi vấn" }}
        />
      </Card>
    </div>
  );
}
