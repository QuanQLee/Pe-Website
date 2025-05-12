import { useEffect, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import api from "../api";
import EditModal from "./EditModal";
import clsx from "clsx";

export default function AdminDashboard() {
  const [tab, setTab] = useState("blog"); // blog | project
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null); // null = new
  const [open, setOpen] = useState(false);

  /* ---------------- helpers ---------------- */
  const path = tab === "blog" ? "/blogs" : "/projects";
  const reload = async () => {
    const { data } = await api.get(path);
    setData(Array.isArray(data) ? data : data.blogs || data.projects || []);
  };

  useEffect(() => { reload(); }, [tab]);

  const save = async (form, file) => {
    let payload = { ...form };
    // 如果有图片文件上传, 先传文件, 拿到 URL 再写入 payload.image
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = (await api.post("/upload", fd)).data;
      payload.image = url;
    }
    editing?._id ? await api.put(`${path}/${editing._id}`, payload) : await api.post(path, payload);
    setOpen(false);
    await reload();
  };

  const delOne = async id => {
    if (!confirm("确定删除?")) return;
    await api.delete(`${path}/${id}`);
    reload();
  };

  /* ---------------- react-table ---------------- */
  const columns = useMemo(() => [
    {
      header: "标题 / 名称",
      accessorFn: row => row.title ?? row.name,
    },
    {
      header: "日期",
      accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "操作",
      cell: ({ row }) => (
        <>
          <button className="btn-outline text-sm mr-2" onClick={() => { setEditing(row.original); setOpen(true); }}>编辑</button>
          <button className="btn-danger text-sm" onClick={() => delOne(row.original._id)}>删除</button>
        </>
      ),
    },
  ], [tab]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          ["blog", "Posts"],
          ["project", "Projects"],
        ].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)} className={clsx("px-4 py-2 rounded-lg", val === tab ? "bg-blue-600 text-white" : "bg-gray-200")}>{label}</button>
        ))}
        <button className="ml-auto btn-primary" onClick={() => { setEditing(null); setOpen(true); }}>＋ New</button>
      </div>

      {/* Table */}
      <table className="w-full border collapse">
        <thead className="bg-gray-100 text-left">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="p-2">{h.column.columnDef.header}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr><td colSpan={3} className="p-6 text-center text-gray-500">暂无数据</td></tr>
          ) : table.getRowModel().rows.map(r => (
            <tr key={r.id} className="border-t">
              {r.getVisibleCells().map(c => <td key={c.id} className="p-2">{c.renderCell()}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-outline">上一页</button>
        <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-outline">下一页</button>
      </div>

      {/* 编辑 / 新建 Modal */}
      <EditModal open={open} setOpen={setOpen} type={tab} initData={editing} onSave={save} />
    </div>
  );
}