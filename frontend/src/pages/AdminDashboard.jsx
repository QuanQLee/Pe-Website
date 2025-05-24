import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import clsx from 'clsx';
import api from '../api';

const TABS = [
  { key: 'blog',    label: '文章管理' },
  { key: 'project', label: '项目管理' },
];

export default function AdminDashboard() {
  const [tab, setTab]       = useState('blog');
  const [data, setData]     = useState([]);
  const [loading, setLoad]  = useState(true);

  const nav = useNavigate();

  /* ---------- 工具 ---------- */
  const logout = () => { localStorage.removeItem('token'); nav('/admin/login'); };

  const idOrSlug = (item) =>
    item?.slug?.trim() ? item.slug : item?._id;

  /* ---------- 列表 ---------- */
  const fetchList = async () => {
    setLoad(true);
    const url   = tab === 'blog' ? '/blogs' : '/projects';
    const res   = await api.get(url);
    setData(Array.isArray(res.data) ? res.data : []);
    setLoad(false);
  };
  useEffect(() => { fetchList(); }, [tab]);

  const del = async (row) => {
    if (!window.confirm('确定删除？')) return;
    const base = tab === 'blog' ? '/blogs' : '/projects';
    await api.delete(`${base}/${idOrSlug(row)}`);
    fetchList();
  };

  /* ---------- 表头 ---------- */
  const columns = useMemo(() => {
    const coverCol = {
      header: '封面',
      accessorFn: r =>
        r.coverImg
          ? <img src={r.coverImg} alt="" style={{ width: 50, borderRadius: 4 }} />
          : <span className="text-gray-300">无</span>,
    };

    if (tab === 'blog')
      return [
        { header: '#', cell: ({ row }) => row.index + 1 },
        coverCol,
        { header: '标题', accessorKey: 'title' },
        { header: '标签', accessorFn: r => r.tags?.join?.(',') ?? r.tags },
        { header: '简介', accessorKey: 'summary' },
        { header: '更新时间', accessorFn: r => new Date(r.updatedAt ?? r.createdAt).toLocaleString() },
        {
          header: '操作',
          cell: ({ row }) => actionBtns(row.original),
        },
      ];

    /* project */
    return [
      { header: '#', cell: ({ row }) => row.index + 1 },
      coverCol,
      { header: '名称', accessorKey: 'name' },
      { header: '简介', accessorKey: 'tagline' },
      { header: '链接', accessorFn: r => r.link
          ? <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">访问</a>
          : <span className="text-gray-300">-</span> },
      { header: '完成日期', accessorFn: r => r.finishedAt ? new Date(r.finishedAt).toLocaleDateString() : '-' },
      {
        header: '操作',
        cell: ({ row }) => actionBtns(row.original),
      },
    ];
  }, [tab]);

  /* ---------- 操作按钮 ---------- */
  const actionBtns = (row) => (
    <div className="flex gap-2">
      <button
        className="btn-outline"
        onClick={() => nav(`/admin/editor/${tab}/${idOrSlug(row)}`)}
      >编辑</button>

      <button className="btn-danger" onClick={() => del(row)}>删除</button>
    </div>
  );

  /* ---------- 表格 ---------- */
  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex: 0, pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto mt-10">
      {/* 顶部工具条 */}
      <div className="flex items-center mb-6">
        {/* tab  */}
        <div className="flex gap-2">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                'px-6 py-2 rounded-full font-medium transition-all',
                t.key === tab ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >{t.label}</button>
          ))}
        </div>

        {/* new / logout */}
        <button
          onClick={() => nav(`/admin/editor/${tab}`)}
          className="ml-auto btn-primary"
        >＋ 新建{tab === 'blog' ? '文章' : '项目'}</button>

        <button onClick={logout} className="ml-4 px-4 py-2 rounded text-sm border hover:bg-gray-100">
          退出登录
        </button>
      </div>

      {/* 表格 */}
      <div className="border rounded-lg overflow-x-auto bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h =>
                  <th key={h.id} className="p-3 text-left font-semibold">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                )}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="p-6 text-center text-gray-400">加载中…</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="p-6 text-center text-gray-400">暂无数据</td></tr>
            ) : (
              table.getRowModel().rows.map(r => (
                <tr key={r.id} className="border-t hover:bg-blue-50/20">
                  {r.getVisibleCells().map(c =>
                    <td key={c.id} className="p-3">{flexRender(c.column.columnDef.cell ?? c.column.columnDef.accessorFn, c.getContext())}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-outline">上一页</button>
        <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-outline">下一页</button>
      </div>
    </div>
  );
}
