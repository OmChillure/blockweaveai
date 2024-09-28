"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Copy, Check } from "lucide-react"
import { useState } from "react"

const columns = [
  { name: "IP", uid: "ip" },
  { name: "Protocols", uid: "protocols" },
  { name: "Speed", uid: "speed" },
  { name: "Port", uid: "port" },
  { name: "Updated", uid: "updated" },
  { name: "Uptime", uid: "uptime" },
  { name: "Country", uid: "country" },
  { name: "Latency", uid: "latency" },
  { name: "ACTIONS", uid: "actions" },
]

const ips = [
  {
    id: 1,
    ip: "0999",
    protocols: "SOCKS5",
    updated: "2023.32.4",
    speed: "2",
    port: "9000",
    uptime: "78",
    country: "US",
    latency: "123"
  }
]

export default function IPTable() {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = (ip: string, id: number) => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000) // Reset after 2 seconds
    })
  }

  return (
    <div className="container mx-auto p-8 w-screen">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.uid}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ips.map((ip) => (
            <TableRow key={ip.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{ip.ip}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(ip.ip, ip.id)}
                    className="h-8 w-8"
                  >
                    {copiedId === ip.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy IP</span>
                  </Button>
                </div>
              </TableCell>
              <TableCell>{ip.protocols}</TableCell>
              <TableCell>{ip.speed}</TableCell>
              <TableCell>{ip.port}</TableCell>
              <TableCell>{ip.updated}</TableCell>
              <TableCell>{ip.uptime}</TableCell>
              <TableCell>{ip.country}</TableCell>
              <TableCell>{ip.latency}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}