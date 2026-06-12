"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Eye, EyeOff, ArrowLeft, KeyRound, MailCheck } from "lucide-react";

type ViewState = 'login' | 'forgot_password' | 'enter_code' | 'reset_password';

export default function LoginPage() {
  const [view, setView] = useState<ViewState>('login');
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // UI states
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales inválidas");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar el código");
      } else {
        setMessage(data.message || "Código enviado al correo");
        setView('enter_code');
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: recoveryCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código incorrecto");
      } else {
        setView('reset_password');
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: recoveryCode, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al actualizar contraseña");
      } else {
        setMessage("Contraseña actualizada exitosamente. Por favor, inicia sesión.");
        setView('login');
        setPassword("");
        setRecoveryCode("");
        setNewPassword("");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 relative">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50 relative z-10 transition-all duration-300">
        
        {view === 'login' && (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
                <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Bienvenido
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Ingresa a tu cuenta para gestionar tus finanzas
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    className="relative block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setMessage("");
                        setView('forgot_password');
                      }}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="relative block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {message && (
                <div className="text-emerald-600 text-sm text-center font-medium bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg">
                  {message}
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {view === 'forgot_password' && (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recuperar contraseña
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Ingresa tu correo para recibir un código de verificación de 6 dígitos.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleForgotPasswordSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Correo electrónico (registrado en la app)
                </label>
                <input
                  type="email"
                  required
                  className="relative block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6"
                  placeholder="correo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    "Enviar código"
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setView('login');
                  }}
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          </>
        )}

        {view === 'enter_code' && (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-4">
                <MailCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Ingresa el código
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Hemos enviado un código de 6 dígitos a <br/><span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleVerifyCodeSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-center">
                  Código de verificación
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="relative block w-full rounded-lg border-0 py-3 px-3 text-center text-2xl tracking-[0.5em] font-mono text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700 sm:leading-6"
                  placeholder="000000"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>

              {message && (
                <div className="text-emerald-600 text-sm text-center font-medium bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg">
                  {message}
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || recoveryCode.length !== 6}
                  className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verificando...</span>
                    </div>
                  ) : (
                    "Verificar código"
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMessage("");
                    setView('login');
                  }}
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}

        {view === 'reset_password' && (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
                <KeyRound className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Nueva contraseña
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Ingresa tu nueva contraseña para acceder a la cuenta.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleResetPasswordSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="relative block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || newPassword.length < 6}
                  className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Actualizando...</span>
                    </div>
                  ) : (
                    "Guardar nueva contraseña"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <div className="mt-8 text-center relative z-10">
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          &copy; 2026 desarrollado por Juan Taguado | Todos los derechos reservados
        </p>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
