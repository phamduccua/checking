import { useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu, Button, Switch, Space, theme } from "antd";
import {
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  KeyOutlined,
  GlobalOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";

const { Header, Sider, Content } = AntLayout;

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    // Xóa token / thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về trang login
    navigate("/login");
  };

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/logs", icon: <FileTextOutlined />, label: "Logs" },
    { key: "/users", icon: <TeamOutlined />, label: "Users" },
    { key: "/app-tokens", icon: <KeyOutlined />, label: "App Tokens" },
    { key: "/review-webs", icon: <GlobalOutlined />, label: "Review Websites" },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        theme={isDarkMode ? "dark" : "light"}
        style={{ borderRight: isDarkMode ? "none" : `1px solid ${token.colorBorderSecondary}` }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: isDarkMode ? "1px solid #303030" : `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: "bold",
              color: token.colorPrimary,
            }}
          >
            Log Admin
          </h1>
        </div>
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{ borderRight: 0, padding: "8px 0" }}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            background: token.colorBgContainer,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: isDarkMode ? "1px solid #303030" : `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div style={{ fontSize: 16, color: token.colorTextSecondary }}>
            Admin Layout
          </div>
          <Space size="large">
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<BulbFilled />}
              unCheckedChildren={<BulbOutlined />}
            />
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.03)`,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
