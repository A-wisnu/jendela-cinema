import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './TicketIssued.css';

const TicketIssued = ({ bookingData, onReset }) => {
    const qrCanvasRef = useRef(null);
    const bookingId = `JC-${Date.now().toString(36).toUpperCase()}`;

    useEffect(() => {
        if (qrCanvasRef.current) {
            QRCode.toCanvas(
                qrCanvasRef.current,
                `JENDELA-CINEMA|${bookingId}|${bookingData.movie.title}|${bookingData.seats.join(',')}|${bookingData.showTime}`,
                {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                }
            );
        }
    }, [bookingId, bookingData]);

    const handleDownload = () => {
        const canvas = qrCanvasRef.current;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ticket-${bookingId}.png`;
        link.href = url;
        link.click();
    };

    return (
        <div className="ticket-issued">
            <div className="halftone-bg"></div>

            <div className="ticket-header">
                <h1 className="ticket-title">MISI SELESAI</h1>
                <p className="ticket-subtitle">Tiket Anda Siap</p>
            </div>

            <div className="ticket-card rotate-in">
                <div className="ticket-front">
                    <div className="ticket-logo">
                        <img src="/logo_web.png" alt="Jendela Cinema" />
                    </div>

                    <div className="ticket-content">
                        <h2 className="movie-title">{bookingData.movie.title}</h2>

                        <div className="ticket-details">
                            <div className="detail-item">
                                <span className="label">ID Pemesanan</span>
                                <span className="value">{bookingId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Jam Tayang</span>
                                <span className="value">{bookingData.showTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Kursi</span>
                                <span className="value">{bookingData.seats.join(', ')}</span>
                            </div>
                            <div className="detail-item total-paid-item">
                                <span className="label">Total Dibayar</span>
                                <span className="value price">Rp {bookingData.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="qr-section">
                            <canvas ref={qrCanvasRef} className="qr-code"></canvas>
                            <p className="qr-instruction">Tunjukkan QR code ini di pintu masuk</p>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <p>Terima kasih telah memilih Jendela Cinema!</p>
                    </div>
                </div>
            </div>

            <div className="ticket-actions">
                <button className="p5-button" onClick={handleDownload}>
                    UNDUH TIKET
                </button>
                <button className="p5-button secondary" onClick={onReset}>
                    KEMBALI KE LOBBY
                </button>
            </div>

            <div className="success-message">
                <p>✓ Salinan telah dikirim ke email Anda</p>
            </div>
        </div>
    );
};

export default TicketIssued;
