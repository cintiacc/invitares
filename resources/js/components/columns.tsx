import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  id: string
  amount: number
  status: string
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
