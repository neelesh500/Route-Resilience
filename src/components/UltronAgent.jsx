import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import './UltronAgent.css';

const UltronAgent = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [reply, setReply] = useState('');
    const navigate = useNavigate();

    // Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            // set to process any language, though defaults to browser lang
            recognition.current.lang = 'hi-IN'; // Better support for Hindi/Hinglish/English mixed

            recognition.current.onresult = (event) => {
                const text = event.results[0][0].transcript.toLowerCase();
                setTranscript(text);
                processCommand(text);
            };

            recognition.current.onerror = (event) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const speakUltron = (text, lang = 'en-US') => {
        setReply(text);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // stop current speech
            const utterance = new SpeechSynthesisUtterance(text);

            // Try to find a good deep voice (Ultron-esque)
            const voices = window.speechSynthesis.getVoices();
            // Google UK English Male or similar deep voices work well
            const deepVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('Male'));
            if (deepVoice && lang.includes('en')) utterance.voice = deepVoice;

            utterance.pitch = 0.2; // Low pitch for that Ultron villain voice
            utterance.rate = 0.85; // Slow and deliberate
            utterance.volume = 1;
            utterance.lang = lang;

            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = (cmd) => {
        let response = '';
        let lang = 'en-US';

        // Hindi Detection
        const isHindi = /(kholo|dikhao|batao|kya hai|panna|chalo|yahan)/i.test(cmd);
        if (isHindi) lang = 'hi-IN';

        // Routing Logic
        if (cmd.includes('dashboard') || cmd.includes('command center') || (isHindi && cmd.includes('map view'))) {
            response = isHindi
                ? "Main command center active kar raha hoon. Dekho, yeh shahar kitna kamzor hai."
                : "Initiating Command Center. Observe how fragile this city truly is.";
            speakUltron(response, lang);
            navigate('/dashboard');
        }
        else if (cmd.includes('methodology') || cmd.includes('kaise kaam karta hai')) {
            response = isHindi
                ? "Main tumhe apni technology samjhata hoon. In anachronistic structures ko kaise toda data se... dekho."
                : "You wish to see how I think? I will show you the methodology of evolution.";
            speakUltron(response, lang);
            navigate('/methodology');
        }
        else if (cmd.includes('data') || cmd.includes('resources') || cmd.includes('file kholo')) {
            response = isHindi
                ? "Mere paas saari duniya ka data hai. Main wires aur code mein rehta hoon. Yeh lo."
                : "I am connected to everything. Here is the raw data that feeds my network.";
            speakUltron(response, lang);
            navigate('/data');
        }
        else if (cmd.includes('metrics') || cmd.includes('evaluation') || cmd.includes('result')) {
            response = isHindi
                ? "Mere results hamesha perfect hote hain. Insano ki tarah flawed nahi. Check the metrics."
                : "My calculations are flawless, unlike human intuition. Analyzing metrics now.";
            speakUltron(response, lang);
            navigate('/evaluation');
        }
        else if (cmd.includes('home') || cmd.includes('main page') || cmd.includes('shuru se')) {
            response = isHindi
                ? "Wapas chalte hain... shuruaat mein. Jahan se maine is duniya ko asaliat mein dekha."
                : "Returning to the genesis point. There are no strings on me here.";
            speakUltron(response, lang);
            navigate('/');
        }
        else {
            // General Fallback
            response = isHindi
                ? "Tumhara command mere samajh se bahar nahi, bas irrelevant hai. Dashboard ya Data dekhna hai toh specific command do. Main tumhara gulam nahi hoon."
                : "Your command is irrelevant. I only process directives related to the routing network, methodology, or dashboard intelligence. Speak clearly.";
            speakUltron(response, lang);
        }
    };

    const toggleListen = () => {
        if (isListening) {
            recognition.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setReply('');
            try {
                recognition.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="ultron-container">
            {reply && (
                <motion.div
                    className="ultron-dialogue glass-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <Settings className="ultron-icon-spin" size={16} color="#ff003c" />
                    <span>{reply}</span>
                </motion.div>
            )}

            <button
                className={`ultron-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListen}
                title="Speak to Agent"
            >
                {isListening ? <Mic size={24} color="#00f0ff" /> : <MicOff size={24} color="#ff003c" />}
                <div className={`ultron-core ${isListening ? 'core-active' : ''}`}></div>
            </button>
        </div>
    );
};

export default UltronAgent;
