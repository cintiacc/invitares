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

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: dashboard().url,
  },
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

export default function Dashboard() {
  // Props vindas do backend (garanta que o controller envia 'guests')
  const { guests = [] } = usePage().props as { guests?: Guest[] };

  const [alert, setAlert] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ---------------------------
  // Função de exclusão (definida antes das columns)
  // ---------------------------
  const handleDelete = (id: number) => {
    if (!confirm("Deseja realmente excluir este convidado?")) return;

    router.delete(`/guests/${id}`, {
      onSuccess: () => {
        // recarrega a página para atualizar a lista
        router.reload();
      },
      onError: () => {
        setAlert({ type: "error", message: "Erro ao excluir convidado." });
      },
    });
  };

  // ---------------------------
  // Colunas tipadas para Guest
  // ---------------------------
  const columns: ColumnDef<Guest>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      accessorKey: "phone",
      header: "Telefone",
    },
    {
      accessorKey: "invite_link",
      header: "Convite",
      cell: ({ row }) => (
        <a
          href={row.original.invite_link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
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
      cell: ({ row }) => {
        const guest = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(guest.id)}
            >
              Excluir
            </Button>
          </div>
        );
      },
    },
  ];

  // ---------------------------
  // Submit do formulário (criar guest)
  // ---------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/guests", {
      onSuccess: () => {
        reset();
        setAlert({ type: "success", message: "Convidado cadastrado com sucesso!" });
        // opcional: recarregar para atualizar lista imediatamente
        router.reload();
      },
      onError: () => {
        setAlert({ type: "error", message: "Ocorreu um erro ao cadastrar o convidado." });
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* TOPO - Botão + Modal */}
        <Dialog>
          <div className="flex items-center justify-start mb-2">
            <ButtonGroup>
              <DialogTrigger asChild>
                <Button variant="secondary" className="cursor-pointer">
                  Adicionar convidado
                </Button>
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
              <DialogDescription>
                Preencha os dados abaixo para adicionar um convidado.
              </DialogDescription>
            </DialogHeader>

            {/* ALERT */}
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

            {/* FORMULÁRIO */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Nome"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <Input
                placeholder="E-mail"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <Input
                placeholder="Telefone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>

                <Button type="submit" disabled={processing}>
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* TABELA DE GUESTS */}
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border flex-1 overflow-auto">
          <DataTable<Guest, any> columns={columns} data={guests ?? []} />
        </div>
      </div>
    </AppLayout>
  );
}
