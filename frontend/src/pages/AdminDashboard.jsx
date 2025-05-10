import { useState, useEffect } from 'react';
import api from '../api';
import EditModal from './EditModal';

const blogFields = [
  { key:'title',  label:'Title' },
  { key:'slug',   label:'Slug' },
  { key:'content',label:'Content (markdown)' },
  { key:'tags',   label:'Tags (, separated)' }
];
const projectFields=[
  { key:'name',       label:'Name' },
  { key:'tagline',    label:'Tagline' },
  { key:'description',label:'Description' },
  { key:'link',       label:'Link' },
  { key:'image',      label:'Image URL' }
];

export default function AdminDashboard(){
  const [tab,setTab]=useState('blogs');
  const [blogs,setBlogs]=useState([]);
  const [projects,setProjects]=useState([]);
  const [modal,setModal]=useState({open:false,type:'',data:null});

  const load=()=>{
    api.get('/blogs').then(r=>setBlogs(r.data));
    api.get('/projects').then(r=>setProjects(r.data));
  };
  useEffect(load,[]);

  const openNew=t=>setModal({open:true,type:t,data:{}});
  const openEdit=(t,obj)=>setModal({open:true,type:t,data:obj});

  const save=async values=>{
    const type=modal.type;
    if(type==='blog'){
      if(values._id) await api.put(`/blogs/${values._id}`,values);
      else await api.post('/blogs',values);
    }else{
      if(values._id) await api.put(`/projects/${values._id}`,values);
      else await api.post('/projects',values);
    }
    setModal({open:false});
    load();
  };

  const del=async (type,id)=>{
    if(!confirm('Delete?'))return;
    await api.delete(`/${type}s/${id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button className={tab==='blogs'?'tab-active':'tab'} onClick={()=>setTab('blogs')}>Blogs</button>
        <button className={tab==='projects'?'tab-active':'tab'} onClick={()=>setTab('projects')}>Projects</button>
      </div>

      {tab==='blogs' && (
        <>
          <button className="btn-primary mb-4" onClick={()=>openNew('blog')}>New Blog</button>
          <table className="w-full text-sm"><thead><tr><th>Title</th><th>Slug</th><th/></tr></thead><tbody>
            {blogs.map(b=> (
              <tr key={b._id} className="border-t"><td>{b.title}</td><td>{b.slug}</td>
                <td className="text-right space-x-2">
                  <button className="btn" onClick={()=>openEdit('blog',b)}>Edit</button>
                  <button className="btn-danger" onClick={()=>del('blog',b._id)}>Del</button>
                </td></tr>
            ))}
          </tbody></table>
        </>
      )}

      {tab==='projects' && (
        <>
          <button className="btn-primary mb-4" onClick={()=>openNew('project')}>New Project</button>
          <table className="w-full text-sm"><thead><tr><th>Name</th><th>Tagline</th><th/></tr></thead><tbody>
            {projects.map(p=> (
              <tr key={p._id} className="border-t"><td>{p.name}</td><td>{p.tagline}</td>
                <td className="text-right space-x-2">
                  <button className="btn" onClick={()=>openEdit('project',p)}>Edit</button>
                  <button className="btn-danger" onClick={()=>del('project',p._id)}>Del</button>
                </td></tr>
            ))}
          </tbody></table>
        </>
      )}

      <EditModal
        isOpen={modal.open}
        title={modal.data?._id?'Edit':'Create'}
        fields={modal.type==='blog'?blogFields:projectFields}
        initial={modal.data}
        onClose={()=>setModal({open:false})}
        onSaved={save}
      />
    </div>
  );
}