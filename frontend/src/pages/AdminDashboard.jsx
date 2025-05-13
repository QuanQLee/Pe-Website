import { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

/* 表格列定义 */
const makeColumns = tab => [
  {
    header: tab === 'blog' ? '标题' : '名称',
    accessorKey: tab === 'blog' ? 'title' : 'name',
  },
  {
    header: '日期',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    header: '操作',
    cell: ({ row, table }) => (
      <>
        <button
          onClick={() => {
            table.options.meta.onEdit(row.original);
          }}
          className="btn-outline text-sm mr-2"
        >
          ✏︎
        </button>
        <button
          onClick={() => {
            table.options.meta.onDelete(row.original._id);
          }}
          className="btn-danger text-sm"
        >
          🗑
        </button>
      </>
    ),
  },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog'); // 'blog' | 'project'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // 拉列表
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.get(tab === 'blog' ? '/blogs' : '/projects');
      // 如果后端直接返回数组，则用它；否则尝试解包
      const list = Array.isArray(res.data)
        ? res.data
        : res.data.blogs || res.data.projects || [];
      setData(list);
      setLoading(false);
    })();
  }, [tab]);

  // 新建 / 编辑 保存
  const handleSave = async form => {
    const base = tab === 'blog' ? '/blogs' : '/projects';
    if (editing?._id) {
      await api.put(`${base}/${editing._id}`, form);
    } else {
      await api.post(base, form);
    }
    setModalOpen(false);
    setEditing(null);
    // 重新拉一遍
    const fresh = await api.get(tab === 'blog' ? '/blogs' : '/projects');
    setData(Array.isArray(fresh.data) ? fresh.data : []);
  };

  // 删除
  const handleDelete = async id => {
    if (!confirm('确认要删除吗？')) return;
    await api.delete(`${tab === 'blog' ? '/blogs' : '/projects'}/${id}`);
    setData(data.filter(item => (item._id || item.slug || item.id) !== id));
  };

  // 表格实例
  const columns = useMemo(() => makeColumns(tab), [tab]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageSize: 10 } },
    meta: {
      onEdit: row => {
        setEditing(row);
        setModalOpen(true);
      },
      onDelete: handleDelete,
    },
  });

  return (
    <div className="max-w-6xl mx-auto mt-12">
      {/* Tab + New */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setEditing(null);
            }}
            className={clsx('px-4 py-2 rounded-lg', {
              'bg-blue-600 text-white': t === tab,
              'bg-gray-200': t !== tab,
            })}
          >
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="ml-auto btn-primary"
        >
          ＋ New
        </button>
      </div>

      {/* 表格 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="p-3 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-400">
                  加载中…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell ?? cell.column.columnDef.accessorFn,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="btn-outline"
        >
          上一页
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} /{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="btn-outline"
        >
          下一页
        </button>
      </div>

      {/* 弹窗编辑 */}
      {modalOpen && (
        <EditModal
          type={tab}
          initialForm={editing}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
);
}
