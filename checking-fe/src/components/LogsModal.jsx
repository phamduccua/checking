import { useEffect, useState } from "react";
import { Modal, Table, Tag, Typography, Space } from "antd";
import { getByUsername } from "../service/log";

const { Text } = Typography;

const SUBJECT_LABELS = {
  py: "Python",
  trr: "Toán rời rạc",
  "ai-challenge": "AI Challenge",
};

/**
 * Danh sách app rủi ro
 */
const riskyBrowsers = [
  /chrome/i,
  /coccoc/i,
  /edge|msedge/i,
  /firefox/i,
  /brave/i,
];
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

export default function LogsModal({ open, username, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !username) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getByUsername(username);
        setLogs(data.items || data);
      } catch (err) {
        console.error("Fetch logs failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [open, username]);

  const columns = [
    {
      title: "Time",
      dataIndex: "logTime",
      key: "time",
      render: (logTime) => (
        <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
          {new Date(logTime).toLocaleString("vi-VN")}
        </Text>
      ),
    },
    {
      title: "App",
      dataIndex: "appName",
      key: "appName",
      render: (appName) => {
        const isRiskyApp = riskyApps.some((pattern) => pattern.test(appName || ""));
        return (
          <Space>
            {appName}
            {isRiskyApp && <Tag color="volcano">Rủi ro</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Title",
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
    <Modal
      title={
        <span>
          Logs của user: <Text type="primary" strong>{username}</Text>
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      styles={{ body: { padding: "12px 0 0" } }}
    >
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        bordered
        rowClassName={(record) => (record.flag === "REVIEW" ? "flagged-row" : "")}
        pagination={{ pageSize: 15 }}
        scroll={{ y: '60vh' }}
        locale={{ emptyText: "Không có log" }}
      />
    </Modal>
  );
}
