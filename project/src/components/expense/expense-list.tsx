
"use client"

import { Expense } from "@/app/lib/types"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, FileDown, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onExport: () => void
}

export function ExpenseList({ expenses, onDelete, onExport }: ExpenseListProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Recent Expenses
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Export PDF
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No expenses recorded yet. Start by adding one above.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id} className="fade-in">
                    <TableCell className="font-medium text-sm">
                      {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-[10px] px-1.5 py-0">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-code font-medium">
                      ₱{expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
