import { useEffect, useState } from "react";

export default function CountdownComponent() {
  const targetDate = new Date("2026-05-30T00:00:00");

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const updateCountdown = () => {
    const now = new Date();
    const distance = targetDate.getTime() - now.getTime();

    if (distance <= 0) {
      setCountdown({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    setCountdown({
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    });
  };

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#fffaf0] py-16 px-4 text-center">
      <h3 className="text-3xl font-playfair mb-10">Contagem Regressiva</h3>

      <div className="flex justify-center space-x-4 text-gray-800 text-lg md:text-2xl font-medium">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{countdown.days}</span>
          <span>Dias</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{countdown.hours}</span>
          <span>Horas</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{countdown.minutes}</span>
          <span>Min</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{countdown.seconds}</span>
          <span>Seg</span>
        </div>
      </div>
    </section>
  );
}
