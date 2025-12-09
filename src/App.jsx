import { useState } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import MovieLobby from './components/MovieLobby';
import SeatSelection from './components/SeatSelection';
import PaymentAuth from './components/PaymentAuth';
import TicketIssued from './components/TicketIssued';
import DFAVisualizer from './components/DFAVisualizer';

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [currentState, setCurrentState] = useState('q0');
    const [lastTransition, setLastTransition] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [bookingData, setBookingData] = useState(null);

    const handleSplashComplete = () => {
        setShowSplash(false);
    };

    const transition = (from, to, input) => {
        setLastTransition({ from, to, input });
        setCurrentState(to);
    };

    // q0 -> q1: select_movie
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        transition('q0', 'q1', 'select_movie');
    };

    // q1 -> q2: confirm_seat
    const handleConfirmSeats = (data) => {
        setBookingData({ ...data, movie: selectedMovie });
        transition('q1', 'q2', 'confirm_seat');
    };

    // q1 -> q0: back
    const handleCancelSeats = () => {
        setSelectedMovie(null);
        transition('q1', 'q0', 'back');
    };

    // q2 -> q3: data_valid (email & payment method valid)
    const handleDataValid = () => {
        transition('q2', 'q3', 'data_valid');
    };

    // q2 -> q1: back (kembali ke pemilihan kursi)
    const handleCancelValidation = () => {
        setBookingData(null);
        transition('q2', 'q1', 'back');
    };

    // q3 -> q4: pin_valid
    const handlePaymentSuccess = () => {
        transition('q3', 'q4', 'pin_valid');
    };

    // q3 -> q2: back (kembali ke validasi data)
    const handleBackToValidation = () => {
        transition('q3', 'q2', 'back');
    };

    // q3 -> q0: back
    const handleCancelPayment = () => {
        setSelectedMovie(null);
        setBookingData(null);
        transition('q3', 'q0', 'back');
    };

    // q4 -> q0: reset
    const handleReset = () => {
        setSelectedMovie(null);
        setBookingData(null);
        transition('q4', 'q0', 'reset');
    };

    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />;
    }

    return (
        <div className="app">
            <div className="split-screen">
                {/* Left Panel - UI (The Metaverse) */}
                <div className="left-panel">
                    {currentState === 'q0' && (
                        <MovieLobby onSelectMovie={handleSelectMovie} />
                    )}
                    {currentState === 'q1' && (
                        <SeatSelection
                            movie={selectedMovie}
                            onConfirm={handleConfirmSeats}
                            onCancel={handleCancelSeats}
                        />
                    )}
                    {(currentState === 'q2' || currentState === 'q3') && (
                        <PaymentAuth
                            bookingData={bookingData}
                            onSuccess={handlePaymentSuccess}
                            onCancel={currentState === 'q2' ? handleCancelValidation : handleCancelPayment}
                            onBack={currentState === 'q3' ? handleBackToValidation : null}
                            currentState={currentState}
                            onDataValid={handleDataValid}
                        />
                    )}
                    {currentState === 'q4' && (
                        <TicketIssued
                            bookingData={bookingData}
                            onReset={handleReset}
                        />
                    )}
                </div>

                {/* Right Panel - DFA Visualizer (The Velvet Room) */}
                <div className="right-panel">
                    <DFAVisualizer
                        currentState={currentState}
                        lastTransition={lastTransition}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
