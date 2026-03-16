import { useEffect, useState } from "react";
import { Table, Input, Button, Space, Tag, Typography, Switch, Tooltip } from "antd";
import { PlusOutlined, SearchOutlined, SafetyCertificateOutlined, AlertOutlined } from "@ant-design/icons";
import { getUser } from "../service/user";
import LogsModal from "../components/LogsModal";
import AddUserModal from "../components/AddUserModal";

const { Text } = Typography;

const roleColor = {
  ADMIN: "geekblue",
  USER: "cyan",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlag, setIsFlag] = useState(false);

  // pagination
  const limit = 30;
  const [page, setPage] = useState(0); // internally using page to calculate offset
  const offset = page * limit;
  const [hasNext, setHasNext] = useState(false);

  // modal states
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchUsers(0);
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // khi bật / tắt filter flag → về trang đầu
  useEffect(() => {
    setPage(0);
    fetchUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlag]);

  // load data
  const fetchUsers = async (customOffset = offset) => {
    try {
      setLoading(true);
      const data = await getUser(query, isFlag, limit, customOffset);

      const list = data.items || data;
      setUsers(list);

      setHasNext(list.length === limit);
    } catch (err) {
      console.error("Fetch users failed", err);
    } finally {
      setLoading(false);
    }
  };

  // load khi đổi trang
  useEffect(() => {
    fetchUsers(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <Text strong style={{ whiteSpace: "nowrap" }}>{text}</Text>,
    },
    {
      title: "Full name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => <Tag color={roleColor[role] || "default"}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) =>
        status === 1 ? (
          <Tag icon={<SafetyCertificateOutlined />} color="cyan">ACTIVE</Tag>
        ) : (
          <Tag color="default">DISABLED</Tag>
        ),
    },
    {
      title: "Log Flagged",
      dataIndex: "totalFlag",
      key: "totalFlag",
      align: "center",
      render: (totalFlag) =>
        totalFlag > 0 ? (
          <Tag icon={<AlertOutlined />} color="gold">
            {totalFlag}
          </Tag>
        ) : (
          <Text type="secondary">0</Text>
        ),
    },
    {
      title: "Detail",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedUsername(record.username)}>
          Xem logs →
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <Space style={{ marginBottom: 16, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }} size="middle">
        <Space wrap>
          <InputPrefixSearch 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search username hoặc fullname..." 
            style={{ width: 250 }} 
          />

          <Tooltip title="Chỉ hiện thị người dùng có cờ nghi vấn">
            <Button
              type={isFlag ? "primary" : "default"}
              danger={isFlag}
              onClick={() => setIsFlag(!isFlag)}
            >
              {isFlag ? "Đang lọc Flag" : "Lọc Flag"}
            </Button>
          </Tooltip>
        </Space>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAddModal(true)}>
          Thêm user
        </Button>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="username"
        loading={loading}
        bordered
        pagination={{
          current: page + 1,
          pageSize: limit,
          showSizeChanger: false,
          total: hasNext ? (page + 2) * limit : (page + 1) * limit, // pagination heuristic
          onChange: (newPage) => setPage(newPage - 1),
        }}
      />

      {/* Logs Modal */}
      {selectedUsername && (
        <LogsModal
          username={selectedUsername}
          open={!!selectedUsername}
          onClose={() => setSelectedUsername(null)}
        />
      )}

      {/* Add User Modal */}
      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setPage(0);
          fetchUsers(0);
        }}
      />
    </div>
  );
}

// Wrapper for simple Input search
const InputPrefixSearch = (props) => (
  <Input prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} {...props} />
);
