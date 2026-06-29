import UsersTable from '@/components/dashboard/users/UsersTable';

export default function UsersPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full '>
      <UsersTable />
    </div>
  );
}
