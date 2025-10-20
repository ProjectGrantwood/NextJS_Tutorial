import AddCustomerForm from '@/app/ui/customers/add-customer-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Add Customer',
            href: '/dashboard/customers/add',
            active: true,
          },
        ]}
      />
      <AddCustomerForm />
    </main>
  );
}