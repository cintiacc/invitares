"use client";

import { useState, useEffect } from "react";
import { usePage, useForm, router, Head } from "@inertiajs/react";
import type { PageProps } from "@inertiajs/core";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";

import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { IconPlus } from "@tabler/icons-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

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

export default function Dashboard() {
  const { guests = [], gifts = [] } = usePage().props as {
    guests?: Guest[];
    gifts?: Gift[];
  };

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ---------------------
  // ALERT DE AUTO-FECHAR
  // ---------------------
  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 4500);
      return () => clearTimeout(t);
    }
  }, [alert]);

  // --------------------------------
  // FORM PARA CADASTRAR CONVIDADO
  // --------------------------------
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

  // --------------------------------
  // CONFIRMAR EXCLUSÃO DE CONVIDADO
  // --------------------------------
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

  // ----------------------
  // TABELA DE CONVIDADOS
  // ----------------------
  const columns: ColumnDef<Guest>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "E-mail" },
    { accessorKey: "phone", header: "Telefone" },
    {
      accessorKey: "invite_link",
      header: "Convite",
      cell: ({ row }) => (
        <a className="text-blue-600 underline" href={row.original.invite_link} target="_blank">
          Abrir convite
        </a>
      ),
    },
    {
      accessorKey: "confirmed",
      header: "Confirmado",
      cell: ({ row }) => (row.original.confirmed ? "Sim" : "Não"),
    },
    {
      accessorKey: "confirmed_at",
      header: "Data da confirmação",
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

  // --------------------------------
  // FORM PARA CADASTRAR PRESENTE
  // --------------------------------
  const [giftAlert, setGiftAlert] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

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

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    postGift("/gifts", {
      onSuccess: () => {
        resetGift();
        setGiftAlert({ type: "success", message: "Presente cadastrado!" });
        router.reload();
      },
      onError: () => {
        setGiftAlert({ type: "error", message: "Erro ao cadastrar presente." });
      },
    });
  };

  // --------------------------------------
  // CONFIRMAÇÃO DE EXCLUSÃO DE PRESENTE
  // --------------------------------------
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

  // -------------------
  // TABELA DE PRESENTES
  // -------------------
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
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setGiftToDelete(row.original.id)}
        >
          Excluir
        </Button>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-6 p-4">

        {/* ----------------- ALERT ----------------- */}
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mb-4">
            <AlertTitle>{alert.type === "error" ? "Erro" : "Sucesso"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {/* ---------------------------------- */}
        {/*      MODAL ADICIONAR CONVIDADO      */}
        {/* ---------------------------------- */}
        <Dialog>
          <div className="flex justify-end">
            <ButtonGroup>
              <DialogTrigger asChild>
                <Button variant="secondary">Adicionar convidado</Button>
              </DialogTrigger>
              <ButtonGroupSeparator />
              <DialogTrigger asChild>
                <Button size="icon" variant="secondary">
                  <IconPlus size={18} />
                </Button>
              </DialogTrigger>
            </ButtonGroup>
          </div>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Convidado</DialogTitle>
            </DialogHeader>

            {alert && (
              <Alert
                variant={alert.type === "success" ? undefined : "destructive"}
                className="mb-4"
              >
                {alert.type === "success" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
                <AlertTitle>{alert.type === "success" ? "Sucesso!" : "Erro!"}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

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

        {/* --------------------- TABELA DE CONVIDADOS --------------------- */}
        <div className="rounded-xl border p-4 overflow-auto">
          <DataTable<Guest, any> columns={columns} data={guests ?? []} />
        </div>

        {/* CONFIRMAR EXCLUSÃO DE CONVIDADO */}
        <AlertDialog open={guestToDelete !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir convidado?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setGuestToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteGuest}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ---------------------------------------
                  ADICIONAR PRESENTE
        ---------------------------------------- */}
        <Dialog>
          <div className="flex justify-end">
            <ButtonGroup>
              <DialogTrigger asChild>
                <Button variant="secondary">Adicionar presente</Button>
              </DialogTrigger>
              <ButtonGroupSeparator />
              <DialogTrigger asChild>
                <Button size="icon" variant="secondary">
                  <IconPlus size={18} />
                </Button>
              </DialogTrigger>
            </ButtonGroup>
          </div>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Presente</DialogTitle>
            </DialogHeader>

            {giftAlert && (
              <Alert
                variant={giftAlert.type === "success" ? undefined : "destructive"}
                className="mb-4"
              >
                {giftAlert.type === "success" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
                <AlertTitle>{giftAlert.type === "success" ? "Sucesso!" : "Erro!"}</AlertTitle>
                <AlertDescription>{giftAlert.message}</AlertDescription>
              </Alert>
            )}

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
                <Button type="submit" disabled={giftProcessing}>Salvar presente</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --------------------- TABELA DE PRESENTES --------------------- */}
        <div className="rounded-xl border p-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-3">Presentes cadastrados</h2>
          <DataTable<Gift, any> columns={giftColumns} data={gifts ?? []} />
        </div>

        {/* CONFIRMAR EXCLUSÃO DE PRESENTE */}
        <AlertDialog open={giftToDelete !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir presente?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
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
