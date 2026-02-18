import { useState } from "react";
import { usePage } from "@inertiajs/react";

import { InvitationLayout, type InvitationLayoutData } from "@/components/invitation-layout";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Guest = {
  id: number;
  name: string;
  confirmed: boolean;
  confirmed_at: string | null;
};

export default function Invitation() {
  const { props } = usePage<{ guest: Guest; invitation: InvitationLayoutData }>();
  const guest = props.guest;
  const invitation = props.invitation;

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
      <InvitationLayout
        invitation={invitation}
        badgeLabel="Convite"
        leftHeader={
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20"
          >
            <span className="text-xl">&larr;</span>
          </button>
        }
        onAccept={() => setDialogOpen(true)}
        footerNote={
          guest?.name
            ? `${guest.name}, confirme sua presença para receber atualizações e detalhes do evento.`
            : "Confirme sua presença para receber atualizações e detalhes do evento."
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar presenca</DialogTitle>
          </DialogHeader>

          <p className="mb-6 text-left text-gray-700">Voce confirma presenca neste convite?</p>

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
