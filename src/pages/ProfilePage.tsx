import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";

type ProfileDetails = {
  name: string;
  username: string;
  email: string;
  phone: string;
  memberSince: string;
};

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone || "Not provided";
  return `${phone.slice(0, Math.max(0, phone.length - 4))}${"*".repeat(4)}`;
}

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setSuccessMessage(null);
    setIsSaving(true);

    updateProfile({
      name: draft.name,
      username: draft.username,
      email: draft.email,
      phone: draft.phone,
    })
      .then(() => {
        setProfile((prev) => ({
          ...prev,
          name: draft.name,
          username: draft.username,
          email: draft.email,
          phone: draft.phone,
        }));
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully.");
      })
      .catch((err: Error) => setError(err.message || "Failed to update profile."))
      .finally(() => setIsSaving(false));
  };

  const statCards = [
    { label: "Account Name", value: profile.name },
    { label: "Username", value: profile.username },
    { label: "Primary Email", value: profile.email },
    { label: "Phone", value: profile.phone || "Not provided" },
  ];

  const quickFacts = [
    { label: "Member Since", value: profile.memberSince },
    { label: "Role", value: user?.role === "admin" ? "Administrator" : "Protected user account" },
    { label: "Contact status", value: profile.phone ? "Email and phone available" : "Email only" },
    { label: "Privacy mode", value: "Private case records" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Profile"
        subtitle="Review your account details, keep contact information current, and manage the identity used across private fraud cases."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Account Center</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Your Account Information</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                This information is used to identify your private workspace and keep your saved fraud analysis workflow organized.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-blue-600">Signed in as</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">{profile.name}</p>
              <p className="text-xs text-blue-700">{profile.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {statCards.map((item) => (
              <article key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="mt-2 break-words text-base font-semibold text-gray-900">{item.value}</p>
              </article>
            ))}
          </div>

          {successMessage && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </div>
          )}

          {error && !isEditing && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isEditing ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">
                Edit Profile
              </button>
              <span className="text-sm text-gray-500">Keep your contact details current for case follow-up and account recovery.</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full Name</label>
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                    className="form-input mt-2"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</label>
                  <input
                    value={draft.username}
                    onChange={(event) => setDraft((prev) => ({ ...prev, username: event.target.value }))}
                    className="form-input mt-2"
                    placeholder="Username"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
                    className="form-input mt-2"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</label>
                  <input
                    value={draft.phone}
                    onChange={(event) => setDraft((prev) => ({ ...prev, phone: event.target.value }))}
                    className="form-input mt-2"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(profile);
                    setIsEditing(false);
                    setError(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Account Snapshot</h2>
            <div className="mt-5 space-y-3">
              {quickFacts.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 text-right">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Privacy and Safety</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Email visibility</p>
                <p className="mt-2 text-sm text-gray-700">{profile.email}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Phone visibility</p>
                <p className="mt-2 text-sm text-gray-700">{maskPhone(profile.phone)}</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm leading-6 text-blue-900">
                  Keep your email and phone number accurate so case follow-up, private reports, and account recovery steps stay connected to the right user.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">What This Page Does</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
              <li>Shows the account identity linked to your private fraud workspace.</li>
              <li>Lets you update name, username, email, and phone details.</li>
              <li>Keeps your saved case workflow tied to one consistent user profile.</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
