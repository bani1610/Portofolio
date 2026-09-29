import { AdminPageHeader } from './admin-page-header';

type FormPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

/**
 * A form page: heading plus the form, in one centred 720px column.
 *
 * The width lives here rather than on the form itself so the heading, the
 * fields and the sticky action bar all measure the same. Before this, the
 * form was 720px pinned to the left of the shell's 1040px column, which left
 * a third of the screen empty beside it and made the action bar read as
 * detached from the fields it belongs to.
 */
export function FormPage({ title, description, children }: FormPageProps) {
  return (
    <div className="mx-auto w-full max-w-[720px] space-y-6">
      <AdminPageHeader title={title} description={description} />
      {children}
    </div>
  );
}
