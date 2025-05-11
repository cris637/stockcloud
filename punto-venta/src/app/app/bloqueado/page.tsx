export default function BloqueadoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-lg p-6">
        <h1 className="text-2xl font-bold text-error mb-4">Tienda pausada</h1>
        <p className="text-center">
          Tu tienda se encuentra pausada. Por favor contactá al administrador o regularizá tu cuenta para continuar.
        </p>
      </div>
    </div>
  )
}
