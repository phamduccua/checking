import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getLogs, deleteLogsBySubject } from "../service/log";

// Trình duyệt
const riskyBrowsers = [
  /chrome/i,
  /coccoc/i,
  /edge|msedge/i,
  /firefox/i,
  /brave/i,
];

// App nhắn tin / MXH
const riskyMessengers = [
  /zalo/i,
  /messenger/i,
  /facebook\s*messenger/i,
  /telegram|tele/i,
  /instagram|insta/i,
  /whatsapp|whatapp/i,
  /discord/i,
  /skype/i,
  /viber/i,
  /slack/i,
  /teams|microsoft\s*teams/i,
  /line/i,
  /signal/i,
];

const riskyApps = [...riskyBrowsers, ...riskyMessengers];

const SUBJECT_LABELS = {
  code: "Lập trình",
  trr: "Toán rời rạc",
  sql: "Cơ sở dữ liệu",
  "ai-challenge": "AI Challenge",
};

const { Text } = Typography;

export default function LogsPage() {
  const [filters, setFilters] = useState({
    username: "",
    app: "",
    title: "",
    subject: localStorage.getItem("selectedSubject") || "code",
    flag: "",
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const limit = 30;
  const [page, setPage] = useState(0); // internally using page to calculate offset
  const offset = page * limit;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs(
        filters.username,
        filters.app,
        filters.title,
        filters.subject,
        filters.flag,
        limit,
        offset
      );
      setLogs(data || []);
    } catch (err) {
      console.error("Fetch logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // fetch on page change

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    if (page !== 0) {
      setPage(0);
    } else {
      fetchLogs();
    }
  };

  const handleRefresh = () => {
    if (page !== 0) {
      setPage(0);
    } else {
      fetchLogs();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteLogsBySubject(filters.subject);
      if (page !== 0) {
        setPage(0);
      } else {
        fetchLogs();
      }
    } catch (err) {
      console.error("Delete logs failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <Text type="secondary">
          {new Date(time + "Z").toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          })}
        </Text>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (text) => <Text strong style={{ whiteSpace: "nowrap" }}>{text}</Text>,
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      align: "center",
    },
    {
      title: "App",
      dataIndex: "appName",
      key: "appName",
      align: "center",
      render: (appName, record) => {
        const isRiskyApp = riskyApps.some(
          (pattern) =>
            pattern.test(appName || "") || pattern.test(record.title || "")
        );
        return (
          <Space>
            {appName}
            {isRiskyApp && <Tag color="volcano">Rủi ro</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Window Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      align: "center",
      render: (subject) => (
        <Tag color="cyan">{SUBJECT_LABELS[subject] || subject}</Tag>
      ),
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      align: "center",
      render: (flag) =>
        flag && flag !== "NORMAL" ? (
          <Tag color="gold">{flag}</Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
  ];

  return (
    <div>
      {/* Filters + Actions */}
      <Space style={{ marginBottom: 16, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }} size="middle">
        <Space wrap>
          <Input
            name="username"
            value={filters.username}
            onChange={handleChange}
            placeholder="Username"
            style={{ width: 130 }}
          />

          <Input
            name="app"
            value={filters.app}
            onChange={handleChange}
            placeholder="App name"
            style={{ width: 130 }}
          />

          <Input
            name="title"
            value={filters.title}
            onChange={handleChange}
            placeholder="Keyword title"
            style={{ width: 160 }}
          />

          <Select
            value={filters.subject}
            onChange={(val) => {
              setFilters({ ...filters, subject: val });
              localStorage.setItem("selectedSubject", val);
            }}
            style={{ width: 140 }}
            options={[
              { value: "code", label: "Lập trình" },
              { value: "trr", label: "Toán rời rạc" },
              {value: "sql", label: "Cơ sở dữ liệu" },
              { value: "ai-challenge", label: "AI Challenge" },
            ]}
          />

          <Select
            value={filters.flag}
            onChange={(val) => setFilters({ ...filters, flag: val })}
            style={{ width: 130 }}
            options={[
              { value: "", label: "Tất cả Flag" },
              { value: "NORMAL", label: "NORMAL" },
              { value: "REVIEW", label: "REVIEW" },
            ]}
          />

          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>

          <Button icon={<ReloadOutlined />} onClick={handleRefresh} disabled={loading}>
            Làm mới
          </Button>
        </Space>

        <Popconfirm
          title="Xóa logs"
          description={`Bạn có chắc chắn muốn xóa toàn bộ logs của môn ${
            SUBJECT_LABELS[filters.subject] || filters.subject
          }?`}
          onConfirm={handleConfirmDelete}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa logs môn hiện tại
          </Button>
        </Popconfirm>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        bordered
        rowClassName={(record) => (record.flag === "REVIEW" ? "flagged-row" : "")}
        pagination={{
          current: page + 1,
          pageSize: limit,
          showSizeChanger: false,
          total: logs.length === limit ? (page + 2) * limit : (page + 1) * limit, // Pagination heuristic when no total available
          onChange: (newPage) => setPage(newPage - 1),
        }}
      />
    </div>
  );
}
