import { Head, Link } from "@inertiajs/react";

import { InvitationLayout, type InvitationLayoutData } from "@/components/invitation-layout";
import { dashboard } from "@/routes";

export default function InvitationPreview({ invitation }: { invitation: InvitationLayoutData }) {
  return (
    <>
      <Head title="Preview do convite" />
      <InvitationLayout
        invitation={invitation}
        badgeLabel="Preview"
        leftHeader={
          <Link
            href={dashboard()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20"
          >
            <span className="text-xl">&larr;</span>
          </Link>
        }
        rightHeader={
          <Link
            href={`/convites/${invitation.id}/editar`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 transition hover:bg-white/25"
            aria-label="Editar convite"
            title="Editar convite"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </Link>
        }
      />
    </>
  );
}
