import { type ReactNode } from "react";
import { CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

export type InvitationLayoutData = {
  id: number;
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
  theme_color: string | null;
  font_color: string | null;
};

type InvitationLayoutProps = {
  invitation: InvitationLayoutData;
  leftHeader: ReactNode;
  rightHeader?: ReactNode;
  badgeLabel: string;
  onAccept?: () => void;
  onMaybe?: () => void;
  onReject?: () => void;
  selectedResponse?: "accepted" | "rejected" | "maybe" | null;
  responsesDisabled?: boolean;
  footerNote?: string;
};

export function InvitationLayout({
  invitation,
  leftHeader,
  rightHeader,
  badgeLabel,
  onAccept,
  onMaybe,
  onReject,
  selectedResponse,
  responsesDisabled = false,
  footerNote,
}: InvitationLayoutProps) {
  const coverUrl = invitation.cover_image ? `/storage/${invitation.cover_image}` : null;
  const gallery = invitation.gallery_images ?? [];

  const isValidHex = (value: string | null | undefined) =>
    typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
  const baseColor = isValidHex(invitation.theme_color) ? invitation.theme_color! : "#7a159e";
  const fontColor = isValidHex(invitation.font_color) ? invitation.font_color! : "#ffffff";

  const clamp = (value: number) => Math.min(255, Math.max(0, value));
  const adjustColor = (hex: string, amount: number) => {
    const sanitized = hex.replace("#", "");
    if (sanitized.length !== 6) return hex;
    const num = parseInt(sanitized, 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0xff) + amount);
    const b = clamp((num & 0xff) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const buttonStyle = (isActive: boolean) => {
    if (isActive) {
      return { backgroundColor: "#ffffff", color: baseColor };
    }

    return { backgroundColor: "rgba(255,255,255,0.08)", color: fontColor };
  };

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ backgroundColor: baseColor, color: fontColor }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute -top-24 right-[-4rem] h-72 w-72 rounded-full opacity-70 blur-2xl"
          style={{ backgroundColor: adjustColor(baseColor, 70) }}
        />
        <div
          className="absolute top-40 left-[-6rem] h-64 w-64 rounded-full opacity-50 blur-3xl"
          style={{ backgroundColor: adjustColor(baseColor, 40) }}
        />
        <div
          className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full opacity-60 blur-3xl"
          style={{ backgroundColor: adjustColor(baseColor, 90) }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-6 pb-14 pt-10">
        <header className="flex items-center justify-between">
          {leftHeader}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]">
              {badgeLabel}
            </span>
            {rightHeader}
          </div>
        </header>

        <div className="mt-12 flex flex-1 flex-col items-center text-center">
          <div className="mb-8 w-full rounded-[36px] bg-white/10 p-5 shadow-xl ring-1 ring-white/15">
            <div className="rounded-[28px] bg-white/5 p-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/20 bg-white/10">
                {coverUrl ? (
                  <img src={coverUrl} alt="Capa do convite" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm opacity-70">
                    Imagem do convite
                  </div>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-semibold md:text-4xl">{invitation.title || "Convite"}</h1>
          {invitation.subtitle && <p className="mt-2 text-sm opacity-80">{invitation.subtitle}</p>}

          <p className="mt-3 inline-flex items-center gap-2 text-sm opacity-80 md:text-base">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>
              {invitation.event_date ? new Date(invitation.event_date).toLocaleDateString() : "Sem data"}
              {invitation.event_time ? ` - ${invitation.event_time}` : ""}
            </span>
          </p>

          {invitation.location && (
            <p className="mt-2 inline-flex items-center gap-2 text-sm opacity-80">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{invitation.location}</span>
            </p>
          )}

          {invitation.message && <p className="mt-6 max-w-md text-sm opacity-70">{invitation.message}</p>}

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
              <div className="rounded-2xl bg-white/10 p-4 text-sm opacity-80">{invitation.details}</div>
            )}
            {invitation.note && (
              <div className="rounded-2xl bg-white/10 p-4 text-sm opacity-80">{invitation.note}</div>
            )}
          </div>

          <div className="mt-8 w-full rounded-2xl bg-white/10 p-2 shadow-lg ring-1 ring-white/10">
            <div className="grid grid-cols-3 gap-2 text-sm font-medium">
              <Button
                type="button"
                disabled={responsesDisabled}
                className="h-10 w-full rounded-full transition"
                style={buttonStyle(selectedResponse === "accepted")}
                onClick={onAccept}
              >
                Aceitar
              </Button>
              <Button
                type="button"
                disabled={responsesDisabled}
                className="h-10 w-full rounded-full px-3 py-2 text-center transition"
                style={buttonStyle(selectedResponse === "maybe")}
                onClick={onMaybe}
              >
                Talvez
              </Button>
              <Button
                type="button"
                disabled={responsesDisabled}
                className="h-10 w-full rounded-full px-3 py-2 text-center transition"
                style={buttonStyle(selectedResponse === "rejected")}
                onClick={onReject}
              >
                Nao irei
              </Button>
            </div>
          </div>

          {footerNote && <p className="mt-6 max-w-sm text-xs opacity-60">{footerNote}</p>}
        </div>
      </div>
    </section>
  );
}
