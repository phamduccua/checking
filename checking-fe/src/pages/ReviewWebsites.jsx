import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Popconfirm, Typography, message, Card, theme } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, GlobalOutlined } from "@ant-design/icons";
import {
  getReviewWebsites,
  createReviewWebsite,
  updateReviewWebsite,
  deleteReviewWebsite,
} from "../service/reviewWeb";

const { Text, Title } = Typography;

export default function ReviewWebsites() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const data = await getReviewWebsites();
      setWebsites(data || []);
    } catch (err) {
      console.error("Fetch Review Websites failed", err);
      message.error("Lỗi khi tải danh sách Website");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue({
        webName: item.webName,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingItem(null);
  };

  const handleSubmit = async (values) => {
    try {
      setFormLoading(true);
      if (editingItem) {
        await updateReviewWebsite(editingItem.id, { webName: values.webName.trim() });
        message.success("Cập nhật thành công!");
      } else {
        // Hỗ trợ nhập nhiều web cách nhau bởi dấu phẩy, chấm phẩy hoặc xuống dòng
        const names = values.webName
          .split(/[,;\n]+/)
          .map((n) => n.trim())
          .filter((n) => n.length > 0);

        if (names.length === 0) return;

        await createReviewWebsite({ webNames: names });
        message.success(`Thêm mới thành công ${names.length} website!`);
      }
      handleCloseModal();
      fetchWebsites();
    } catch (err) {
      console.error("Save Review Website error:", err);
      // Hiển thị message từ BE (nếu có, ví dụ do trùng lặp webNames)
      message.error(err.response?.data?.message || err.message || "Lưu dữ liệu thất bại");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteReviewWebsite(id);
      message.success("Đã xóa Website!");
      fetchWebsites();
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
      render: (id) => <Text type="secondary">{id}</Text>,
    },
    {
      title: "Tên App / Website (Tên tiến trình)",
      dataIndex: "webName",
      key: "webName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ color: token.colorPrimary }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa Website này?"
            description={`Bạn có chắc muốn xóa "${record.webName}" khỏi danh sách cần xem xét?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Title level={4} style={{ margin: 0 }}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          Danh sách App / Web cần xem xét
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchWebsites} disabled={loading}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Thêm mới
          </Button>
        </Space>
      </Space>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={websites}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 20 }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </Card>

      <Modal
        title={editingItem ? "Sửa Website" : "Thêm mới Website"}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ webName: "" }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="webName"
            label={editingItem ? "Tên App / Website" : "Tên App / Website (ngăn cách bởi phẩy hoặc xuống dòng để thêm nhiều)"}
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              { whitespace: true, message: "Tên không được chỉ chứa khoảng trắng!" },
            ]}
          >
            {editingItem ? (
              <Input placeholder="ví dụ: facebook.com" />
            ) : (
              <Input.TextArea rows={4} placeholder="ví dụ: facebook.com&#10;zalo.me&#10;chrome" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
