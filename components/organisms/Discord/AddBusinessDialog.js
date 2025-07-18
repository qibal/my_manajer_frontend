"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/Shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Shadcn/form";
import { Input } from "@/components/Shadcn/input";
import businessService from "@/service/business_service";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Shadcn/tooltip";


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama bisnis wajib diisi.",
  }),
  avatar: z.string().optional(), // Avatar tidak wajib
});

export function AddBusinessDialog({ onBusinessAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });

  async function onSubmit(values) {
    try {
      const newBusiness = await businessService.create(values);
      console.log("Bisnis baru berhasil ditambahkan:", newBusiness);
      // Panggil callback untuk memberitahu parent bahwa bisnis sudah ditambahkan
      if (onBusinessAdded) {
        onBusinessAdded(newBusiness.data);
      }
      setIsOpen(false); // Tutup dialog setelah berhasil
      form.reset(); // Reset form
    } catch (error) {
      console.error("Gagal menambahkan bisnis:", error);
      // Optional: Tampilkan pesan error ke user
      form.setError("root.serverError", {
        type: "manual",
        message: "Gagal menambahkan bisnis. Silakan coba lagi.",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200"
            onClick={() => setIsOpen(true)} // Open dialog on click
          >
            <Plus className="w-6 h-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tambah Bisnis</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Bisnis Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail bisnis baru Anda di sini.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bisnis</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Perusahaan Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Avatar (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL gambar avatar bisnis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root?.serverError && (
              <p className="text-destructive text-sm text-center">
                {form.formState.errors.root.serverError.message}
              </p>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Bisnis"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 