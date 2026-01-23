import { Head, Link } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";

type Invitation = {
  id: number;
  type: string;
  title: string;
  subtitle: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  message: string | null;
  details: string | null;
  note: string | null;
  cover_image: string | null;
  gallery_images: string[] | null;
};

export default function InvitationPreview({ invitation }: { invitation: Invitation }) {
  const coverUrl = invitation.cover_image
    ? `/storage/${invitation.cover_image}`
    : null;
  const gallery = invitation.gallery_images ?? [];

  return (
    <>
      <Head title="Preview do convite" />
      <section className="relative min-h-[100dvh] overflow-hidden bg-[#7a159e] text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-[-4rem] h-72 w-72 rounded-full bg-[#b357ff] opacity-70 blur-2xl" />
          <div className="absolute top-40 left-[-6rem] h-64 w-64 rounded-full bg-[#ff8be3] opacity-50 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#9b46e4] opacity-60 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-6 pb-14 pt-10">
          <header className="flex items-center justify-between">
            <Link
              href={dashboard()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20"
            >
              <span className="text-xl">&larr;</span>
            </Link>
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]">
              Preview
            </span>
          </header>

          <div className="mt-12 flex flex-1 flex-col items-center text-center">
            <div className="mb-8 w-full rounded-[36px] bg-white/10 p-5 shadow-xl ring-1 ring-white/15">
              <div className="rounded-[28px] bg-white/5 p-4">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/20 bg-white/10">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Capa do convite" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/70">
                      Imagem do convite
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-semibold md:text-4xl">{invitation.title}</h1>
            {invitation.subtitle && (
              <p className="mt-2 text-sm text-white/80">{invitation.subtitle}</p>
            )}
            <p className="mt-3 text-sm text-white/70 md:text-base">
              {invitation.event_date
                ? new Date(invitation.event_date).toLocaleDateString()
                : "Sem data"}
              {invitation.event_time ? ` • ${invitation.event_time}` : ""}
            </p>

            {invitation.location && (
              <p className="mt-2 text-sm text-white/70">{invitation.location}</p>
            )}

            {invitation.message && (
              <p className="mt-6 max-w-md text-sm text-white/70">
                {invitation.message}
              </p>
            )}

            {gallery.length > 0 && (
              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                {gallery.map((image) => (
                  <div
                    key={image}
                    className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-white/10"
                  >
                    <img
                      src={`/storage/${image}`}
                      alt="Imagem do convite"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 flex w-full flex-col gap-3">
              {invitation.details && (
                <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
                  {invitation.details}
                </div>
              )}
              {invitation.note && (
                <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
                  {invitation.note}
                </div>
              )}
            </div>

            <div className="mt-8 w-full rounded-full bg-white/10 p-2 shadow-lg ring-1 ring-white/10">
              <div className="flex items-center justify-between text-sm font-medium">
                <Button
                  type="button"
                  className="flex-1 rounded-full bg-white text-[#7a159e] hover:bg-white/90"
                >
                  Aceitar convite
                </Button>
                <span className="mx-3 h-8 w-px bg-white/20" />
                <button className="flex-1 rounded-full px-4 py-2 text-white/80">
                  Talvez
                </button>
                <span className="mx-3 h-8 w-px bg-white/20" />
                <button className="flex-1 rounded-full px-4 py-2 text-white/80">
                  Nao vou
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href={`/convites/${invitation.id}/editar`}>Editar convite</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={dashboard()}>Voltar ao dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
