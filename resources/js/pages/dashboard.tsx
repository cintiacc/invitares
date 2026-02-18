"use client";

import { Head, Link, usePage } from "@inertiajs/react";

import AppLayout from "@/layouts/app-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";

type Invitation = {
  id: number;
  type: string;
  title: string;
  event_date: string | null;
  event_time: string | null;
  cover_image: string | null;
};

type LatestUpdate = {
  id: number;
  guest_name: string;
  invitation_title: string;
  status_text: string;
  confirmed_at: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: dashboard().url }];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Dashboard() {
  const { invitations = [], latest_updates = [] } = usePage().props as {
    invitations?: Invitation[];
    latest_updates?: LatestUpdate[];
  };
  const hasInvites = invitations.length > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-8 p-2 sm:p-4">
        {!hasInvites && (
          <div className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden rounded-3xl border bg-gradient-to-b from-[#f7f2ea] via-[#e7f0f6] to-[#f6dcc9] p-10 text-center text-[#2a2622] shadow-sm sm:p-14">
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
          <div className="rounded-3xl border bg-background p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Seus convites</h2>
              <Button asChild variant="secondary">
                <Link href="/convites/novo">Novo convite</Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {invitations.map((invitation) => (
                <Link
                  key={invitation.id}
                  href={`/convites/${invitation.id}/preview`}
                  className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  {invitation.cover_image ? (
                    <div className="h-40 w-full bg-muted">
                      <img
                        src={`/storage/${invitation.cover_image}`}
                        alt={`Capa do convite ${invitation.title}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-muted/40 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Sem capa
                    </div>
                  )}

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {invitation.type}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{invitation.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {invitation.event_date
                        ? new Date(invitation.event_date).toLocaleDateString()
                        : "Sem data"}
                      {invitation.event_time ? ` - ${invitation.event_time}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {hasInvites && (
          <div className="rounded-3xl border bg-background p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Últimas atualizações</h2>

            {latest_updates.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nenhuma resposta de convidados ainda.
              </p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
                {latest_updates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-center gap-3 border-b border-border/50 px-4 py-3 last:border-b-0"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                        {getInitials(update.guest_name)}
                      </AvatarFallback>
                    </Avatar>

                    <p className="text-sm text-foreground">
                      <span className="font-medium">{update.guest_name}</span> {update.status_text} o convite para{" "}
                      <span className="font-medium">{update.invitation_title}</span>.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
