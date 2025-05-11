// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { Button, Space } from 'antd'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'blog'|'project'>('blog')
  const [data, setData] = useState<any[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  // 拉列表
  const fetchList = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}`
      )
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('列表拉取失败', err)
    }
  }

  useEffect(() => {
    fetchList()
  }, [tab])

  // 删除
  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除吗？')) return
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}/${id}`,
        { method: 'DELETE' }
      )
      fetchList()
    } catch (err) {
      console.error('删除失败', err)
    }
  }

  // 编辑（这里只是个示例，改成你的跳转或弹窗逻辑即可）
  const handleEdit = (item: any) => {
    // 比如：navigate(`/admin/edit/${tab}/${item._id}`)
    alert(`编辑 ${tab}：` + JSON.stringify(item))
  }

  // 表格列配置
  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: '标题',
      },
      {
        accessorKey: 'date',
        header: '日期',
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <Space>
            <Button type="link" onClick={() => handleEdit(row.original)}>
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleDelete(row.original._id)}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [tab]
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize),
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: up => {
      setPageIndex(up.pageIndex)
      setPageSize(up.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-6">
      <Space size="large" className="mb-4">
        <Button
          type={tab === 'blog' ? 'primary' : 'default'}
          onClick={() => setTab('blog')}
        >
          Posts
        </Button>
        <Button
          type={tab === 'project' ? 'primary' : 'default'}
          onClick={() => setTab('project')}
        >
          Projects
        </Button>
        <Button type="primary" onClick={() => alert('打开新建弹窗／跳转')}>
          + New
        </Button>
      </Space>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="py-2 px-4 text-left border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : header.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="py-2 px-4 border-b"
                >
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-center text-gray-400"
              >
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center space-x-4">
        <Button disabled={pageIndex === 0} onClick={() => table.previousPage()}>
          上一页
        </Button>
        <span>
          {pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}
