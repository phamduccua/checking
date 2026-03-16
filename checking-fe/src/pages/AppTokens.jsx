import { useEffect, useState } from "react";
import { Button, Card, Typography, Spin, message, Form, Input } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { getAppToken, updateAppToken } from "../service/appToken";

const { Title } = Typography;

export default function AppTokens() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchToken = async () => {
    try {
      setLoading(true);
      const data = await getAppToken();
      // data could be an object { appToken: "..." } or an array based on previous code.
      // Based on the new backend Request model, it should be an object with appToken.
      const tokenString = typeof data === 'string' ? data : data?.appToken || (data?.[0]?.appToken) || "";
      form.setFieldsValue({ appToken: tokenString });
    } catch (err) {
      console.error("Fetch app token failed", err);
      message.error("Lỗi khi tải cấu hình App Token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (values) => {
    try {
      setSubmitting(true);
      await updateAppToken({ appToken: values.appToken });
      message.success("Cập nhật App Token thành công");
      fetchToken();
    } catch (err) {
      console.error("Update failed", err);
      message.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Title level={4} style={{ margin: 0 }}>
          Cấu hình App Token
        </Title>
      </div>

      <Spin spinning={loading}>
        <Card bordered={false} style={{ maxWidth: 800 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
             {/* Use TextArea as tokens can sometimes be quite long JWTs */}
            <Form.Item
              name="appToken"
              label="App Token hệ thống sử dụng"
              rules={[
                { required: true, message: "Vui lòng nhập App Token" },
              ]}
            >
              <Input.TextArea rows={8} placeholder="Nhập chuỗi token..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting}>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
