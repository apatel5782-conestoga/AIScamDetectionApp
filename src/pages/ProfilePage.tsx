import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

type ProfileDetails = {
  name: string;
  username: string;
  email: string;
  phone: string;
  memberSince: string;
};

export default function ProfilePage() {
  const { user, refreshProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileDetails>({
    name: "Demo Analyst",
    username: "fraud_analyst",
    email: "analyst@example.com",
    phone: "(555) 019-4821",
    memberSince: "January 2026",
  });
  const [draft, setDraft] = useState<ProfileDetails>(profile);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    }));
    setDraft((prev) => ({
      ...prev,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    }));
  }, [user]);

  useEffect(() => {
    refreshProfile().catch(() => {
      setError("Unable to load profile details.");
    });
  }, [refreshProfile]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    updateProfile({
      name: draft.name,
      username: draft.username,
      email: draft.email,
      phone: draft.phone,
    })
      .then(() => {
        setProfile(draft);
        setIsEditing(false);
      })
      .catch((err: Error) => setError(err.message || "Failed to update profile."))
      .finally(() => setIsSaving(false));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="glass-panel p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Account Center</p>
        <h1 className="mt-2 font-display text-3xl text-white">Profile</h1>
        <p className="mt-2 text-sm text-neutral-300">Manage your account details and contact information.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-xs text-neutral-400">Name</p><p className="mt-1 text-white">{profile.name}</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-xs text-neutral-400">Username</p><p className="mt-1 text-white">{profile.username}</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-xs text-neutral-400">Email</p><p className="mt-1 text-white">{profile.email}</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-xs text-neutral-400">Phone</p><p className="mt-1 text-white">{profile.phone}</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4"><p className="text-xs text-neutral-400">Member Since</p><p className="mt-1 text-white">{profile.memberSince}</p></div>
        </div>

        {error && !isEditing && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {!isEditing ? (
          <button type="button" onClick={() => setIsEditing(true)} className="btn-primary mt-5">Edit Profile</button>
        ) : (
          <form onSubmit={handleSave} className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} className="form-input" placeholder="Full name" required />
              <input value={draft.username} onChange={(event) => setDraft((prev) => ({ ...prev, username: event.target.value }))} className="form-input" placeholder="Username" required />
              <input type="email" value={draft.email} onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))} className="form-input" placeholder="Email" required />
              <input value={draft.phone} onChange={(event) => setDraft((prev) => ({ ...prev, phone: event.target.value }))} className="form-input" placeholder="Phone number" required />
              <input value={draft.memberSince} onChange={(event) => setDraft((prev) => ({ ...prev, memberSince: event.target.value }))} className="form-input sm:col-span-2" placeholder="Member since" required />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setIsEditing(false);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
