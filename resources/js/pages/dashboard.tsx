"use client";

import { useState, useEffect } from "react";
import { usePage, useForm, router, Head, Link } from "@inertiajs/react";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";

import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";

import { FaRegCopy } from "react-icons/fa";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: dashboard().url },
];

type Guest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  invite_link: string;
  confirmed: boolean;
  confirmed_at: string | null;
};

type Gift = {
  id: number;
  name: string;
  link: string;
  image_link: string | null;
};

type Invitation = {
  id: number;
  type: string;
  title: string;
  event_date: string | null;
  event_time: string | null;
};

export default function Dashboard() {
  const { invitations = [], guests = [], gifts = [] } = usePage().props as {
    invitations?: Invitation[];
    guests?: Guest[];
    gifts?: Gift[];
  };
  const hasGuests = guests.length > 0;
  const hasGifts = gifts.length > 0;
  const hasInvites = invitations.length > 0;

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ALERT DE AUTO-FECHAR
  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 4500);
      return () => clearTimeout(t);
    }
  }, [alert]);

  // -----------------------------
  // FORM CONVIDADO
  // -----------------------------
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/guests", {
      onSuccess: () => {
        reset();
        setAlert({ type: "success", message: "Convidado cadastrado com sucesso!" });
        router.reload();
      },
      onError: () => {
        setAlert({ type: "error", message: "Erro ao cadastrar convidado." });
      },
    });
  };

  // Excluir convidado
  const [guestToDelete, setGuestToDelete] = useState<number | null>(null);

  const confirmDeleteGuest = () => {
    if (!guestToDelete) return;

    router.delete(`/guests/${guestToDelete}`, {
      onSuccess: () => {
        setAlert({ type: "success", message: "Convidado excluído!" });
        setGuestToDelete(null);
        router.reload();
      },
      onError: () => {
        setAlert({ type: "error", message: "Erro ao excluir convidado." });
      },
    });
  };

  // -----------------------------
  // COLUNAS TABELA DE CONVIDADOS
  // -----------------------------
  const columns: ColumnDef<Guest>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "E-mail" },
    { accessorKey: "phone", header: "Telefone" },
    {
      accessorKey: "invite_link",
      header: "Convite",
      cell: ({ row }) => {
        const link = row.original.invite_link;

        const copyToClipboard = async () => {
          try {
            await navigator.clipboard.writeText(link);
            setAlert({ type: "success", message: "Link copiado para a área de transferência" });
          } catch (error) {
            console.error("Erro ao copiar o link:", error);
            setAlert({ type: "error", message: "Erro ao copiar o link." });
          }
        };

        return (
          <div className="flex items-center gap-3">
            {/* Abrir convite */}
            <a
              className="text-blue-600 underline"
              href={link}
              target="_blank"
            >
              Abrir convite
            </a>

            {/* Botão de copiar */}
            <FaRegCopy size={14} onClick={copyToClipboard} />
          </div>
        );
      },
    },

    {
      accessorKey: "confirmed",
      header: "Confirmado",
      cell: ({ row }) => (row.original.confirmed ? "Sim" : "Não"),
    },
    {
      accessorKey: "confirmed_at",
      header: "Data",
      cell: ({ row }) =>
        row.original.confirmed_at
          ? new Date(row.original.confirmed_at).toLocaleString()
          : "-",
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setGuestToDelete(row.original.id)}
        >
          Excluir
        </Button>
      ),
    },
  ];

  // -----------------------------
  // FORM PRESENTE + EDIÇÃO
  // -----------------------------
  const {
    data: giftData,
    setData: setGiftData,
    post: postGift,
    processing: giftProcessing,
    errors: giftErrors,
    reset: resetGift,
  } = useForm({
    name: "",
    link: "",
    image_link: "",
  });

  const [giftAlert, setGiftAlert] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEditGift = (gift: Gift) => {
    setSelectedGift(gift);

    // Preenche o form
    setGiftData({
      name: gift.name,
      link: gift.link,
      image_link: gift.image_link ?? "",
    });

    setOpenDialog(true);
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGift) {
      router.put(`/gifts/${selectedGift.id}`, giftData, {
        onSuccess: () => {
          setSelectedGift(null);
          setOpenDialog(false);
          router.reload();
        },
      });
    } else {
      router.post("/gifts", giftData, {
        onSuccess: () => {
          setOpenDialog(false);
          router.reload();
        },
      });
    }
  };

  // Excluir presente
  const [giftToDelete, setGiftToDelete] = useState<number | null>(null);

  const confirmDeleteGift = () => {
    if (!giftToDelete) return;

    router.delete(`/gifts/${giftToDelete}`, {
      onSuccess: () => {
        setAlert({ type: "success", message: "Presente excluído!" });
        setGiftToDelete(null);
        router.reload();
      },
      onError: () => {
        setAlert({ type: "error", message: "Erro ao excluir presente." });
      },
    });
  };

  // Colunas tabela de presentes
  const giftColumns: ColumnDef<Gift>[] = [
    { accessorKey: "name", header: "Presente" },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => (
        <a className="text-blue-600 underline" href={row.original.link} target="_blank">
          Abrir
        </a>
      ),
    },
    {
      accessorKey: "image_link",
      header: "Imagem",
      cell: ({ row }) =>
        row.original.image_link ? (
          <img src={row.original.image_link} className="h-12 w-12 rounded-md object-cover" />
        ) : (
          "-"
        ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button variant="destructive" size="sm" onClick={() => setGiftToDelete(row.original.id)}>
          Excluir
        </Button>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-6 p-4">
        {/* ALERTA GERAL */}
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mb-4">
            <AlertTitle>{alert.type === "error" ? "Erro" : "Sucesso"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {/* ---------------------------------- */}
        {/*    MODAL ADICIONAR CONVIDADO       */}
        {/* ---------------------------------- */}
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Convidado</DialogTitle>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input placeholder="Nome" value={data.name} onChange={(e) => setData("name", e.target.value)} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <Input placeholder="E-mail" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <Input placeholder="Telefone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={processing}>Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
                Convites criados por voce aparecerao aqui com convidados confirmados e presentes.
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
                    {invitation.event_time ? ` • ${invitation.event_time}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* --------------------- TABELA DE CONVIDADOS --------------------- */}
        {hasGuests && (
          <div className="rounded-xl border p-4 overflow-auto">
            <DataTable<Guest, any> columns={columns} data={guests ?? []} />
          </div>
        )}

        {/* CONFIRMAR EXCLUSÃO DE CONVIDADO */}
        <AlertDialog open={guestToDelete !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir convidado?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setGuestToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteGuest}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* --------------------------------------- */}
        {/*         DIALOG CADASTRAR PRESENTE       */}
        {/* --------------------------------------- */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedGift ? "Editar Presente" : "Cadastrar Presente"}
              </DialogTitle>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleGiftSubmit}>
              <Input placeholder="Título do presente" value={giftData.name} onChange={(e) => setGiftData("name", e.target.value)} />
              {giftErrors.name && <p className="text-red-500 text-sm">{giftErrors.name}</p>}

              <Input placeholder="Link do produto" value={giftData.link} onChange={(e) => setGiftData("link", e.target.value)} />
              {giftErrors.link && <p className="text-red-500 text-sm">{giftErrors.link}</p>}

              <Input placeholder="URL da imagem (opcional)" value={giftData.image_link} onChange={(e) => setGiftData("image_link", e.target.value)} />
              {giftErrors.image_link && <p className="text-red-500 text-sm">{giftErrors.image_link}</p>}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={giftProcessing}>
                  {selectedGift ? "Salvar alterações" : "Salvar presente"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --------------------- TABELA DE PRESENTES --------------------- */}
        {hasGifts && (
          <div className="rounded-xl border p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-3">Presentes cadastrados</h2>

            <DataTable
              columns={giftColumns}
              data={gifts ?? []}
              onRowClick={handleEditGift}
            />
          </div>
        )}

        {/* CONFIRMAR EXCLUSÃO DE PRESENTE */}
        <AlertDialog open={giftToDelete !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir presente?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setGiftToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteGift}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
