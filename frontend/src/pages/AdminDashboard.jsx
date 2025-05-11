// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import clsx from 'clsx'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'blog' | 'project'>('blog')
  const [data, setData] = useState<any[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const navigate = useNavigate()

  // 取列表
  useEffect(() => {
    async function fetchList() {
      const url = `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}`
      const res = await fetch(url)
      const list = await res.json()
      setData(list)
    }
    fetchList()
  }, [tab])

  // 删除
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return
    const url = `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}/${id}`
    await fetch(url, { method: 'DELETE' })
    // 刷新
    setData(prev => prev.filter(item => item._id !== id))
  }

  // 编辑（这里只弹 prompt 演示，你可以改成跳路由或弹框）
  const handleEdit = async (item: any) => {
    const newTitle = prompt('修改标题', item.title || item.name)
    if (newTitle == null) return
    const url = `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}/${item._id}`
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(tab === 'blog' ? { title: newTitle } : { name: newTitle }) }),
    })
    // 刷新
    setData(prev =>
      prev.map(d => (d._id === item._id ? { ...d, title: newTitle, name: newTitle } : d)),
    )
  }

  // 定义表格列
  const columns = useMemo(
    () => [
      {
        accessorKey: 'title', // blog 用 title, project 用 name，后台最好统一
        header: '标题',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'createdAt',
        header: '日期',
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <div className="space-x-2">
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded"
              onClick={() => handleEdit(row.original)}
            >
              编辑
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => handleDelete(row.original._id)}
            >
              删除
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit],
  )

  // 初始化 react-table
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize),
    state: { pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: up => {
      setPageIndex(up.pageIndex)
      setPageSize(up.pageSize)
    },
  })

  return (
    <div className="px-8 py-6">
      <div className="space-x-4 mb-6">
        <button
          className={clsx(
            'px-4 py-2 rounded',
            tab === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-200',
          )}
          onClick={() => setTab('blog')}
        >
          Posts
        </button>
        <button
          className={clsx(
            'px-4 py-2 rounded',
            tab === 'project' ? 'bg-blue-600 text-white' : 'bg-gray-200',
          )}
          onClick={() => setTab('project')}
        >
          Projects
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded float-right"
          onClick={() => navigate(`/admin/${tab}/new`)}
        >
          + New
        </button>
      </div>

      <table className="min-w-full table-auto border">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th key={header.id} className="border px-4 py-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  )
}
