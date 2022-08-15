import { useCallback, useEffect, useState } from "react";
import Swiper from "swiper";
import "swiper/css";
import "./index.css";

type Image = {
  src: string;
  alt: string;
};
type Props = {
  images: Image[];
};

const AlbumSlider = ({ images }: Props) => {
  const [swiper, setSwiper] = useState<Swiper>();
  const [autoPlayInt, setAutoPlayInt] = useState<any>();
  useEffect(() => {
    setSwiper(
      new Swiper(".swiper", {
        loop: true,
        autoplay: {
          delay: 5000,
        },
        navigation: {
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        },
      })
    );
  }, []);

  const next = useCallback(() => swiper && swiper.slideNext(), [swiper]);
  const prev = useCallback(() => swiper && swiper.slidePrev(), [swiper]);

  useEffect(() => {
    if (!autoPlayInt && swiper) {
      setAutoPlayInt(setInterval(next, 5000));
    }
  }, [swiper, autoPlayInt]);

  return (
    <div className="swiper-container">
      <div className="swiper-prev" onClick={prev} />
      <div className="swiper">
        <div className="swiper-wrapper">
          {images.map((image) => (
            <div key={image.src} className="swiper-slide">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      <div className="swiper-next" onClick={next} />
    </div>
  );
};

export default AlbumSlider;
