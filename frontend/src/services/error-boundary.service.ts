import toast from "react-hot-toast";

export class ErrorBoundaryService {
  /**
   * 🛡️ CENTRALIZOVANO PRESRETANJE I SIGNALIZACIJA MREŽNIH GREŠAKA (Google Standard)
   */
  static handleHttpError(error: any, fallbackMessage: string = "Sistemska greška u Frankfurtu"): void {
    console.error("🚨 [GLOBAL HTTP EXCEPTION INTERCEPTOR]:", error);
    
    const message = error instanceof Error ? error.message : fallbackMessage;
    
    // Slanje vizuelnog signala na interfejs preko ugrađenog Toaster-a
    toast.error(message, {
      id: "global-http-error",
      style: {
        background: "#0f172a",
        color: "#f87171",
        border: "1px solid #1e293b",
        borderRadius: "16px",
        fontSize: "14px"
      }
    });
  }

  /**
   * 🎉 SIGNALIZACIJA USPEŠNO IZVRŠENIH ASINHRONIH PRENOSA
   */
  static handleSuccess(message: string): void {
    toast.success(message, {
      style: {
        background: "#0f172a",
        color: "#34d399",
        border: "1px solid #1e293b",
        borderRadius: "16px",
        fontSize: "14px"
      }
    });
  }
}
