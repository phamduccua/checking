import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Form, Input, Button, Typography, message, theme } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { login as loginService } from "../service/auth"

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { token } = theme.useToken();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await loginService(values.username, values.password);
      localStorage.setItem("token", response.token.trim());
      localStorage.setItem("role", response.role);
      navigate("/");
    } catch {
      message.error("Đăng nhập thất bại, vui lòng thử kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: token.colorBgBase,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
        styles={{ body: { padding: "32px 24px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ color: token.colorPrimary, margin: 0 }}>
            Admin Login
          </Title>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ fontWeight: "bold" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            * Chỉ dành cho quản trị viên
          </Text>
        </div>
      </Card>
    </div>
  )
}
