import { useState } from "react";
import { usePage } from "@inertiajs/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Guest = {
  id: number;
  name: string;
  confirmed: boolean;
  confirmed_at: string | null;
};

export default function Invitation() {
  const { props } = usePage<{ guest: Guest }>();
  const guest = props.guest;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const registrarPresenca = async (confirmed: boolean): Promise<void> => {
    if (!guest?.id) {
      alert("ID do convidado nao encontrado.");
      return;
    }

    try {
      setLoading(true);

      await fetch(`/confirmar-presenca/${guest.id}?confirmed=${confirmed}`, {
        method: "GET",
      });

      alert("Presenca registrada!");
      setDialogOpen(false);
    } catch (error) {
      alert("Erro ao registrar presenca!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden bg-[#7a159e] text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-[-4rem] h-72 w-72 rounded-full bg-[#b357ff] opacity-70 blur-2xl" />
          <div className="absolute top-40 left-[-6rem] h-64 w-64 rounded-full bg-[#ff8be3] opacity-50 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#9b46e4] opacity-60 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-6 pb-14 pt-10">
          <header className="flex items-center justify-between">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <span className="text-xl">&larr;</span>
            </button>
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]">
              Convite
            </span>
          </header>

          <div className="mt-12 flex flex-1 flex-col items-center text-center">
            <div className="mb-8 w-full rounded-[36px] bg-white/10 p-5 shadow-xl ring-1 ring-white/15">
              <div className="rounded-[28px] bg-white/5 p-4">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/20 bg-white/10">
                  <div className="flex h-full items-center justify-center text-sm text-white/70">
                    Imagem do convite
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-semibold md:text-4xl">
              Festa do convite
            </h1>
            <p className="mt-3 text-sm text-white/70 md:text-base">
              Domingo, 25 de janeiro as 19:00
            </p>

            <div className="mt-8 w-full rounded-full bg-white/10 p-2 shadow-lg ring-1 ring-white/10">
              <div className="flex items-center justify-between text-sm font-medium">
                <Button
                  type="button"
                  className="flex-1 rounded-full bg-white text-[#7a159e] hover:bg-white/90"
                  onClick={() => setDialogOpen(true)}
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

            <p className="mt-6 max-w-sm text-xs text-white/60">
              Confirme sua presenca para receber atualizacoes e detalhes do evento.
            </p>
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar presenca</DialogTitle>
          </DialogHeader>

          <p className="mb-6 text-left text-gray-700">
            Voce confirma presenca neste convite?
          </p>

          <DialogFooter className="flex justify-between">
            <Button disabled={loading} onClick={() => registrarPresenca(true)}>
              Confirmar presenca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
