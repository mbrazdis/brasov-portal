import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 mb-8">
        <h1 className="text-3xl font-bold text-center">Contacteaza-ne</h1>
      </header>
      <main className="container mx-auto px-4">
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Date de contact</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              Daca aveti orice fel de intrebari, puteti sa ne gasiti aici: 
            </p>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Adresa</h3>
              <p className="text-gray-700">Strada Galati, nr. 15, Brasov, RO</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Numar de telefon</h3>
              <p className="text-gray-700">071 (234) 567 9</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-gray-700">contact@company.com</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Programul de lucru</h3>
              <p className="text-gray-700">Luni - Vineri: 9:00  - 17:00</p>
              <p className="text-gray-700">Sambata: 10:00 - 14:00</p>
              <p className="text-gray-700">Duminica: OFF / Church : ON</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}