import { Head } from "@inertiajs/react";

type Props = {
  message: string;
};

export default function ConfirmationError({ message }: Props) {
  return (
    <>
      <Head title="Erro ao confirmar resposta" />
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="w-full max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Nao foi possivel confirmar a resposta</h1>
          <p className="mt-3 text-sm text-slate-600">{message}</p>
        </section>
      </main>
    </>
  );
}
