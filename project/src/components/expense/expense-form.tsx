"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Sparkles, Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { categorizeExpenseAutomatically } from "@/ai/flows/categorize-expense-automatically"
import { ExpenseCategory } from "@/app/lib/types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().min(2, "Description is too short"),
  date: z.string().default(() => new Date().toISOString().split('T')[0]),
})

interface ExpenseFormProps {
  onSuccess: (expense: { amount: number; description: string; date: string; category: ExpenseCategory }) => void
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [isCategorizing, setIsCategorizing] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCategorizing(true)
    try {
      const { category } = await categorizeExpenseAutomatically({ description: values.description })
      onSuccess({ ...values, category: category as ExpenseCategory })
      form.reset({ amount: 0, description: "", date: new Date().toISOString().split('T')[0] })
      toast({
        title: "Expense Logged",
        description: `Successfully categorized as ${category}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to categorize expense. Please try again.",
      })
    } finally {
      setIsCategorizing(false)
    }
  }

  return (
    <Card className="w-full shadow-md border-none ring-1 ring-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-headline flex items-center gap-2 text-primary">
          <PlusCircle className="w-5 h-5" />
          Quick Logger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-code">₱</span>
                        <Input 
                          placeholder="0.00" 
                          {...field} 
                          className="pl-7 font-code text-lg" 
                          type="number"
                          step="0.01"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lunch at Chipotle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full py-6 text-base font-semibold transition-all hover:shadow-lg"
              disabled={isCategorizing}
            >
              {isCategorizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI Categorizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Log Expense
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
