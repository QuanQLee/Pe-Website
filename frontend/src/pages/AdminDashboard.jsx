import React, { useEffect, useState } from "react";
import clsx from "clsx";
import api from "../api";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// 弹窗表单
function EditModal({ type, initialForm = {}, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm || {});
  useEffect(() => { setForm(initialForm || {}); }, [initialForm]);
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    if (type === "blog") {
      if (!form.title?.trim() || !form.content?.trim()) {
        alert("标题和内容不能为空");
        return;
      }
    } else {
      if (!form.name?.trim() || !form.description?.trim()) {
        alert("项目名称和描述不能为空");
        return;
      }
    }
    onSave(form);
  };
  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: 700 }}>
        <h3 className="modal-title">
          {initialForm._id ? "编辑" : "新建"}{type === "blog" ? "文章" : "项目"}
        </h3>
        <div className="modal-body">
          {type === "blog" ? (
            <>
              <input name="title" value={form.title || ""} onChange={handleChange} placeholder="输入标题" className="input" />
              <input name="slug" value={form.slug || ""} onChange={handleChange} placeholder="slug (选填)" className="input mt-2" />
              <input name="summary" value={form.summary || ""} onChange={handleChange} placeholder="文章简介" className="input mt-2" />
              <input name="tags" value={form.tags || ""} onChange={handleChange} placeholder="标签，逗号分隔" className="input mt-2" />
              <input name="coverImg" value={form.coverImg || ""} onChange={handleChange} placeholder="封面图片地址" className="input mt-2" />
              <input name="publishedAt" type="datetime-local" value={form.publishedAt || ""} onChange={handleChange} className="input mt-2" />
              <label className="block mt-3 mb-1 font-semibold">内容</label>
              <div data-color-mode="light">
                <MDEditor
                  value={form.content || ""}
                  onChange={v => setForm(f => ({ ...f, content: v || "" }))}
                  height={350}
                />
              </div>
            </>
          ) : (
            <>
              <input name="name" value={form.name || ""} onChange={handleChange} placeholder="项目名称" className="input" />
              <input name="tagline" value={form.tagline || ""} onChange={handleChange} placeholder="项目简介" className="input mt-2" />
              <input name="coverImg" value={form.coverImg || ""} onChange={handleChange} placeholder="项目封面图片" className="input mt-2" />
              <input name="link" value={form.link || ""} onChange={handleChange} placeholder="项目链接" className="input mt-2" />
              <label className="block mt-3 mb-1 font-semibold">项目描述</label>
              <div data-color-mode="light">
                <MDEditor
                  value={form.description || ""}
                  onChange={v => setForm(f => ({ ...f, description: v || "" }))}
                  height={200}
                />
              </div>
              <input name="finishedAt" type="date" value={form.finishedAt || ""} onChange={handleChange} className="input mt-2" />
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn mr-2" onClick={onCancel}>取消</button>
          <button className={clsx("btn btn-primary", { "opacity-50 pointer-events-none": type === "blog" ? !form.title?.trim() || !form.content?.trim() : !form.name?.trim() || !form.description?.trim() })} onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [type, setType] = useState("blog");
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 获取列表
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = type === "blog" ? await api.getBlogs() : await api.getProjects();
      setItems(res.data.reverse());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, [type]);

  // 保存/编辑
  const handleSave = async (form) => {
    setLoading(true);
    try {
      if (type === "blog") {
        if (form._id) await api.updateBlog(form._id, form);
        else await api.createBlog(form);
      } else {
        if (form._id) await api.updateProject(form._id, form);
        else await api.createProject(form);
      }
      setModalOpen(false);
      fetchData();
    } finally { setLoading(false); }
  };

  // 删除
  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除吗？")) return;
    setLoading(true);
    try {
      if (type === "blog") await api.deleteBlog(id);
      else await api.deleteProject(id);
      fetchData();
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          className={clsx("btn", { "btn-primary": type === "blog" })} onClick={() => setType("blog")}
        >文章管理</button>
        <button
          className={clsx("btn ml-2", { "btn-primary": type === "project" })} onClick={() => setType("project")}
        >项目管理</button>
        <button className="btn btn-success ml-4" onClick={() => { setEditData({}); setModalOpen(true); }}>
          + 新建{type === "blog" ? "文章" : "项目"}
        </button>
      </div>
      {loading && <div className="my-6 text-center">加载中...</div>}
      {!loading && (
        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="px-2 py-1">#</th>
              {type === "blog" ? (
                <>
                  <th>标题</th>
                  <th>标签</th>
                  <th>简介</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </>
              ) : (
                <>
                  <th>项目名称</th>
                  <th>简介</th>
                  <th>完成时间</th>
                  <th>操作</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item._id || i}>
                <td className="border px-2">{i + 1}</td>
                {type === "blog" ? (
                  <>
                    <td className="border px-2">{item.title}</td>
                    <td className="border px-2">{item.tags}</td>
                    <td className="border px-2">{item.summary}</td>
                    <td className="border px-2">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}</td>
                    <td className="border px-2">
                      <button className="btn btn-sm mr-2" onClick={() => { setEditData(item); setModalOpen(true); }}>编辑</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>删除</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-2">{item.name}</td>
                    <td className="border px-2">{item.tagline}</td>
                    <td className="border px-2">{item.finishedAt || ""}</td>
                    <td className="border px-2">
                      <button className="btn btn-sm mr-2" onClick={() => { setEditData(item); setModalOpen(true); }}>编辑</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>删除</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <EditModal
          type={type}
          initialForm={editData}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
