"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatNairaFromKobo } from "@/lib/format";
import { donationCategories } from "@/lib/validators/donation";
import type { Donation } from "@/types";

export function DonationsTable({ donations }: { donations: Donation[] }) {
  function exportCsv() {
    const header = ["date", "name", "email", "category", "amount", "status", "reference"];
    const rows = donations.map((row) =>
      [
        row.created_at,
        row.is_anonymous ? "Anonymous" : row.name ?? "",
        row.email ?? "",
        row.category,
        (row.amount / 100).toFixed(2),
        row.status,
        row.reference,
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donations.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" render={<Link href="/admin/donations" />}>
          All
        </Button>
        {["success", "pending", "failed"].map((status) => (
          <Button key={status} size="sm" variant="outline" render={<Link href={`/admin/donations?status=${status}`} />}>
            {status}
          </Button>
        ))}
        {donationCategories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant="ghost"
            render={<Link href={`/admin/donations?category=${encodeURIComponent(category)}`} />}
          >
            {category}
          </Button>
        ))}
        <Button size="sm" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>
      {donations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No donations match these filters.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{formatDateTime(row.created_at)}</TableCell>
                <TableCell>{row.is_anonymous ? "Anonymous" : row.name ?? "—"}</TableCell>
                <TableCell>{row.email ?? "—"}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{formatNairaFromKobo(row.amount)}</TableCell>
                <TableCell className="capitalize">{row.status}</TableCell>
                <TableCell className="font-mono text-xs">{row.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
