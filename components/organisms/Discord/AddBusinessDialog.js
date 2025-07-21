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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar";
import { upload } from '@vercel/blob/client';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama bisnis wajib diisi." }),
  avatar: z.string().optional(),
});

export function AddBusinessDialog({ onBusinessAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        form.setError("avatar", { type: "manual", message: "File harus berupa gambar." });
        setAvatarPreview(null);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      form.clearErrors("avatar");
    } else {
      setSelectedFile(null);
      setAvatarPreview(null);
    }
  };

  async function uploadAvatar(file) {
    if (!file) return null;
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/bisnis/avatar',
      });

      console.log('Vercel Blob upload result:', newBlob);
      return newBlob.url;

    } catch (error) {
      console.error("Error uploading avatar:", error);
      form.setError("avatar", { type: "manual", message: `Gagal mengunggah avatar: ${error.message}` });
      return null;
    }
  }

  async function onSubmit(values) {
    console.log("🚀 ~ onSubmit AddBusinessDialog ~ values:", values)
    try {
      let avatarUrl = values.avatar; // Default to existing avatar if no new file

      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile);
        if (!avatarUrl) {
          return; // Stop submission if upload failed
        }
      }

      const newBusiness = await businessService.create({ ...values, avatar: avatarUrl });
      console.log("Bisnis baru berhasil ditambahkan:", newBusiness);
      if (onBusinessAdded) {
        onBusinessAdded(newBusiness.data);
      }
      setIsOpen(false);
      form.reset();
      setAvatarPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Gagal menambahkan bisnis:", error);
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
            onClick={() => setIsOpen(true)}
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
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Avatar (Opsional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  {avatarPreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={avatarPreview} />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">Pratinjau Avatar</p>
                    </div>
                  )}
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