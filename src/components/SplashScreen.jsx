import { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [showCredit, setShowCredit] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const [creditFadeOut, setCreditFadeOut] = useState(false);
    const [logoFadeOut, setLogoFadeOut] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload images first
    useEffect(() => {
        const preloadImages = () => {
            const images = ['/logo_credit.png', '/logo_web.png'];
            let loadedCount = 0;

            images.forEach(src => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        setImagesLoaded(true);
                    }
                };
                img.onerror = () => {
                    // Even on error, continue to prevent infinite loading
                    loadedCount++;
                    if (loadedCount === images.length) {
                        setImagesLoaded(true);
                    }
                };
                img.src = src;
            });
        };

        preloadImages();
    }, []);

    // Start splash animation only after images are loaded
    useEffect(() => {
        if (!imagesLoaded) return;

        // Show credit logo immediately
        setShowCredit(true);

        // Show credit logo for 3 seconds, then fade out
        const creditFadeTimer = setTimeout(() => {
            setCreditFadeOut(true);
            // Wait for fade out animation, then hide
            setTimeout(() => {
                setShowCredit(false);
                setShowLogo(true);
            }, 500);
        }, 3000);

        // Show main logo for 2.5 seconds, then fade out
        const logoFadeTimer = setTimeout(() => {
            setLogoFadeOut(true);
            setTimeout(() => {
                setShowLogo(false);
                onComplete();
            }, 500);
        }, 6000);

        return () => {
            clearTimeout(creditFadeTimer);
            clearTimeout(logoFadeTimer);
        };
    }, [imagesLoaded, onComplete]);

    return (
        <div className="splash-screen">
            {showCredit && (
                <img
                    src="/logo_credit.png"
                    alt="Credit Logo"
                    className={`splash-logo ${creditFadeOut ? 'fade-out' : 'fade-in'}`}
                />
            )}
            {showLogo && (
                <img
                    src="/logo_web.png"
                    alt="Jendela Cinema"
                    className={`splash-logo ${logoFadeOut ? 'fade-out' : 'fade-in'}`}
                />
            )}
        </div>
    );
};

export default SplashScreen;
