import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SettingsForm } from '@/components/admin/settings-form';
import { saveSiteSettings } from '@/lib/actions/singletons';

export const instant = false;

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  const action = saveSiteSettings.bind(null, settings?.id ?? null);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Metadata global dan nilai bawaan untuk SEO."
      />
      <SettingsForm action={action} item={settings} />
    </div>
  );
}
