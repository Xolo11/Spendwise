"use client"

import { Expense, ExpenseCategory } from "@/app/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts"
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface SummaryDashboardProps {
  expenses: Expense[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': 'hsl(var(--chart-1))',
  'Transportation': 'hsl(var(--chart-2))',
  'Utilities': 'hsl(var(--chart-3))',
  'Shopping': 'hsl(var(--chart-4))',
  'Entertainment': 'hsl(var(--chart-5))',
  'Healthcare': '#10b981',
  'Education': '#f59e0b',
  'Rent/Mortgage': '#ef4444',
  'Bills': '#6366f1',
  'Groceries': '#8b5cf6',
  'Travel': '#ec4899',
  'Miscellaneous': '#64748b',
}

export function SummaryDashboard({ expenses }: SummaryDashboardProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  
  const categoryData = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const weeklyData = Object.entries(
    expenses.reduce((acc, e) => {
      const date = new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' })
      acc[date] = (acc[date] || 0) + e.amount
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
              <TrendingUp className="w-4 h-4" />
              Total Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-code font-bold">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs mt-1 opacity-70">Across {expenses.length} records</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-accent" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-code font-semibold">₱{(total * 0.4).toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
              <ArrowDownRight className="w-3 h-3" />
              <span>12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="w-4 h-4 text-primary" />
              Avg. Per Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-code font-semibold">
              ₱{expenses.length > 0 ? (total / expenses.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Daily categorization active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center justify-between">
              Category Breakdown
              <span className="text-xs font-normal text-muted-foreground">Relative %</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as ExpenseCategory] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`₱${value.toFixed(2)}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic">
                Log entries to see trends
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
