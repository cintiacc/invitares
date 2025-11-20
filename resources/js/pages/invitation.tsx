import { useEffect, useRef } from "react";

import InstagramGallery from "../components/instagram-gallery";
import CountdownComponent from "../components/coutdown-component";
import { MdMail } from "react-icons/md";
import { BsGift } from "react-icons/bs";

export default function WeddingPage() {
  const historiaRef = useRef<HTMLElement | null>(null);
  const noivosRef = useRef<HTMLElement | null>(null);


  // Função de revelar (IntersectionObserver)
  const reveal = (el: HTMLElement | null) => {
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

  // Extrair query param ?id=...
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const confirmar = () => {
    if (!id) {
      alert("ID do convidado não encontrado");
      return;
    }
  };

  useEffect(() => {
    reveal(historiaRef.current);
    reveal(noivosRef.current);
  }, []);

  return (
    <>
      {/* HERO */}
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
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section
        ref={historiaRef}
        className="mx-auto px-6 py-20 bg-[#eddfd4] opacity-0 translate-y-10 transition-opacity transition-transform duration-700"
      >
        <h3 className="text-3xl font-playfair mb-6 text-center">Nossa História</h3>

        <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
        </p>
      </section>

      {/* OS NOIVOS */}
      <section
        ref={noivosRef}
        className="relative max-w-5xl mx-auto px-6 py-20 opacity-0 translate-y-10 transition-opacity transition-transform duration-700"
      >
        <h3 className="text-3xl font-playfair mb-16 text-center">Os Noivos</h3>

        <div className="relative flex justify-center items-start space-y-32">
          {/* Noiva */}
          <div className="relative z-20 text-center">
            <img
              src="/images/couple1.jpg"
              alt="Noiva"
              className="w-72 h-auto rounded-lg shadow-lg mx-auto"
            />
            <h4 className="text-xl font-semibold mt-4">Gabrielle</h4>
            <p className="text-sm text-gray-500">A Noiva</p>
          </div>

          {/* Noivo */}
          <div className="relative z-10 text-center md:-ml-16">
            <img
              src="/images/couple2.jpg"
              alt="Noivo"
              className="w-72 h-auto rounded-lg shadow-lg mx-auto"
            />
            <h4 className="text-xl font-semibold mt-4">Jonas</h4>
            <p className="text-sm text-gray-500">O Noivo</p>
          </div>
        </div>
      </section>

      {/* NOSSO CASAMENTO */}
      <section id="nosso-casamento" className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-playfair mb-16">Nosso Casamento</h3>

        <div className="flex md:flex-row md:divide-y-0 md:divide-x divide-gray-300">
          <div className="md:w-1/2 px-6 py-4">
            <h4 className="text-xl font-semibold mb-2 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined">event</span>
              Quando
            </h4>
            <p className="text-gray-600">
              Sábado, XX de XXX de XXXX <br />
              Às 16h00
            </p>
          </div>

          <div className="md:w-1/2 px-6 py-4">
            <h4 className="text-xl font-semibold mb-2 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined">location_on</span>
              Onde
            </h4>
            <p className="text-gray-600">
              Espaço Jardim do Sol <br />
              Rua das Flores, 123 - Porto Alegre, RS
            </p>
          </div>
        </div>
      </section>

      {/* PRESENTES */}
      <section className="bg-[#eddfd4] py-20 px-6 text-center">
        <h3 className="text-3xl font-playfair mb-10">Quer nos presentear?</h3>
        <div className="flex justify-center items-center">
            <BsGift size={24} />
        </div>
        <p className="mb-6 text-gray-700">
          Veja nossa lista de presentes e contribua com o que desejar.
        </p>

      </section>

      {/* INSTAGRAM */}
      <section className="py-20 text-center">
        <InstagramGallery />
      </section>

      {/* CONFIRMAÇÃO */}
      <section className="bg-[#eddfd4] py-20 px-6 text-center">
        <h3 className="text-3xl font-playfair mb-10">Confirmação de Presença</h3>

        <div className="bg-[#fffaf0] max-w-md mx-auto border border-gray-300 rounded-xl shadow-lg p-10">
         <div className="flex justify-center items-center">
            <MdMail size={24} />
         </div>
          <p className="mb-6 text-gray-700">
            Por favor, confirme sua presença até 01/09/2025
          </p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section>
        <CountdownComponent />
      </section>
    </>
  );
}
