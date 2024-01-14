import { ArrowRightIcon, CaretSortIcon } from "@radix-ui/react-icons"
import { UsageRow } from "app/dashboard/(base)/usage/page"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table"
  
  export function CustomTable({data} : {data: UsageRow[]}) {
    return (
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="bg-neutral-700 bg-opacity-80">
          <TableRow className="border-none">
            <TableHead className="text-neutral-200"><button className="inline-flex items-center">Project  <CaretSortIcon className="ml-2 h-4 w-4" /></button></TableHead>
            <TableHead className="text-neutral-200">Cost</TableHead>
            <TableHead className="text-neutral-200">Action</TableHead>
            <TableHead className="text-neutral-200 text-right">Agent</TableHead>
            <TableHead className="text-neutral-200 text-right">Model</TableHead>
            <TableHead className="text-neutral-200 text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((usage) => (
            <TableRow key={usage.id}>
              <TableCell className="font-medium group"><Link href={`/dashboard/repo/${usage.project.id}`} className="inline-flex justify-between items-center gap-2">{usage.project.name} <ArrowRightIcon className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"/></Link></TableCell>
              <TableCell>{usage.tokens}</TableCell>
              <TableCell>{usage.action}</TableCell>
              <TableCell className="text-right">{usage.agent}</TableCell>
              <TableCell className="text-right">{usage.model}</TableCell>
              <TableCell className="text-right">{usage.createdAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    )
  }
  