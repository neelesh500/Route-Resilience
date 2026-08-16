import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, X, MessageSquare, Cpu, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './UltronAgent.css';

const UltronAgent = () => {
    const [isListening, setIsListening] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I am your smartest AI Guide. How can I help you navigate or analyze today?", lang: 'en-US' }
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

    const handleUserMessage = async (text) => {
        setMessages(prev => [...prev, { sender: 'user', text }]);
        await processCommand(text);
    };

    const submitText = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleUserMessage(inputText.trim());
        setInputText('');
    };

    const saveApiKey = (e) => {
        e.preventDefault();
        localStorage.setItem('gemini_api_key', apiKey);
        setShowKeyInput(false);
        const successMsg = "API Key saved securely in your browser! I am now fully powered by Gemini.";
        setMessages(prev => [...prev, { sender: 'ai', text: successMsg, lang: 'en-US' }]);
        speakAgent(successMsg, 'en-US');
    };

    const processCommand = async (cmd) => {
        let response = '';
        let lang = 'en-US';

        const isHindi = /[\u0900-\u097F]|(kholo|dikhao|batao|kya hai|panna|chalo|yahan|mera|dekho|karo|tum|kaise|ho|haan|nahi|kya)/i.test(cmd);
        if (isHindi) lang = 'hi-IN';

        const normalizedCmd = cmd.replace(/[-\s]/g, '').toLowerCase();

        if (/(dashboard|dash|map|कमांड|डैशबोर्ड|मैप|सेंटर|dashboardopen)/i.test(normalizedCmd)) {
            response = isHindi ? "Ji haan, main dashboard khol raha hoon." : "Opening the dashboard for you now.";
            navigate('/dashboard');
        }
        else if (/(method|work|kaisekam|kaisekaam|तरीका|काम)/i.test(normalizedCmd)) {
            response = isHindi ? "Bilkul, methodology page par chaliye." : "Navigating to the methodology section.";
            navigate('/methodology');
        }
        else if (/(data|resource|file|डेटा|फाइल|स्रोत)/i.test(normalizedCmd)) {
            response = isHindi ? "Haan ji, data resources open kar raha hoon." : "Opening the data resources right away.";
            navigate('/data');
        }
        else if (/(metric|eval|result|रिजल्ट|मेट्रिक्स|परिणाम)/i.test(normalizedCmd)) {
            response = isHindi ? "Results aur metrics load kar raha hoon." : "Fetching the evaluation metrics.";
            navigate('/evaluation');
        }
        else if (/(home|main|shuru|wapas|होम|वापस|शुरू|pichhe)/i.test(normalizedCmd)) {
            response = isHindi ? "Home page par wapas chalte hain." : "Taking you back to the home page.";
            navigate('/');
        }
        else {
            if (!apiKey) {
                response = isHindi
                    ? "Main abhi basic mode mein hoon. Agar aap chahte hain ki main 'Gemini' jaisi smart baatein karun, toh upar Key icon par click karke apni Gemini API Key daaliye!"
                    : "I am in offline mode. If you want me to converse smartly like Gemini, please click the Key icon above and enter your Gemini API Key.";
            } else {
                try {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const prompt = `You are the AI Assistant for 'Route Resilience', an aerospace map and node analysis project. Help the user concisely but be conversational and natural. Do not return markdown. If the user spoke in Hindi/Hinglish, reply in Hindi/Hinglish. User said: "${cmd}"`;
                    const result = await model.generateContent(prompt);
                    response = result.response.text().replace(/\*/g, '');
                } catch (err) {
                    console.error(err);
                    response = "Bhai, ya toh internet down hai ya API key invalid hai. Ek baar check kar lijiye!";
                    lang = 'hi-IN';
                }
            }
        }

        setMessages(prev => [...prev, { sender: 'ai', text: response, lang }]);
        speakAgent(response, lang);
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
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="button" className={`icon-btn ${apiKey ? 'active' : ''}`} onClick={() => setShowKeyInput(!showKeyInput)} title="Set API Key"><Key size={16} color={apiKey ? '#00ff66' : '#ff003c'} /></button>
                                <button type="button" className="icon-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                            </div>
                        </div>

                        {showKeyInput && (
                            <form onSubmit={saveApiKey} style={{ padding: '10px', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid #444', display: 'flex', gap: '8px' }}>
                                <input
                                    type="password"
                                    placeholder="Enter Gemini API Key..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #00f0ff', background: '#000', color: '#fff' }}
                                />
                                <button type="submit" style={{ background: '#00f0ff', color: '#000', border: 'none', borderRadius: '4px', padding: '0 10px', cursor: 'pointer' }}>Save</button>
                            </form>
                        )}

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
