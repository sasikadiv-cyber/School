import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  const settings = await getSiteSettings("draft");
  return (
    <AdminShell user={admin} title="Site Settings" subtitle="Navigation, footer & public contact details">
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
