'use client';

import { ChevronDown, Eye, FileDown, Pencil, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';

type UserStatus = 'Active' | 'Suspend';

interface UserData {
  id: string;
  avatar: string;
  name: string;
  email: string;
  spent: string;
  orders: string;
  date: string;
  status: UserStatus;
}

const mockUsers: UserData[] = [
  {
    id: '1',
    avatar: 'https://i.pravatar.cc/150?u=1',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$119.99',
    orders: '2400',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '2',
    avatar: 'https://i.pravatar.cc/150?u=2',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$79.99',
    orders: '2400',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '3',
    avatar: 'https://i.pravatar.cc/150?u=3',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$89.99',
    orders: '2400',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '4',
    avatar: 'https://i.pravatar.cc/150?u=4',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$39.99',
    orders: '15',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '5',
    avatar: 'https://i.pravatar.cc/150?u=5',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$69.99',
    orders: '10',
    date: '02.04.2026',
    status: 'Suspend',
  },
  {
    id: '6',
    avatar: 'https://i.pravatar.cc/150?u=6',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$49.99',
    orders: '0',
    date: '02.04.2026',
    status: 'Suspend',
  },
];

const getStatusStyles = (status: UserStatus) => {
  if (status === 'Active') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDE2E2] text-[#CB1B1B]';
};

export default function UsersTable() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
  const [userToView, setUserToView] = useState<UserData | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspend'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message: string) => setToastMessage(message);

  const handleView = (user: UserData) => {
    setUserToView(user);
  };

  const handleEdit = (user: UserData) => {
    setUserToEdit(user);
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
      showToast('User deleted successfully');
    }
  };

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'Active' ? 'Suspend' : 'Active' }
          : user
      )
    );
  };

  const filteredUsers = users.filter(user => 
    statusFilter === 'All' ? true : user.status === statusFilter
  );

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Users
        </p>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <div className='relative w-full sm:w-[250px] shrink-0'>
            <div 
              className='flex h-[36px] w-full items-center justify-between overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] cursor-pointer hover:bg-gray-50 transition-colors'
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995] select-none'>
                {statusFilter === 'All' ? 'Filter By Status' : `Status: ${statusFilter}`}
              </p>
              <ChevronDown size={16} className='text-[#848995]' />
            </div>
            
            {isFilterOpen && (
              <div className='absolute z-10 top-full left-0 mt-[4px] w-full rounded-[2px] border border-[#E5E5E6] bg-white shadow-md'>
                <div 
                  className='px-[12px] py-[8px] text-[14px] text-black hover:bg-gray-50 cursor-pointer'
                  onClick={() => { setStatusFilter('All'); setIsFilterOpen(false); }}
                >
                  All
                </div>
                <div 
                  className='px-[12px] py-[8px] text-[14px] text-black hover:bg-gray-50 cursor-pointer'
                  onClick={() => { setStatusFilter('Active'); setIsFilterOpen(false); }}
                >
                  Active
                </div>
                <div 
                  className='px-[12px] py-[8px] text-[14px] text-black hover:bg-gray-50 cursor-pointer'
                  onClick={() => { setStatusFilter('Suspend'); setIsFilterOpen(false); }}
                >
                  Suspend
                </div>
              </div>
            )}
          </div>
          <button 
            className='flex h-[36px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200'
            onClick={() => showToast('Coming soon!')}
          >
            <span className='text-[14px] font-normal text-black'>Export CSV</span>
            <FileDown size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[34px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='w-[60px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                User
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Name
              </p>
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Email
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Total Spent
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Total Orders
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Joining Date
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-[100px] shrink-0 px-[8px] text-center'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[12px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='w-[60px] shrink-0 px-[8px]'>
                <div className='relative h-[40px] w-[40px] overflow-hidden rounded-[2px]'>
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    sizes='40px'
                    className='object-cover'
                    unoptimized
                  />
                </div>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.name}
                </p>
              </div>
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.email}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.spent}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.orders}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.date}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(user.status)
                  )}
                  onClick={() => toggleStatus(user.id)}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{user.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View User'
                    onClick={() => handleView(user)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit User'
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete User'
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination />

      {/* Edit User Modal */}
      {userToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>Edit User</h3>
              <button 
                onClick={() => setUserToEdit(null)} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-medium text-[#42454D]'>Name</label>
                <input 
                  type='text' 
                  value={userToEdit.name}
                  onChange={(e) => setUserToEdit({...userToEdit, name: e.target.value})}
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] px-[12px] text-[14px] focus-visible:border-black focus-visible:outline-none'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-medium text-[#42454D]'>Email</label>
                <input 
                  type='email' 
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})}
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] px-[12px] text-[14px] focus-visible:border-black focus-visible:outline-none'
                />
              </div>
              <div className='grid grid-cols-2 gap-[16px]'>
                <div className='flex flex-col gap-[8px]'>
                  <label className='text-[14px] font-medium text-[#42454D]'>Total Spent</label>
                  <input 
                    type='text' 
                    value={userToEdit.spent}
                    readOnly
                    className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-gray-50 px-[12px] text-[14px] text-[#848995] focus-visible:outline-none cursor-not-allowed'
                  />
                </div>
                <div className='flex flex-col gap-[8px]'>
                  <label className='text-[14px] font-medium text-[#42454D]'>Total Orders</label>
                  <input 
                    type='text' 
                    value={userToEdit.orders}
                    readOnly
                    className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-gray-50 px-[12px] text-[14px] text-[#848995] focus-visible:outline-none cursor-not-allowed'
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => setUserToEdit(null)}
                className='rounded-[2px] border border-[#E5E5E6] px-[16px] py-[8px] text-[14px] font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setUsers(users.map(u => u.id === userToEdit.id ? userToEdit : u));
                  setUserToEdit(null);
                  showToast('User updated successfully');
                }}
                className='rounded-[2px] bg-black px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-gray-800 focus-visible:outline-none'
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {userToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>User Details</h3>
              <button 
                onClick={() => setUserToView(null)} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex items-center gap-[16px] mb-[24px]'>
              <div className='relative h-[64px] w-[64px] overflow-hidden rounded-full border border-[#E5E5E6]'>
                <Image
                  src={userToView.avatar}
                  alt={userToView.name}
                  fill
                  sizes='64px'
                  className='object-cover'
                  unoptimized
                />
              </div>
              <div>
                <h4 className='text-[16px] font-medium text-black'>{userToView.name}</h4>
                <p className='text-[14px] text-[#848995]'>{userToView.email}</p>
                <div className={cn('mt-[4px] inline-flex items-center rounded-[2px] px-[8px] py-[2px] text-[12px]', getStatusStyles(userToView.status))}>
                  {userToView.status}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-[16px] mb-[24px] border-y border-[#E5E5E6] py-[16px]'>
              <div>
                <p className='text-[12px] text-[#848995] mb-[4px]'>Joining Date</p>
                <p className='text-[14px] font-medium text-black'>{userToView.date}</p>
              </div>
              <div>
                <p className='text-[12px] text-[#848995] mb-[4px]'>Last Login</p>
                <p className='text-[14px] font-medium text-black'>2 days ago</p>
              </div>
              <div>
                <p className='text-[12px] text-[#848995] mb-[4px]'>Total Spent</p>
                <p className='text-[14px] font-medium text-black'>{userToView.spent}</p>
              </div>
              <div>
                <p className='text-[12px] text-[#848995] mb-[4px]'>Total Orders</p>
                <p className='text-[14px] font-medium text-black'>{userToView.orders}</p>
              </div>
            </div>

            <div className='mb-[24px]'>
              <h5 className='text-[14px] font-medium text-black mb-[8px]'>Shipping Address</h5>
              <p className='text-[14px] text-[#42454D] leading-[1.5]'>
                123 Commerce Blvd, Suite 400<br/>
                New York, NY 10001<br/>
                United States
              </p>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={() => setUserToView(null)}
                className='rounded-[2px] bg-black px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-gray-800 focus-visible:outline-none'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[400px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[16px]'>
              <h3 className='text-[18px] font-semibold text-black'>Delete User</h3>
              <button 
                onClick={() => setUserToDelete(null)} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => setUserToDelete(null)}
                className='rounded-[2px] border border-[#E5E5E6] px-[16px] py-[8px] text-[14px] font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className='rounded-[2px] bg-[#CB1B1B] px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-red-700 focus-visible:outline-none'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 rounded-[4px] bg-black px-[16px] py-[12px] text-[14px] font-medium text-white shadow-lg'>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
