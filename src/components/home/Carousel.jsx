import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Carousel({ slides = [] }) {
  const activeSlides = slides.filter((slide) => slide.isActive !== false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === activeSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) {
    return (
      <section className="section">
        <div className="hero">
          <p className="hero-kicker">Althea Shop</p>
          <h1>Matériel médical professionnel</h1>
          <p>
            Découvrez notre sélection de produits pour les professionnels de
            santé.
          </p>
        </div>
      </section>
    );
  }

  const goPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeSlides.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === activeSlides.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="section">
      <div className="home-carousel">
        <div
          className="home-carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {activeSlides.map((slide) => (
            <div className="home-carousel-slide" key={slide.id}>
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="home-carousel-image"
                />
              )}

              <div className="home-carousel-overlay">
                <p className="hero-kicker">Althea Shop</p>
                <h1>{slide.title}</h1>

                {slide.subtitle && <p>{slide.subtitle}</p>}

                {slide.ctaLabel && slide.ctaUrl && (
                  <Link to={slide.ctaUrl} className="btn btn-primary">
                    {slide.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-left"
              onClick={goPrevious}
              aria-label="Slide précédent"
            >
              <span>‹</span>
            </button>

            <button
              type="button"
              className="carousel-arrow carousel-arrow-right"
              onClick={goNext}
              aria-label="Slide suivant"
            >
              <span>›</span>
            </button>

            <div className="carousel-dots">
              {activeSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={index === currentIndex ? "active" : ""}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Afficher le slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Carousel;