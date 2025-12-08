import { useState } from 'react';
import './PaymentAuth.css';

const PaymentAuth = ({ bookingData, onSuccess, onCancel, currentState, onDataValid }) => {
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);

    const CORRECT_PIN = '1234'; // Demo PIN

    const paymentMethods = [
        { id: 'ewallet', name: 'E-Wallet', icon: '💳' },
        { id: 'bank', name: 'Transfer Bank', icon: '🏦' },
        { id: 'credit', name: 'Kartu Kredit', icon: '💰' }
    ];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handlePinInput = (digit) => {
        if (pin.length < 4) {
            setPin(pin + digit);
        }
    };

    const handleClear = () => {
        setPin('');
        setError('');
    };

    // Handle validation for q2 state (email & payment method)
    const handleValidateData = () => {
        if (!email) {
            setError('Email harus diisi!');
            return;
        }

        if (!validateEmail(email)) {
            setError('Format email tidak valid!');
            return;
        }

        if (!paymentMethod) {
            setError('Pilih metode pembayaran!');
            return;
        }

        // Data valid, transition to q3 (PIN input)
        setError('');
        onDataValid();
    };

    // Handle PIN submission for q3 state
    const handleSubmit = () => {
        if (pin.length !== 4) {
            setError('PIN harus 4 digit!');
            return;
        }

        if (pin === CORRECT_PIN) {
            onSuccess();
        } else {
            setAttempts(prev => prev + 1);
            setError(`PIN salah! Percobaan ${attempts + 1}/3`);
            setPin('');

            if (attempts >= 2) {
                alert('Terlalu banyak percobaan gagal! Kembali ke lobby...');
                onCancel();
            }
        }
    };

    return (
        <div className="payment-auth">
            <div className="halftone-bg"></div>

            <div className="payment-header">
                <h1 className="payment-title">RUANG INTEROGASI</h1>
                <p className="payment-subtitle">Autentikasi Pembayaran</p>
            </div>

            <div className="mascot-dialog">
                <div className="dialog-bubble">
                    <p>Jangan sampai salah!</p>
                    <span className="hint">Petunjuk: PIN adalah 1234</span>
                </div>
            </div>

            <div className="booking-details">
                <h3>Ringkasan Pemesanan</h3>
                <div className="detail-row">
                    <span>Film:</span>
                    <strong>{bookingData.movie.title}</strong>
                </div>
                <div className="detail-row">
                    <span>Jam Tayang:</span>
                    <strong>{bookingData.showTime}</strong>
                </div>
                <div className="detail-row">
                    <span>Kursi:</span>
                    <strong>{bookingData.seats.join(', ')}</strong>
                </div>
                <div className="detail-row total-row">
                    <span>Total:</span>
                    <strong className="total-amount">Rp {bookingData.totalPrice.toLocaleString('id-ID')}</strong>
                </div>
            </div>

            {currentState === 'q2' && (
                <>
                    <div className="email-container">
                        <label className="email-label">Email Konfirmasi</label>
                        <input
                            type="email"
                            placeholder="masukkan@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="email-input"
                        />
                    </div>

                    <div className="payment-method-container">
                        <h3 className="payment-method-title">Pilih Metode Pembayaran</h3>
                        <div className="payment-methods">
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    className={`payment-method-btn ${paymentMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setPaymentMethod(method.id);
                                        setError('');
                                    }}
                                >
                                    <span className="payment-icon">{method.icon}</span>
                                    <span className="payment-name">{method.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="validation-actions">
                        <button className="p5-button primary" onClick={handleValidateData}>
                            LANJUTKAN
                        </button>
                    </div>
                </>
            )}

            {currentState === 'q3' && (
                <div className="pin-container">
                    <div className="pin-display">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`}>
                                {i < pin.length ? '●' : '○'}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="numpad">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                className="numpad-button"
                                onClick={() => handlePinInput(num.toString())}
                            >
                                {num}
                            </button>
                        ))}
                        <button className="numpad-button clear" onClick={handleClear}>
                            CLR
                        </button>
                        <button className="numpad-button" onClick={() => handlePinInput('0')}>
                            0
                        </button>
                        <button className="numpad-button confirm" onClick={handleSubmit}>
                            OK
                        </button>
                    </div>
                </div>
            )}

            <div className="payment-actions">
                <button className="p5-button secondary" onClick={onCancel}>
                    BATAL
                </button>
            </div>
        </div>
    );
};

export default PaymentAuth;
