import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const Developer = ({ videos, title, id }) => {
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        // 0.5초 후 -> setLoading false
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const developerClass = loading ? 'isLoading' : 'isLoaded';

    return (
        <section id={id} className={developerClass}>
            <h2>{title}</h2>

            <div className='developer__inner'>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={15}
                    navigation={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 5,
                            spaceBetween: 25,
                        },
                        768: {
                            slidesPerView: 6,
                            spaceBetween: 25,
                        },
                        1024: {
                            slidesPerView: 7,
                            spaceBetween: 30,
                        },
                        1240: {
                            slidesPerView: 8,
                            spaceBetween: 30,
                        },
                        1640: {
                            slidesPerView: 9,
                            spaceBetween: 30,
                        },
                        2000: {
                            slidesPerView: 10,
                            spaceBetween: 30,
                        },
                    }}
                    modules={[Navigation, Autoplay]}
                    className='mySwiper'
                >
                    {videos.map((developer, key) => (
                        <SwiperSlide key={key}>
                            <div className='developer' key={key}>
                                <div className='developer__img play__icon'>
                                    <Link to={`/channel/${developer.channelId}`}>
                                        <img src={developer.img} alt={developer.name} />
                                    </Link>
                                </div>
                                <div className='developer__info'>
                                    <Link to={`/channel/${developer.channelId}`}>
                                        {developer.name}
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default Developer
