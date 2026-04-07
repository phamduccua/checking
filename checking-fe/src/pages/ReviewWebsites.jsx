import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Typography,
  message,
  Card,
  Tag,
  theme,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import {
  getReviewWebsites,
  createReviewWebsite,
  updateReviewWebsite,
  deleteReviewWebsite,
} from "../service/reviewWeb";

const { Text, Title } = Typography;

const TYPE_OPTIONS = [
  {
    value: "APP_NAME",
    label: "Tên App (khớp chính xác tiến trình)",
    color: "blue",
  },
  {
    value: "TITLE_KEYWORD",
    label: "Từ khoá Title (title chứa chuỗi này)",
    color: "orange",
  },
];

const typeLabel = (type) => {
  const opt = TYPE_OPTIONS.find((o) => o.value === type);
  return opt ? (
    <Tag color={opt.color}>{opt.value === "APP_NAME" ? "Tên App" : "Từ khoá Title"}</Tag>
  ) : (
    <Tag>{type}</Tag>
  );
};

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
      message.error("Lỗi khi tải danh sách");
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
        type: item.type || "APP_NAME",
        webName: item.webName,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ type: "APP_NAME" });
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
        await updateReviewWebsite(editingItem.id, {
          type: values.type,
          webName: values.webName.trim(),
        });
        message.success("Cập nhật thành công!");
      } else {
        // Hỗ trợ nhập nhiều mục cách nhau bởi dấu phẩy, chấm phẩy hoặc xuống dòng
        const names = values.webName
          .split(/[,;\n]+/)
          .map((n) => n.trim())
          .filter((n) => n.length > 0);

        if (names.length === 0) return;

        await createReviewWebsite({ type: values.type, webNames: names });
        message.success(`Thêm mới thành công ${names.length} mục!`);
      }
      handleCloseModal();
      fetchWebsites();
    } catch (err) {
      console.error("Save error:", err);
      message.error(
        err.response?.data?.message || err.message || "Lưu dữ liệu thất bại"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteReviewWebsite(id);
      message.success("Đã xóa thành công!");
      fetchWebsites();
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const typeFilter = [...new Set(websites.map((w) => w.type || "APP_NAME"))].map(
    (t) => ({ text: t === "APP_NAME" ? "Tên App" : "Từ khoá Title", value: t })
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      align: "center",
      render: (id) => <Text type="secondary">{id}</Text>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 160,
      align: "center",
      filters: typeFilter,
      onFilter: (value, record) => (record.type || "APP_NAME") === value,
      render: (type) => typeLabel(type || "APP_NAME"),
    },
    {
      title: "Giá trị (Tên App / Từ khoá Title)",
      dataIndex: "webName",
      key: "webName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 180,
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
            title="Xóa mục này?"
            description={`Bạn có chắc muốn xóa "${record.webName}"?`}
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

  const selectedType = Form.useWatch("type", form);

  return (
    <div className="space-y-4">
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          Danh sách App / Web cần xem xét
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchWebsites}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
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
        title={editingItem ? "Sửa mục" : "Thêm mới"}
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
          initialValues={{ type: "APP_NAME" }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="type"
            label="Loại giới hạn"
            rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
          >
            <Select options={TYPE_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="webName"
            label={
              editingItem
                ? selectedType === "TITLE_KEYWORD"
                  ? "Từ khoá trong title"
                  : "Tên App / tiến trình"
                : selectedType === "TITLE_KEYWORD"
                ? "Từ khoá trong title (ngăn cách bởi phẩy hoặc xuống dòng để thêm nhiều)"
                : "Tên App / tiến trình (ngăn cách bởi phẩy hoặc xuống dòng để thêm nhiều)"
            }
            rules={[
              { required: true, message: "Vui lòng nhập giá trị!" },
              { whitespace: true, message: "Không được chỉ chứa khoảng trắng!" },
            ]}
            extra={
              selectedType === "TITLE_KEYWORD"
                ? "⚠️ Nếu title cửa sổ chứa chuỗi này → log bị flag REVIEW (không phân biệt hoa thường)"
                : "ℹ️ Khớp chính xác tên tiến trình/app (ví dụ: chrome, zalo)"
            }
          >
            {editingItem ? (
              <Input
                placeholder={
                  selectedType === "TITLE_KEYWORD"
                    ? "ví dụ: Thu số điện thoại"
                    : "ví dụ: chrome"
                }
              />
            ) : (
              <Input.TextArea
                rows={4}
                placeholder={
                  selectedType === "TITLE_KEYWORD"
                    ? "ví dụ: Thu số điện thoại&#10;Facebook&#10;Thoát"
                    : "ví dụ: chrome&#10;zalo&#10;coccoc"
                }
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
