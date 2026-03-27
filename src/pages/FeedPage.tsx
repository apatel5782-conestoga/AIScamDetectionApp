import { useState } from "react";
import type { FormEvent } from "react";

type FeedPost = {
  id: number;
  author: string;
  location: string;
  fraudType: string;
  contactChannel: string;
  impactTargeted: string;
  description: string;
  createdAt: string;
};

const starterPosts: FeedPost[] = [
  {
    id: 1,
    author: "Anonymous User",
    location: "Kitchener, ON",
    fraudType: "Employment Fraud",
    contactChannel: "Email",
    impactTargeted: "$250 training payment",
    description:
      "The sender used a realistic hiring workflow and pressured same-day payment for onboarding. I validated through the official company site and found an impersonation warning.",
    createdAt: "2 days ago",
  },
  {
    id: 2,
    author: "Community Member",
    location: "Waterloo, ON",
    fraudType: "Bank Impersonation",
    contactChannel: "Phone",
    impactTargeted: "Account credentials and OTP",
    description:
      "A caller posing as a bank fraud specialist requested account verification details and OTP while urging me to stay on the line.",
    createdAt: "5 days ago",
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(starterPosts);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [fraudType, setFraudType] = useState("");
  const [contactChannel, setContactChannel] = useState("");
  const [impactTargeted, setImpactTargeted] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !author.trim() ||
      !location.trim() ||
      !fraudType.trim() ||
      !contactChannel.trim() ||
      !impactTargeted.trim() ||
      !description.trim()
    ) {
      return;
    }

    const newPost: FeedPost = {
      id: Date.now(),
      author: author.trim(),
      location: location.trim(),
      fraudType: fraudType.trim(),
      contactChannel: contactChannel.trim(),
      impactTargeted: impactTargeted.trim(),
      description: description.trim(),
      createdAt: "Just now",
    };

    setPosts((previousPosts) => [newPost, ...previousPosts]);
    setAuthor("");
    setLocation("");
    setFraudType("");
    setContactChannel("");
    setImpactTargeted("");
    setDescription("");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="glass-panel p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Community Intelligence</p>
        <h1 className="mt-2 font-display text-3xl text-white">Fraud Experience Feed</h1>
        <p className="mt-3 text-sm text-neutral-300">Share suspicious incidents to improve early detection across the network.</p>
      </section>

      <section className="mt-6 glass-panel p-6">
        <h2 className="font-display text-2xl text-white">Submit a fraud report</h2>
        <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Name" className="form-input" required />
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className="form-input" required />
            <input value={fraudType} onChange={(event) => setFraudType(event.target.value)} placeholder="Fraud type" className="form-input" required />
            <input value={contactChannel} onChange={(event) => setContactChannel(event.target.value)} placeholder="Contact channel" className="form-input" required />
            <input value={impactTargeted} onChange={(event) => setImpactTargeted(event.target.value)} placeholder="What was targeted" className="form-input sm:col-span-2" required />
          </div>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} placeholder="Describe event timeline and warning indicators." className="form-input" required />
          <button type="submit" className="btn-primary w-fit">Post Report</button>
        </form>
      </section>

      <section className="mt-6 space-y-3">
        {posts.map((post) => (
          <article key={post.id} className="glass-panel p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold text-white">{post.author}</h2>
              <span className="text-xs text-neutral-500">{post.createdAt}</span>
            </div>
            <p className="mt-1 text-sm text-neutral-400">{post.location}</p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
              <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-neutral-200">Type: {post.fraudType}</p>
              <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-neutral-200">Channel: {post.contactChannel}</p>
              <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-neutral-200">Target: {post.impactTargeted}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-neutral-300">{post.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
