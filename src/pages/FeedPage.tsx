import { useState } from "react";
import type { FormEvent } from "react";

type FeedPost = {
  id: number;
  author: string;
  location: string;
  scamType: string;
  contactChannel: string;
  amountTargeted: string;
  description: string;
  createdAt: string;
};

const starterPosts: FeedPost[] = [
  {
    id: 1,
    author: "Anonymous User",
    location: "Kitchener, ON",
    scamType: "Job Scam",
    contactChannel: "Email",
    amountTargeted: "$250 training fee",
    description:
      "I received what looked like a legitimate remote job offer with a contract and onboarding timeline. The sender used a company-like email signature and pushed me to pay a training fee within the same day. I checked the official company website and found a warning about recruitment impersonation scams. I stopped responding and reported the email.",
    createdAt: "2 days ago",
  },
  {
    id: 2,
    author: "Community Member",
    location: "Waterloo, ON",
    scamType: "Bank Impersonation",
    contactChannel: "Phone Call",
    amountTargeted: "Bank credentials and OTP",
    description:
      "A caller claimed to be from my bank's fraud team and said my account was under attack. They sounded professional and asked me to confirm my card details and OTP to secure my account. They also pressured me not to hang up. I ended the call, contacted my bank directly through the official number, and confirmed it was a scam attempt.",
    createdAt: "5 days ago",
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(starterPosts);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [scamType, setScamType] = useState("");
  const [contactChannel, setContactChannel] = useState("");
  const [amountTargeted, setAmountTargeted] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !author.trim() ||
      !location.trim() ||
      !scamType.trim() ||
      !contactChannel.trim() ||
      !amountTargeted.trim() ||
      !description.trim()
    ) {
      return;
    }

    const newPost: FeedPost = {
      id: Date.now(),
      author: author.trim(),
      location: location.trim(),
      scamType: scamType.trim(),
      contactChannel: contactChannel.trim(),
      amountTargeted: amountTargeted.trim(),
      description: description.trim(),
      createdAt: "Just now",
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setAuthor("");
    setLocation("");
    setScamType("");
    setContactChannel("");
    setAmountTargeted("");
    setDescription("");
  };

  return (
    <main className="flex-1 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="panel overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1400&q=80"
            alt="People collaborating on digital safety and awareness"
            className="h-44 w-full object-cover"
          />
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f4c81]">Community Reports</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Scam Experience Feed</h1>
            <p className="text-slate-600 mt-2">Share suspicious incidents to help others recognize patterns earlier.</p>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-semibold text-slate-900">Post your experience</h2>
          <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                required
              />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                required
              />
              <input
                value={scamType}
                onChange={(event) => setScamType(event.target.value)}
                placeholder="Scam type (e.g., job scam, phishing)"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                required
              />
              <input
                value={contactChannel}
                onChange={(event) => setContactChannel(event.target.value)}
                placeholder="Contact channel (email, phone, SMS)"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
                required
              />
              <input
                value={amountTargeted}
                onChange={(event) => setAmountTargeted(event.target.value)}
                placeholder="What they wanted (money/data/OTP)"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 sm:col-span-2"
                required
              />
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write the full story: how contact started, what they asked for, warning signs, and what action you took."
              rows={6}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
              required
            />

            <button type="submit" className="btn-primary w-full sm:w-fit">
              Post Experience
            </button>
          </form>
        </section>

        <section className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="panel p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-slate-900">{post.author}</h2>
                <span className="text-xs text-slate-500">{post.createdAt}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{post.location}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                <p className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="font-semibold text-slate-700">Type:</span> {post.scamType}
                </p>
                <p className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="font-semibold text-slate-700">Channel:</span> {post.contactChannel}
                </p>
                <p className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="font-semibold text-slate-700">Target:</span> {post.amountTargeted}
                </p>
              </div>
              <p className="text-slate-700 mt-3 leading-7">{post.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
