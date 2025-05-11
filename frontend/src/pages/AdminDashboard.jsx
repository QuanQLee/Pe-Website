import { useState, useEffect, useCallback } from 'react'
import { Table, Button, Tabs, Pagination, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import 'antd/dist/reset.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_BASE // 确保 .env.production 里写的是 VITE_API_BASE

  // 当前是博客还是项目
  const [tab, setTab] = useState('blog')
  // 列表数据
  const [data, setData] = useState([])
  // 分页
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)

  // 拉列表
  const fetchList = useCallback(async () => {
    try {
      const kind = tab === 'blog' ? 'blogs' : 'projects'
      const res = await fetch(`${apiBase}/${kind}?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      const json = await res.json()
      setData(json.items || json.data)       // 根据你后端返回字段改
      setTotal(json.total || json.count)     // 根据后端返回字段改
    } catch (err) {
      message.error('列表拉取失败')
      console.error(err)
    }
  }, [apiBase, tab, pageIndex, pageSize])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  // 删除
  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    try {
      const kind = tab === 'blog' ? 'blogs' : 'projects'
      await fetch(`${apiBase}/${kind}/${id}`, { method: 'DELETE' })
      message.success('已删除')
      fetchList()
    } catch (err) {
      message.error('删除失败')
      console.error(err)
    }
  }

  // 编辑
  const handleEdit = (id) => {
    navigate(`/admin/edit/${tab}/${id}`)
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => record.title || record.name
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => new Date(val).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record._id)}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record._id)} style={{ marginLeft: 8 }}>
            删除
          </Button>
        </>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Tabs activeKey={tab} onChange={setTab}>
        <Tabs.TabPane tab="Posts" key="blog" />
        <Tabs.TabPane tab="Projects" key="project" />
      </Tabs>

      <Button type="primary" onClick={() => navigate(`/admin/new/${tab}`)} style={{ marginBottom: 16 }}>
        + New
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
      />

      <Pagination
        style={{ marginTop: 16, textAlign: 'right' }}
        current={pageIndex}
        pageSize={pageSize}
        total={total}
        onChange={(page, size) => {
          setPageIndex(page)
          setPageSize(size)
        }}
      />
    </div>
  )
}

export default AdminDashboard
