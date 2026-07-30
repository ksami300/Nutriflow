"use client";

import { useState } from "react";
import { ErrorBoundaryService } from "@/services/error-boundary.service";

export default function AvatarUpload() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validacija formata i veličine na klijentskom nivou (Maksimalno 2MB)
    if (!file.type.startsWith("image/")) {
      ErrorBoundaryService.handleHttpError(new Error("Dozvoljeni su isključivo slikovni formati (PNG, JPG)"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      ErrorBoundaryService.handleHttpError(new Error("Veličina datoteke prekoračuje limit od 2MB"));
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:5000/api/users/avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Strimovanje avatara neuspešno");
      
      ErrorBoundaryService.handleSuccess("📸 Profilni avatar uspešno urezan u AWS S3 registre!");
    } catch (error) {
      ErrorBoundaryService.handleHttpError(error, "Greška prilikom mrežnog prenosa binarne datoteke");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-white shadow-xl">
      <h3 className="text-lg font-bold tracking-tight">Profilna fotografija</h3>
      <div className="flex items-center space-x-6">
        <div className="h-20 w-26 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden relative">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-slate-600">No Image</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="cursor-pointer inline-block py-2.5 px-4 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-xl font-bold text-sm text-emerald-400 transition-all">
            {uploading ? "Slanje..." : "📷 Izaberi novu sliku"}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
          <p className="text-[10px] text-slate-500 font-medium">Podržani formati: PNG, JPG. Maksimalna veličina: 2MB.</p>
        </div>
      </div>
    </div>
  );
}
