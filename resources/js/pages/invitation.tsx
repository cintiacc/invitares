import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";

import InstagramGallery from "../components/instagram-gallery";
import CountdownComponent from "../components/coutdown-component";

import { MdMail } from "react-icons/md";
import { BsGift } from "react-icons/bs";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// =============================
// TIPAGEM DO CONVIDADO
// =============================
type Guest = {
  id: number;
  name: string;
  confirmed: boolean;
  confirmed_at: string | null;
};

// =============================
// COMPONENTE
// =============================
export default function Invitation() {
  const historiaRef = useRef<HTMLElement | null>(null);
  const noivosRef = useRef<HTMLElement | null>(null);

  // Guest vindo do Laravel via Inertia
  const { props } = usePage<{ guest: Guest }>();
  const guest = props.guest;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // =============================
  // Função REVEAL com tipagem
  // =============================
  const reveal = (el: HTMLElement | null): void => {
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("opacity-0", "translate-y-10");
          el.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
  };

  useEffect(() => {
    reveal(historiaRef.current);
    reveal(noivosRef.current);
  }, []);

  // =============================
  // Registrar confirmação
  // =============================
  const registrarPresenca = async (confirmed: boolean): Promise<void> => {
    if (!guest?.id) {
      alert("ID do convidado não encontrado.");
      return;
    }

    try {
      setLoading(true);

      await fetch(`/confirmar-presenca/${guest.id}?confirmed=${confirmed}`, {
        method: "GET",
      });

      alert("Presença registrada!");
      setDialogOpen(false);

    } catch (error) {
      alert("Erro ao registrar presença!");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // RETORNO DO COMPONENTE
  // =============================
  return (
    <>
      {/* -------------------- HERO -------------------- */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-section.jpg"
            alt="Fundo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl md:text-6xl">
            Convite<br /> de Casamento
          </h2>

          <br />

          <p className="text-lg md:text-xl mb-6">
            Gabrielle e Jonas
          </p>

          <div className="flex justify-center mt-8">
            <svg
              className="w-8 h-8 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* -------------------- NOSSA HISTÓRIA -------------------- */}
      <section
        ref={historiaRef}
        className="mx-auto px-6 py-20 bg-[#eddfd4] opacity-0 translate-y-10 transition-opacity duration-700"
      >
        <h3 className="text-3xl font-playfair mb-6 text-center">Nossa História</h3>

        <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
        </p>
      </section>

      {/* -------------------- OS NOIVOS -------------------- */}
      <section
        ref={noivosRef}
        className="max-w-5xl mx-auto px-6 py-20 opacity-0 translate-y-10 transition-opacity duration-700"
      >
        <h3 className="text-3xl font-playfair mb-16 text-center">Os Noivos</h3>

        <div className="flex justify-center items-start space-y-32 relative">
          <div className="text-center z-20">
            <img src="/images/couple1.jpg" className="w-72 rounded-lg shadow-lg mx-auto" />
            <h4 className="text-xl font-semibold mt-4">Gabrielle</h4>
            <p className="text-sm text-gray-500">A Noiva</p>
          </div>

          <div className="text-center z-10 md:-ml-16">
            <img src="/images/couple2.jpg" className="w-72 rounded-lg shadow-lg mx-auto" />
            <h4 className="text-xl font-semibold mt-4">Jonas</h4>
            <p className="text-sm text-gray-500">O Noivo</p>
          </div>
        </div>
      </section>

      {/* -------------------- PRESENTES -------------------- */}
      <section className="bg-[#eddfd4] py-20 px-6 text-center">
        <h3 className="text-3xl font-playfair mb-10">Quer nos presentear?</h3>

        <div className="flex justify-center"><BsGift size={24} /></div>

        <p className="mb-6 text-gray-700">
          Veja nossa lista de presentes e contribua como desejar.
        </p>
      </section>

      {/* -------------------- INSTAGRAM -------------------- */}
      <section className="py-20 text-center">
        <InstagramGallery />
      </section>

      {/* -------------------- CONFIRMAÇÃO -------------------- */}
      <section className="bg-[#eddfd4] py-20 px-6 text-center">
        <h3 className="text-3xl font-playfair mb-10">Confirmação de Presença</h3>

        <div className="bg-[#fffaf0] max-w-md mx-auto border rounded-xl shadow-lg p-10">
          <div className="flex justify-center"><MdMail size={24} /></div>

          <p className="mb-6 text-gray-700">
            Por favor, confirme sua presença até 01/09/2025
          </p>

          <Button onClick={() => setDialogOpen(true)}>
            Confirmar presença
          </Button>
        </div>
      </section>

      {/* -------------------- COUNTDOWN -------------------- */}
      <section>
        <CountdownComponent />
      </section>

      {/* -------------------- DIALOG -------------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar presença</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 mb-6 text-left">
            Você confirma presença no casamento?
          </p>

          <DialogFooter className="flex justify-between">
            <Button
              disabled={loading}
              onClick={() => registrarPresenca(true)}
            >
              Confirmar presença
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
