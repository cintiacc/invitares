import { ColumnDef } from "@tanstack/react-table";

export type Guest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  invite_link: string;
  confirmed: boolean;
  confirmed_at: string | null;
};

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
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
        className="text-blue-600 underline"
        target="_blank"
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
    header: "Data da Confirmação",
  },
];
