export const metadata = { title: "Platform Settings" };

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Platform Settings</h1>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="platformName" className="text-sm font-medium text-text">Platform Name</label>
            <input id="platformName" type="text" defaultValue="TalkIndia" className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="supportEmail" className="text-sm font-medium text-text">Support Email</label>
            <input id="supportEmail" type="email" defaultValue="support@talkindia.in" className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="supportPhone" className="text-sm font-medium text-text">Support Phone</label>
            <input id="supportPhone" type="tel" defaultValue="+91 98765 43210" className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="platformFee" className="text-sm font-medium text-text">Platform Fee (%)</label>
            <input id="platformFee" type="number" defaultValue="10" className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="button" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
