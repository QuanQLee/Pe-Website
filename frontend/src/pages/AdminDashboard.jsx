import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');   // 'blog' | 'project'
  const [data, setData] = useState([]);

  /** 拉取列表 */
  useEffect(() => {
    const fetchList = async () => {
      const url = `${import.meta.env.VITE_API_URL}/${tab === 'blog' ? 'blogs' : 'projects'}`;
      const res = await fetch(url, { credentials: 'include' });
      setData(await res.json());
    };
    fetchList();
  }, [tab]);

  /** 删除 */
  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return;
    await fetch(
      `${import.meta.env.VITE_API_URL}/${tab === 'blog' ? 'blogs' : 'projects'}/${id}`,
      { method: 'DELETE', credentials: 'include' },
    );
    setData((d) => d.filter((item) => item._id !== id));
  };

  /** 列定义 */
  const columns = useMemo(
    () => [
      { accessorKey: 'title', header: tab === 'blog' ? '标题' : '名称' },
      {
        accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
        header: '日期',
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <div className="space-x-2">
            <button onClick={() => alert('TODO: 编辑弹框')}>编辑</button>
            <button onClick={() => handleDelete(row.original._id)}>删除</button>
          </div>
        ),
      },
    ],
    [tab],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-8">
      {/* 顶部切换与新增 */}
      <div className="mb-4 space-x-4">
        {['blog', 'project'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2 rounded',
              tab === t ? 'bg-blue-500 text-white' : 'bg-gray-200',
            )}
          >
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          onClick={() => alert('TODO: 新建弹框')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          + New
        </button>
      </div>

      {/* 表格 */}
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="border p-2">
                  {h.isPlaceholder ? null : h.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {cell.renderValue()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分页 */}
      <div className="mt-4 space-x-2">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          上一页
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          下一页
        </button>
      </div>
    </div>
  );
}
