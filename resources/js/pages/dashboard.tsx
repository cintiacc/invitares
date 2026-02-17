"use client";

import { Head, Link, usePage } from "@inertiajs/react";

import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";

type Invitation = {
  id: number;
  type: string;
  title: string;
  event_date: string | null;
  event_time: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: dashboard().url }];

export default function Dashboard() {
  const { invitations = [] } = usePage().props as { invitations?: Invitation[] };
  const hasInvites = invitations.length > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-6 p-4">
        {!hasInvites && (
          <div className="relative flex min-h-[calc(100vh-12rem)] items-center justify-center overflow-hidden rounded-3xl border bg-gradient-to-b from-[#f7f2ea] via-[#e7f0f6] to-[#f6dcc9] p-8 text-center text-[#2a2622] shadow-sm">
            <div className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-full bg-[#fff6ec] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-6 h-40 w-40 rounded-full bg-[#cfe8f7] blur-3xl" />

            <div className="mx-auto flex max-w-md flex-col items-center gap-3">
              <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#2a2622]"
                >
                  <path
                    d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 9h8M8 12h8M8 15h5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Nenhum convite criado</h2>
              <p className="text-sm text-[#5a524a]">
                Convites criados por voce aparecerao aqui com convidados e presentes por convite.
              </p>
              <Button asChild className="mt-3 w-full rounded-full bg-[#2a2622] text-white hover:bg-[#201d1a] md:w-auto">
                <Link href="/convites/novo">Criar convite</Link>
              </Button>
            </div>
          </div>
        )}

        {hasInvites && (
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Seus convites</h2>
              <Button asChild variant="secondary">
                <Link href="/convites/novo">Novo convite</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {invitations.map((invitation) => (
                <Link
                  key={invitation.id}
                  href={`/convites/${invitation.id}/preview`}
                  className="rounded-2xl border bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {invitation.type}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{invitation.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {invitation.event_date
                      ? new Date(invitation.event_date).toLocaleDateString()
                      : "Sem data"}
                    {invitation.event_time ? ` â€¢ ${invitation.event_time}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
