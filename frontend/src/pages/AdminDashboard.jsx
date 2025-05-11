import { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from '@tanstack/react-table';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEdit] = useState(null);

  const fetchList = async t => {
    const path = t === 'blog' ? '/blogs' : '/projects';
    const { data } = await api.get(path);
    setData(Array.isArray(data) ? data : data.blogs || data.projects || []);
  };
  useEffect(() => { fetchList(tab); }, [tab]);

  const columns = useMemo(() => [
    {
      Header: tab === 'blog' ? 'Title' : 'Name',
      accessor: row => row.title || row.name
    },
    {
      Header: 'Date',
      accessor: 'createdAt',
      Cell: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      Header: 'Action',
      id: 'action',
      Cell: ({ row }) => (
        <div className="space-x-1">
          <button className="btn-outline text-xs" onClick={() => { setEdit(row.original); setOpen(true); }}>✏︎</button>
          <button className="btn-danger text-xs" onClick={() => del(row.original._id)}>🗑</button>
        </div>
      )
    }
  ], [tab]);

  const table = useTable({ columns, data }, useSortBy, usePagination);

  const del = async id => {
    if (!confirm('Delete?')) return;
    const path = tab === 'blog' ? '/blogs' : '/projects';
    await api.delete(`${path}/${id}`);
    fetchList(tab);
  };

  const save = async form => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    if (editItem?._id) await api.put(`${path}/${editItem._id}`, form);
    else await api.post(path, form);
    setOpen(false);
    fetchList(tab);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      {/* tabs + new */}
      <div className="flex gap-4 mb-6 items-center">
        {['blog', 'project'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={clsx('px-4 py-2 rounded-lg', t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}>{t === 'blog' ? 'Posts' : 'Projects'}</button>
        ))}
        <button onClick={() => { setEdit(null); setOpen(true); }} className="ml-auto btn-primary">＋ New</button>
      </div>

      {/* table */}
      {data.length === 0 ? (
        <p className="text-gray-500">暂无{tab === 'blog' ? '文章' : '项目'}，点击右上角 New 新建。</p>
      ) : (
        <table {...table.getTableProps()} className="w-full border collapse">
          <thead className="bg-gray-100">
            {table.headerGroups.map(hg => (
              <tr {...hg.getHeaderGroupProps()}>
                {hg.headers.map(col => (
                  <th {...col.getHeaderProps(col.getSortByToggleProps())} className="p-2 cursor-pointer select-none">
                    {col.render('Header')}{col.isSorted ? (col.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...table.getTableBodyProps()}>
            {table.page.map(row => { table.prepareRow(row); return (
              <tr {...row.getRowProps()} className="border-t">
                {row.cells.map(c => <td {...c.getCellProps()} className="p-2">{c.render('Cell')}</td>)}
              </tr>
            );})}
          </tbody>
        </table>
      )}

      {/* pagination */}
      {table.pageCount > 1 && (
        <div className="flex justify-end mt-3 space-x-2">
          <button disabled={!table.canPreviousPage} onClick={() => table.previousPage()} className="btn-outline text-xs">Prev</button>
          <span className="text-sm self-center">{table.state.pageIndex + 1} / {table.pageCount}</span>
          <button disabled={!table.canNextPage} onClick={() => table.nextPage()} className="btn-outline text-xs">Next</button>
        </div>
      )}

      <EditModal open={open} setOpen={setOpen} initData={editItem} type={tab} onSave={save} />
    </div>
  );
}