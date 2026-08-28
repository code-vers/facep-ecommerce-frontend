'use client';

import { useAdminUsers } from '@/hooks/api/useProfile';
import { profileApi } from '@/lib/api/profile';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UsersTable() {
  const { data: users = [], isLoading, refetch } = useAdminUsers(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DEACTIVATED'>('ALL');
  const [busyId, setBusyId] = useState<string | null>(null);
  const visible = users.filter((user) => filter === 'ALL' || (filter === 'ACTIVE' ? user.isActive : !user.isActive));

  const reactivate = async (id: string) => {
    setBusyId(id);
    try {
      await profileApi.reactivateUser(id);
      await refetch();
      toast.success('User account reactivated.');
    } catch { toast.error('Unable to reactivate this account.'); }
    finally { setBusyId(null); }
  };

  if (isLoading) return <div className='w-full rounded border p-8 text-center'>Loading users...</div>;

  return (
    <section className='w-full space-y-5 rounded border border-[#E5E5E6] bg-white p-4'>
      <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <h2 className='text-xl font-semibold'>Users</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className='rounded border border-[#E5E5E6] px-3 py-2 text-sm'>
          <option value='ALL'>All accounts</option><option value='ACTIVE'>Active</option><option value='DEACTIVATED'>Deactivated</option>
        </select>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[760px] text-left text-sm'>
          <thead className='border-y bg-[#F7F7F8] text-[#42454D]'><tr><th className='p-3'>User</th><th className='p-3'>Role</th><th className='p-3'>Contact</th><th className='p-3'>Joined</th><th className='p-3'>Status</th><th className='p-3 text-right'>Action</th></tr></thead>
          <tbody>{visible.map((user) => <tr key={user.id} className='border-b'>
            <td className='p-3'><div className='font-medium'>{user.name}</div><div className='text-[#848995]'>{user.email}</div></td>
            <td className='p-3'>{user.role}</td><td className='p-3'>{user.contactNumber || '—'}</td>
            <td className='p-3'>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td className='p-3'><span className={`rounded-full px-2 py-1 text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Active' : 'Deactivated'}</span></td>
            <td className='p-3 text-right'>{!user.isActive && <button disabled={busyId === user.id} onClick={() => void reactivate(user.id)} className='inline-flex items-center gap-1 rounded bg-[#dec33a] px-3 py-2 font-medium disabled:opacity-50'><RotateCcw size={14} />Reactivate</button>}</td>
          </tr>)}</tbody>
        </table>
        {!visible.length && <p className='p-8 text-center text-[#848995]'>No users found.</p>}
      </div>
    </section>
  );
}
