"use client";
import { Question } from "@/types";
import { CheckCircle2, Circle, ImageIcon, Volume2, PauseCircle, Settings2, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface QuizCardProps {
  question: Question;
  selectedAnswers: number[];
  onToggleAnswer: (index: number) => void;
}

export default function QuizCard({ question, selectedAnswers, onToggleAnswer }: QuizCardProps) {
  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Voice Settings State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for Arabic voices, or Google voices which are usually high quality
      const arabicVoices = allVoices.filter(v => v.lang.includes("ar"));
      
      setVoices(arabicVoices.length > 0 ? arabicVoices : allVoices);
      
      // Attempt to auto-select the "best" voice
      if (arabicVoices.length > 0 && !selectedVoiceURI) {
        // Priority: "Google" (Android/Chrome), "Maged" (Apple), then any "ar-MA"
        const bestVoice = 
          arabicVoices.find(v => v.name.includes("Google") && v.lang.includes("ar")) ||
          arabicVoices.find(v => v.name.includes("Maged")) || // High quality iOS voice
          arabicVoices.find(v => v.lang === "ar-MA") ||
          arabicVoices[0];
          
        setSelectedVoiceURI(bestVoice.voiceURI);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI]);

  // 2. Cleanup
  useEffect(() => {
    cancelSpeech();
    return () => cancelSpeech();
  }, [question]);

  const cancelSpeech = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  /**
   * 3. Advanced Darija Text Cleaner
   * Removes numbers, bullets, and formats pauses to sound less robotic.
   */
  const getCleanDarijaText = (text: string) => {
    let clean = text;

    // Remove Option Numbers like "1." "2." or "1 -"
    clean = clean.replace(/\b\d+[\.\-]\s*/g, ""); 
    
    // Remove references like (1-2) or (1)
    clean = clean.replace(/\(\s*\d+(\s*-\s*\d+)?\s*\)/g, "");

    // Replace ".." with a distinct pause (Full Stop)
    clean = clean.replace(/\.\./g, ".");

    // Remove extra whitespace
    clean = clean.replace(/\s+/g, " ").trim();

    return clean;
  };

  // 4. Speak Logic
  const handleSpeak = () => {
    if (typeof window === "undefined") return;

    if (isSpeaking) {
      cancelSpeech();
      return;
    }

    // Prepare Text
    // We combine the question text + the options text so it reads everything in one flow
    const cleanQuestion = getCleanDarijaText(question.questionText);
    const cleanOptions = question.options.map(opt => getCleanDarijaText(opt)).join(". ");
    
    // Full text to read: Question -> Pause -> Options
    const fullText = `${cleanQuestion} . ${cleanOptions}`;

    const utterance = new SpeechSynthesisUtterance(fullText);

    // Set Voice
    const chosenVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    // Regional Settings
    // 'ar-MA' might trigger a better internal locale on iOS/Android
    utterance.lang = "ar-MA"; 
    
    // Rate: 0.85 is usually the "sweet spot" for Darija on MSA engines
    // It gives the listener time to process the slight accent mismatch
    utterance.rate = 0.85; 
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // --- Helper to render options ---
  const renderOptionBtn = (optionText: string, idx: number) => {
    const isActive = selectedAnswers.includes(idx);
    return (
      <button
        key={idx}
        onClick={() => onToggleAnswer(idx)}
        className={`group relative flex items-center w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
          isActive
            ? "border-blue-500 bg-blue-50 text-blue-900 shadow-inner"
            : "border-slate-200 bg-white hover:border-blue-200 text-slate-600 cursor-pointer"
        }`}
      >
        <div className={`flex-shrink-0 ml-4 rounded-full p-1 transition-colors ${
            isActive ? "bg-blue-200" : "bg-slate-100 group-hover:bg-blue-50"
        }`}>
          {isActive ? (
            <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-100" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 group-hover:text-blue-400" />
          )}
        </div>
        <span className={`text-lg md:text-xl font-bold text-right w-full leading-snug ${
            isActive ? "text-blue-900" : "text-slate-700"
        }`}>
          {optionText}
        </span>
      </button>
    );
  };

  const textParts = question.questionText.split("..");
  const isSplitLayout = question.options.length === 4 && textParts.length >= 2;

  return (
    <div className="w-full max-w-[830px] mx-auto bg-white rounded-2xl border-b border-neutral-300 ring ring-neutral-200/80 shadow overflow-hidden transition-all relative">
      
      {/* Voice Settings Popover */}
      {showSettings && (
        <div className="absolute top-14 right-4 z-20 bg-white border border-slate-200 shadow-xl rounded-xl p-4 w-72 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-700">إعدادات الصوت</h3>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-2">اختر القارئ الأنسب لجهازك:</p>
          <select 
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            className="w-full text-sm p-2 border border-slate-300 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            dir="ltr"
          >
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
          <div className="mt-2 text-[10px] text-blue-600 bg-blue-50 p-2 rounded">
            نصيحة: على الأندرويد اختر "Google". على الآيفون اختر "Maged".
          </div>
        </div>
      )}

      {/* 1. Image Area */}
      <div className="relative w-full h-58 md:h-96 bg-slate-200 flex flex-col items-center justify-center border-b border-slate-100 group">
        {question.imageUrl ? (
          <Image
            src={question.imageUrl}
            alt="Driving Scenario"
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400 gap-3">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <p className="font-medium text-sm">لا توجد صورة لهذا السؤال</p>
          </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="p-6 md:p-8">
        
        {/* Header: Category + Audio Button */}
        <div className="flex justify-between items-center mb-6">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {question.category}
          </span>

          <div className="flex gap-2">
            {/* Settings Button */}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="تغيير الصوت"
            >
              <Settings2 className="w-5 h-5" />
            </button>

            {/* Play Button */}
            <button 
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border ${
                isSpeaking 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200"
              }`}
            >
               {isSpeaking ? (
                 <>
                   <span className="text-sm font-bold animate-pulse">جاري القراءة...</span>
                   <PauseCircle className="w-5 h-5" />
                 </>
               ) : (
                 <>
                   <span className="text-sm font-bold">قراءة السؤال</span>
                   <Volume2 className="w-5 h-5" />
                 </>
               )}
            </button>
          </div>
        </div>

        {/* --- LAYOUT LOGIC --- */}
        {isSplitLayout ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Part 1 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 leading-normal">
                {textParts[0]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderOptionBtn(question.options[0], 0)}
                {renderOptionBtn(question.options[1], 1)}
              </div>
            </div>
            
            <div className="w-full h-px bg-slate-100"></div>

            {/* Part 2 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 leading-normal">
                {textParts[1]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderOptionBtn(question.options[2], 2)}
                {renderOptionBtn(question.options[3], 3)}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-normal">
              {question.questionText}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, idx) => renderOptionBtn(option, idx))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}