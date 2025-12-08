import { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [showCredit, setShowCredit] = useState(true);
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        // Show credit logo for 3.5 seconds
        const creditTimer = setTimeout(() => {
            setShowCredit(false);
            // Wait for fade out, then show main logo
            setTimeout(() => {
                setShowLogo(true);
            }, 500);
        }, 3500);

        // Show main logo for 2.5 seconds, then complete
        const logoTimer = setTimeout(() => {
            setShowLogo(false);
            setTimeout(() => {
                onComplete();
            }, 500);
        }, 7500);

        return () => {
            clearTimeout(creditTimer);
            clearTimeout(logoTimer);
        };
    }, [onComplete]);

    return (
        <div className="splash-screen">
            {showCredit && (
                <img
                    src="/logo_credit.png"
                    alt="Credit Logo"
                    className={`splash-logo ${!showCredit ? 'fade-out' : 'fade-in'}`}
                />
            )}
            {showLogo && (
                <img
                    src="/logo_web.png"
                    alt="Jendela Cinema"
                    className={`splash-logo ${!showLogo ? 'fade-out' : 'fade-in'}`}
                />
            )}
        </div>
    );
};

export default SplashScreen;
