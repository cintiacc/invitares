import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";

type Guest = {
  id: number;
  name: string;
};

type Invitation = {
  id: number;
  title: string;
};

type ResponseStatus = "accepted" | "rejected" | "maybe";

type Props = {
  guest: Guest;
  invitation: Invitation | null;
  invite_url: string;
  response_status: ResponseStatus;
};

const responseTextMap: Record<ResponseStatus, string> = {
  accepted: "aceitou",
  maybe: "marcou como talvez",
  rejected: "nao irei",
};

export default function ConfirmationSuccess({
  guest,
  invitation,
  invite_url,
  response_status,
}: Props) {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowToast(false), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title="Resposta enviada" />

      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="w-full max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Resposta enviada com sucesso</h1>
          <p className="mt-3 text-sm text-slate-600">
            Obrigado, <span className="font-medium">{guest.name}</span>. Sua resposta foi registrada.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Voce <span className="font-medium">{responseTextMap[response_status]}</span> para{" "}
            <span className="font-medium">{invitation?.title ?? "este convite"}</span>.
          </p>

          <div className="mt-6">
            <a
              href={invite_url}
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Voltar ao convite
            </a>
          </div>
        </section>
      </main>

      {showToast && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          Obrigado! Sua resposta foi enviada com sucesso.
        </div>
      )}
    </>
  );
}
