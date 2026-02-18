import { useState } from "react";
import { usePage } from "@inertiajs/react";

import { InvitationLayout, type InvitationLayoutData } from "@/components/invitation-layout";

type Guest = {
  id: number;
  name: string;
  confirmed: boolean;
  confirmed_at: string | null;
  response_status?: "accepted" | "rejected" | "maybe" | null;
};

type ResponseStatus = "accepted" | "rejected" | "maybe";

export default function Invitation() {
  const { props } = usePage<{ guest: Guest; invitation: InvitationLayoutData }>();
  const guest = props.guest;
  const invitation = props.invitation;

  const [loading, setLoading] = useState(false);

  const selectedResponse: ResponseStatus | null =
    guest.response_status ?? (guest.confirmed ? "accepted" : null);
  const responseLabel: Record<ResponseStatus, string> = {
    accepted: "aceitou",
    maybe: "talvez",
    rejected: "nao irei",
  };

  const registrarPresenca = (response: ResponseStatus): void => {
    if (loading || !guest?.id) {
      return;
    }

    setLoading(true);
    window.location.assign(`/confirmar-presenca/${guest.id}?response=${response}`);
  };

  return (
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
      onAccept={() => registrarPresenca("accepted")}
      onMaybe={() => registrarPresenca("maybe")}
      onReject={() => registrarPresenca("rejected")}
      selectedResponse={selectedResponse}
      responsesDisabled={loading}
      footerNote={
        selectedResponse
          ? `Voce ja respondeu a este convite como "${responseLabel[selectedResponse]}", mas pode alterar sua resposta a qualquer momento.`
          : guest?.name
            ? `${guest.name}, confirme sua presenca para receber atualizacoes e detalhes do evento.`
            : "Confirme sua presenca para receber atualizacoes e detalhes do evento."
      }
    />
  );
}

