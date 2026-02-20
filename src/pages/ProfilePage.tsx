import { useState } from "react";
import type { FormEvent } from "react";

type ProfileDetails = {
  name: string;
  email: string;
  reports: string;
  memberSince: string;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileDetails>({
    name: "Demo User",
    email: "demo.user@example.com",
    reports: "3 Submitted",
    memberSince: "January 2026",
  });
  const [draft, setDraft] = useState<ProfileDetails>(profile);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile(draft);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  return (
    <main className="flex-1 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="panel overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
            alt="Professional workspace with analytics display"
            className="h-44 w-full object-cover"
          />
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f4c81]">Account Center</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="mt-2 text-slate-600">Manage personal details and track your scam reporting activity.</p>
            <div className="mt-5">
              {!isEditing && (
                <button type="button" onClick={handleEdit} className="btn-primary">
                  Edit Profile
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                <p className="text-slate-900 font-semibold mt-1">{profile.name}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                <p className="text-slate-900 font-semibold mt-1">{profile.email}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Reports</p>
                <p className="text-slate-900 font-semibold mt-1">{profile.reports}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Member Since</p>
                <p className="text-slate-900 font-semibold mt-1">{profile.memberSince}</p>
              </div>
            </div>

            {isEditing && (
              <form onSubmit={handleSave} className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                    placeholder="Name"
                    required
                  />
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                    placeholder="Email"
                    required
                  />
                  <input
                    value={draft.reports}
                    onChange={(event) => setDraft((prev) => ({ ...prev, reports: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                    placeholder="Reports"
                    required
                  />
                  <input
                    value={draft.memberSince}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, memberSince: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                    placeholder="Member since"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
