import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, X, MessageSquare, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './UltronAgent.css';

const UltronAgent = () => {
    const [isListening, setIsListening] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I am your AI Guide. You can type here or use the mic to talk to me.", lang: 'en-US' }
    ]);
    const [inputText, setInputText] = useState('');
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    // Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'hi-IN';

            recognition.current.onresult = (event) => {
                const text = event.results[0][0].transcript;
                handleUserMessage(text);
            };

            recognition.current.onerror = (event) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [SpeechRecognition]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const speakAgent = (text, lang = 'en-US') => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            // Natural Male Voice
            const voices = window.speechSynthesis.getVoices();
            const maleVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('Google UK English Male')) && v.lang.includes('en'));
            const hindiVoice = voices.find(v => v.lang === 'hi-IN');

            if (lang === 'hi-IN' && hindiVoice) {
                utterance.voice = hindiVoice;
            } else if (maleVoice) {
                utterance.voice = maleVoice;
            }

            utterance.pitch = 1.0;
            utterance.rate = 1.0;
            utterance.volume = 1;
            utterance.lang = lang;

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleUserMessage = (text) => {
        setMessages(prev => [...prev, { sender: 'user', text }]);
        processCommand(text);
    };

    const submitText = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleUserMessage(inputText.trim());
        setInputText('');
    };

    const processCommand = (cmd) => {
        let response = '';
        let lang = 'en-US';

        const isHindi = /[\u0900-\u097F]|(kholo|dikhao|batao|kya hai|panna|chalo|yahan|mera|dekho|karo|tum|kaise|ho|haan|nahi|kya)/i.test(cmd);
        if (isHindi) lang = 'hi-IN';

        const normalizedCmd = cmd.replace(/[-\s]/g, '').toLowerCase();

        if (/(dashboard|dash|map|कमांड|डैशबोर्ड|मैप|सेंटर|dashboardopen)/i.test(normalizedCmd)) {
            response = "Ji haan, main dashboard khol raha hoon. Kripya screen par dekhein.";
            navigate('/dashboard');
        }
        else if (/(method|work|kaisekam|kaisekaam|तरीका|काम)/i.test(normalizedCmd)) {
            response = "Bilkul, main aapko methodology page par le ja raha hoon.";
            navigate('/methodology');
        }
        else if (/(data|resource|file|डेटा|फाइल|स्रोत)/i.test(normalizedCmd)) {
            response = "Haan ji, main data aur resources access kar raha hoon.";
            navigate('/data');
        }
        else if (/(metric|eval|result|रिजल्ट|मेट्रिक्स|परिणाम)/i.test(normalizedCmd)) {
            response = "Main aapko results aur metrics dikhata hoon.";
            navigate('/evaluation');
        }
        else if (/(home|main|shuru|wapas|होम|वापस|शुरू|pichhe)/i.test(normalizedCmd)) {
            response = "Chalye, home page par vapis chalte hain.";
            navigate('/');
        }

        else if (/(hello|hi|hey|sun|suno|namaste|नमस्ते|सुनों)/i.test(normalizedCmd)) {
            response = "Namaste! Main aapka AI assistant hoon. Boliye main aapki kya madad kar sakta hoon?";
        }
        else if (/(tum kaun ho|who are you|tumhara naam|aap kaun|who is this)/i.test(cmd.toLowerCase())) {
            response = "Main ek AI agent hoon. Aap mujhe kisi bhi section par le jaane or uske baare mein puchhne ke liye keh sakte hain.";
        }
        else if (/(kaise ho|how are you|kya haal|how do you do)/i.test(cmd.toLowerCase())) {
            response = "Main bilkul theek hoon! Aap batayein main dashboard kholu ya phir data page par chalte hain?";
        }
        else if (/(dhanyawad|thanks|thank you|shukriya|achha|good|badhiya)/i.test(cmd.toLowerCase())) {
            response = "Aapka swagat hai! Agar aapko website ghoomni ho toh bas mujhe bata dijiye.";
        }

        else {
            const hindiFallbacks = [
                "Achha, yeh toh kafi dilchasp baat hai.",
                "Main samajh raha hoon. Kya aap mujhe dashboard kholne ke liye kehna chahte hain?",
                "Yaha data kaafi rich hai, agar aap chahe toh main map dikha sakta hoon.",
                "Hmm, mujhe main topic samajh nahi aaya, par main navigate zaroor kar sakta hoon."
            ];
            response = hindiFallbacks[Math.floor(Math.random() * hindiFallbacks.length)];
            lang = 'hi-IN';
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'ai', text: response, lang }]);
            speakAgent(response, lang);
        }, 600);
    };

    const toggleListen = () => {
        if (isListening) {
            recognition.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognition.current?.start();
                setIsListening(true);
                setIsOpen(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="ai-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window glass-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        <div className="chat-header">
                            <div className="chat-title">
                                <Cpu size={18} color="#00f0ff" />
                                <span>Route AI Assistant</span>
                            </div>
                            <button type="button" className="icon-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                        </div>

                        <div className="chat-body">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`chat-msg ${msg.sender === 'ai' ? 'ai' : 'user'}`}>
                                    <div className="msg-bubble">{msg.text}</div>
                                </div>
                            ))}
                            {isListening && (
                                <div className="chat-msg user">
                                    <div className="msg-bubble listening-bubble">Listening...</div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={submitText}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="button" className={`icon-btn mic-btn ${isListening ? 'active' : ''}`} onClick={toggleListen} title="Speak">
                                {isListening ? <Mic size={18} color="#00f0ff" /> : <MicOff size={18} color="#94a3b8" />}
                            </button>
                            <button type="submit" className="icon-btn send-btn" disabled={!inputText.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <div className="ai-floating-actions">
                    <button
                        className="ai-fab chat-fab"
                        onClick={() => setIsOpen(true)}
                        title="Open Chat"
                    >
                        <MessageSquare size={24} color="#fff" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default UltronAgent;
