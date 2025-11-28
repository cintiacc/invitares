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

