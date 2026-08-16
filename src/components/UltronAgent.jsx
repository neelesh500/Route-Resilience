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

    const speakAgent = (text, lang = 'en-US') => {
        setReply(text);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            // Change to soft, pleasant female voice
            const voices = window.speechSynthesis.getVoices();
            const softVoice = voices.find(v => v.lang === 'hi-IN' || v.name.includes('Female') || v.name.includes('Google हिन्दी'));
            if (softVoice) utterance.voice = softVoice;

            utterance.pitch = 1.2; // Higher, sweeter pitch
            utterance.rate = 0.95; // Calm, normal speed
            utterance.volume = 1;
            utterance.lang = lang;

            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = (cmd) => {
        let response = '';
        let lang = 'en-US';

        const isHindi = /[\u0900-\u097F]|(kholo|dikhao|batao|kya hai|panna|chalo|yahan|mera|dekho|karo|tum)/i.test(cmd);
        if (isHindi) lang = 'hi-IN';

        console.log("Registered Voice Command:", cmd, "| Detected Lang:", lang);

        const normalizedCmd = cmd.replace(/[-\s]/g, '').toLowerCase();

        // 1. Navigation Commands (Extremely Loose Matching)
        if (/(dashboard|dash|map|कमांड|डैशबोर्ड|मैप|सेंटर|dashboardopen)/i.test(normalizedCmd)) {
            response = isHindi ? "Ji haan, main dashboard khol rahi hoon. Kripya screen par dekhein." : "Opening the dashboard for you now.";
            speakAgent(response, lang);
            navigate('/dashboard');
        }
        else if (/(method|work|kaise|मेथड|तरीका|काम)/i.test(normalizedCmd)) {
            response = isHindi ? "Bilkul, main aapko methodology page par le jaa rahi hoon." : "Navigating to the methodology section.";
            speakAgent(response, lang);
            navigate('/methodology');
        }
        else if (/(data|resource|file|डेटा|फाइल|स्रोत)/i.test(normalizedCmd)) {
            response = isHindi ? "Haan ji, main data aur resources file khol rahi hoon." : "Opening the data resources right away.";
            speakAgent(response, lang);
            navigate('/data');
        }
        else if (/(metric|eval|result|रिजल्ट|मेट्रिक्स|परिणाम)/i.test(normalizedCmd)) {
            response = isHindi ? "Main results aur metrics page khol rahi hoon, dekhiye." : "Fetching the evaluation metrics for you.";
            speakAgent(response, lang);
            navigate('/evaluation');
        }
        else if (/(home|main|shuru|wapas|होम|वापस|शुरू|pichhe)/i.test(normalizedCmd)) {
            response = isHindi ? "Main aapko home page par wapas le aayi hoon." : "Taking you back to the home page.";
            speakAgent(response, lang);
            navigate('/');
        }

        // 2. Normal Conversational Commands
        else if (/(hello|hi|hey|sun|suno|namaste|नमस्ते|सुनों|kaise ho|how are you|kya haal)/i.test(cmd)) {
            response = isHindi
                ? "Namaste! Main Route Resilience AI hoon. Main aapki kaise madad kar sakti hoon? Aap mujhe koi bhi page kholne ke liye keh sakte hain."
                : "Hello! I am your AI assistant. How can I help you today?";
            speakAgent(response, lang);
        }
        else if (/(tum kaun ho|who are you|tumhara naam)/i.test(cmd)) {
            response = isHindi
                ? "Main ek AI assistant hoon. Mera kaam is route network website par aapko guide karna hai."
                : "I am an AI assistant designed to help you navigate this route network platform.";
            speakAgent(response, lang);
        }
        else if (/(dhanyawad|thanks|thank you|shukriya|achha)/i.test(cmd)) {
            response = isHindi
                ? "Aapka swagat hai! Agar aur koi zarurat ho toh zaroor batayen."
                : "You're very welcome! Let me know if you need anything else.";
            speakAgent(response, lang);
        }

        // 3. Conversational Fallback
        else {
            response = isHindi
                ? "Mujhe theek se samajh nahi aaya. Par main aapse baat karke khush hoon! Website ghoomne ke liye aap 'Dashboard kholo' jaisa kuch keh sakte hain."
                : "I didn't quite catch that, but I'm happy to chat. Try asking me to open the dashboard!";
            speakAgent(response, lang);
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
