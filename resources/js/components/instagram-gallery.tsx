export default function InstagramGallery() {
  const images = [
    "/images/galeria/gallery1.jpeg",
    "/images/galeria/gallery2.jpeg",
    "/images/galeria/gallery3.jpeg",
    "/images/galeria/gallery4.jpeg",
    "/images/galeria/gallery5.jpg",
    "/images/galeria/gallery6.jpeg",
  ];

  return (
    <section className="bg-amber-50 py-10 text-center">
      <h3 className="text-3xl font-playfair mb-10">Galeria dos Noivos</h3>
      <br />

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Galeria Instagram"
            className="rounded-lg w-full h-60 object-cover transition-transform hover:scale-105"
          />
        ))}
      </div>
    </section>
  );
}
