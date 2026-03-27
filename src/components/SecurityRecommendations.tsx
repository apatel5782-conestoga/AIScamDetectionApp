import type { FraudAnalysis } from "../types/fraud";
import Card from "./ui/Card";

type Props = {
  analysis: FraudAnalysis | null;
};

export default function SecurityRecommendations({ analysis }: Props) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900">Security Recommendations</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-900">Preventive Safety Measures</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Enable multi-factor authentication on banking and email accounts.</li>
            <li>Verify sender identity with official channels before responding.</li>
            <li>Never share OTP, password, or banking credentials via text or call.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-900">Immediate Steps to Take</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Stop engagement with suspicious sender and preserve message evidence.</li>
            <li>Contact your bank directly if financial details were exposed.</li>
            <li>Change affected passwords and revoke unknown active sessions.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-900">Digital Security Checklist</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Run anti-malware and check browser extensions.</li>
            <li>Review account sign-in logs for unknown devices.</li>
            <li>Update device OS and app patches immediately.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-900">Identity Protection Tips</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Set up credit bureau monitoring and fraud alerts.</li>
            <li>Watch for unauthorized account openings or inquiries.</li>
            <li>Store incident report references and communication records.</li>
          </ul>
        </article>
      </div>
    </Card>
  );
}
