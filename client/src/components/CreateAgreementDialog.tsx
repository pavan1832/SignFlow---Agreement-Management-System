import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAgreement } from "@/hooks/use-agreements";
import { Loader2, Upload, FileText } from "lucide-react";

// Schema for the form (client-side validation before FormData)
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  signerEmail: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateAgreementDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const createMutation = useCreateAgreement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("signerEmail", data.signerEmail);
    formData.append("file", file);

    createMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        reset();
        setFile(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <FileText className="mr-2 h-4 w-4" />
          New Agreement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-gray-900">
            Create Agreement
          </DialogTitle>
          <DialogDescription>
            Upload a PDF and assign a signer to start the process.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">Agreement Title</Label>
            <Input
              id="title"
              placeholder="e.g. Non-Disclosure Agreement"
              {...register("title")}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signerEmail" className="text-gray-700 font-medium">Signer's Email</Label>
            <Input
              id="signerEmail"
              type="email"
              placeholder="signer@company.com"
              {...register("signerEmail")}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
            {errors.signerEmail && (
              <p className="text-sm text-red-500">{errors.signerEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Document (PDF)</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer relative group">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
              <div className="space-y-1 text-center">
                {file ? (
                  <div className="flex flex-col items-center text-primary">
                    <FileText className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Upload a file</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || !file}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create & Draft"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
