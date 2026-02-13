// src/contexts/QuranAudioContext.tsx
import { VerseDTO } from "@/lib/quranApi";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface Surah {
    number: number;
    name: string;
    englishName: string;
    verses: number;
}

const surahs: Surah[] = [
    { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", verses: 7 },
    { number: 2, name: "البقرة", englishName: "Al-Baqarah", verses: 286 },
    { number: 3, name: "آل عمران", englishName: "Ali 'Imran", verses: 200 },
    { number: 4, name: "النساء", englishName: "An-Nisa", verses: 176 },
    { number: 5, name: "المائدة", englishName: "Al-Ma'idah", verses: 120 },
    { number: 6, name: "الأنعام", englishName: "Al-An'am", verses: 165 },
    { number: 7, name: "الأعراف", englishName: "Al-A'raf", verses: 206 },
    { number: 8, name: "الأنفال", englishName: "Al-Anfal", verses: 75 },
    { number: 9, name: "التوبة", englishName: "At-Tawbah", verses: 129 },
    { number: 10, name: "يونس", englishName: "Yunus", verses: 109 },
    { number: 11, name: "هود", englishName: "Hud", verses: 123 },
    { number: 12, name: "يوسف", englishName: "Yusuf", verses: 111 },
    { number: 13, name: "الرعد", englishName: "Ar-Ra'd", verses: 43 },
    { number: 14, name: "إبراهيم", englishName: "Ibrahim", verses: 52 },
    { number: 15, name: "الحجر", englishName: "Al-Hijr", verses: 99 },
    { number: 16, name: "النحل", englishName: "An-Nahl", verses: 128 },
    { number: 17, name: "الإسراء", englishName: "Al-Isra", verses: 111 },
    { number: 18, name: "الكهف", englishName: "Al-Kahf", verses: 110 },
    { number: 19, name: "مريم", englishName: "Maryam", verses: 98 },
    { number: 20, name: "طه", englishName: "Taha", verses: 135 },
    { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", verses: 112 },
    { number: 22, name: "الحج", englishName: "Al-Hajj", verses: 78 },
    { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", verses: 118 },
    { number: 24, name: "النور", englishName: "An-Nur", verses: 64 },
    { number: 25, name: "الفرقان", englishName: "Al-Furqan", verses: 77 },
    { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", verses: 227 },
    { number: 27, name: "النمل", englishName: "An-Naml", verses: 93 },
    { number: 28, name: "القصص", englishName: "Al-Qasas", verses: 88 },
    { number: 29, name: "العنكبوت", englishName: "Al-Ankabut", verses: 69 },
    { number: 30, name: "الروم", englishName: "Ar-Rum", verses: 60 },
    { number: 31, name: "لقمان", englishName: "Luqman", verses: 34 },
    { number: 32, name: "السجدة", englishName: "As-Sajdah", verses: 30 },
    { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", verses: 73 },
    { number: 34, name: "سبأ", englishName: "Saba", verses: 54 },
    { number: 35, name: "فاطر", englishName: "Fatir", verses: 45 },
    { number: 36, name: "يس", englishName: "Ya-Sin", verses: 83 },
    { number: 37, name: "الصافات", englishName: "As-Saffat", verses: 182 },
    { number: 38, name: "ص", englishName: "Sad", verses: 88 },
    { number: 39, name: "الزمر", englishName: "Az-Zumar", verses: 75 },
    { number: 40, name: "غافر", englishName: "Ghafir", verses: 85 },
    { number: 41, name: "فصلت", englishName: "Fussilat", verses: 54 },
    { number: 42, name: "الشورى", englishName: "Ash-Shura", verses: 53 },
    { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", verses: 89 },
    { number: 44, name: "الدخان", englishName: "Ad-Dukhan", verses: 59 },
    { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", verses: 37 },
    { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", verses: 35 },
    { number: 47, name: "محمد", englishName: "Muhammad", verses: 38 },
    { number: 48, name: "الفتح", englishName: "Al-Fath", verses: 29 },
    { number: 49, name: "الحجرات", englishName: "Al-Hujurat", verses: 18 },
    { number: 50, name: "ق", englishName: "Qaf", verses: 45 },
    { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", verses: 60 },
    { number: 52, name: "الطور", englishName: "At-Tur", verses: 49 },
    { number: 53, name: "النجم", englishName: "An-Najm", verses: 62 },
    { number: 54, name: "القمر", englishName: "Al-Qamar", verses: 55 },
    { number: 55, name: "الرحمن", englishName: "Ar-Rahman", verses: 78 },
    { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", verses: 96 },
    { number: 57, name: "الحديد", englishName: "Al-Hadid", verses: 29 },
    { number: 58, name: "المجادلة", englishName: "Al-Mujadila", verses: 22 },
    { number: 59, name: "الحشر", englishName: "Al-Hashr", verses: 24 },
    { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", verses: 13 },
    { number: 61, name: "الصف", englishName: "As-Saff", verses: 14 },
    { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", verses: 11 },
    { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", verses: 11 },
    { number: 64, name: "التغابن", englishName: "At-Taghabun", verses: 18 },
    { number: 65, name: "الطلاق", englishName: "At-Talaq", verses: 12 },
    { number: 66, name: "التحريم", englishName: "At-Tahrim", verses: 12 },
    { number: 67, name: "الملك", englishName: "Al-Mulk", verses: 30 },
    { number: 68, name: "القلم", englishName: "Al-Qalam", verses: 52 },
    { number: 69, name: "الحاقة", englishName: "Al-Haqqah", verses: 52 },
    { number: 70, name: "المعارج", englishName: "Al-Ma'arij", verses: 44 },
    { number: 71, name: "نوح", englishName: "Nuh", verses: 28 },
    { number: 72, name: "الجن", englishName: "Al-Jinn", verses: 28 },
    { number: 73, name: "المزمل", englishName: "Al-Muzzammil", verses: 20 },
    { number: 74, name: "المدثر", englishName: "Al-Muddaththir", verses: 56 },
    { number: 75, name: "القيامة", englishName: "Al-Qiyamah", verses: 40 },
    { number: 76, name: "الإنسان", englishName: "Al-Insan", verses: 31 },
    { number: 77, name: "المرسلات", englishName: "Al-Mursalat", verses: 50 },
    { number: 78, name: "النبأ", englishName: "An-Naba", verses: 40 },
    { number: 79, name: "النازعات", englishName: "An-Nazi'at", verses: 46 },
    { number: 80, name: "عبس", englishName: "Abasa", verses: 42 },
    { number: 81, name: "التكوير", englishName: "At-Takwir", verses: 29 },
    { number: 82, name: "الانفطار", englishName: "Al-Infitar", verses: 19 },
    { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", verses: 36 },
    { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", verses: 25 },
    { number: 85, name: "البروج", englishName: "Al-Buruj", verses: 22 },
    { number: 86, name: "الطارق", englishName: "At-Tariq", verses: 17 },
    { number: 87, name: "الأعلى", englishName: "Al-A'la", verses: 19 },
    { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", verses: 26 },
    { number: 89, name: "الفجر", englishName: "Al-Fajr", verses: 30 },
    { number: 90, name: "البلد", englishName: "Al-Balad", verses: 20 },
    { number: 91, name: "الشمس", englishName: "Ash-Shams", verses: 15 },
    { number: 92, name: "الليل", englishName: "Al-Layl", verses: 21 },
    { number: 93, name: "الضحى", englishName: "Ad-Duha", verses: 11 },
    { number: 94, name: "الشرح", englishName: "Ash-Sharh", verses: 8 },
    { number: 95, name: "التين", englishName: "At-Tin", verses: 8 },
    { number: 96, name: "العلق", englishName: "Al-Alaq", verses: 19 },
    { number: 97, name: "القدر", englishName: "Al-Qadr", verses: 5 },
    { number: 98, name: "البينة", englishName: "Al-Bayyinah", verses: 8 },
    { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", verses: 8 },
    { number: 100, name: "العاديات", englishName: "Al-Adiyat", verses: 11 },
    { number: 101, name: "القارعة", englishName: "Al-Qari'ah", verses: 11 },
    { number: 102, name: "التكاثر", englishName: "At-Takathur", verses: 8 },
    { number: 103, name: "العصر", englishName: "Al-Asr", verses: 3 },
    { number: 104, name: "الهمزة", englishName: "Al-Humazah", verses: 9 },
    { number: 105, name: "الفيل", englishName: "Al-Fil", verses: 5 },
    { number: 106, name: "قريش", englishName: "Quraysh", verses: 4 },
    { number: 107, name: "الماعون", englishName: "Al-Ma'un", verses: 7 },
    { number: 108, name: "الكوثر", englishName: "Al-Kawthar", verses: 3 },
    { number: 109, name: "الكافرون", englishName: "Al-Kafirun", verses: 6 },
    { number: 110, name: "النصر", englishName: "An-Nasr", verses: 3 },
    { number: 111, name: "المسد", englishName: "Al-Masad", verses: 5 },
    { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", verses: 4 },
    { number: 113, name: "الفلق", englishName: "Al-Falaq", verses: 5 },
    { number: 114, name: "الناس", englishName: "An-Nas", verses: 6 },
];

interface QuranAudioContextType {
    // State
    currentSurah: number | null;
    currentVerse: number;
    isPlaying: boolean;
    verses: VerseDTO[];

    // Actions
    playSurah: (surah: number, versesData: VerseDTO[], startFrom?: number) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    nextVerse: () => void;
    previousVerse: () => void;

    // Utils
    getGlobalAyahNumber: (surah: number, ayah: number) => number;
}

const QuranAudioContext = createContext<QuranAudioContextType | undefined>(undefined);

export const QuranAudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentSurah, setCurrentSurah] = useState<number | null>(null);
    const [currentVerse, setCurrentVerse] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [verses, setVerses] = useState<VerseDTO[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sourceIndexRef = useRef<number>(0);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = 1.0;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Calculate global ayah number (1-6236)
    const getGlobalAyahNumber = (surah: number, ayah: number): number => {
        let global = 0;
        for (let i = 0; i < surah - 1; i++) {
            global += surahs[i].verses;
        }
        return global + ayah;
    };

    // Get audio sources for current ayah
    const getAudioSources = (surah: number, ayah: number): string[] => {
        const globalNum = getGlobalAyahNumber(surah, ayah);
        const cdn1 = `https://cdn.islamic.network/quran/audio/192/ar.abdulbasitmurattal/${globalNum}.mp3`;
        const cdn2 = `https://cdn.islamic.network/quran/audio/64/ar.abdulbasitmurattal/${globalNum}.mp3`;
        const cdn3 = `https://server8.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${ayah.toString().padStart(3, '0')}.mp3`;
        return [cdn1, cdn2, cdn3];
    };

    // Play next verse automatically
    const playNextVerse = () => {
        if (!currentSurah || !verses.length) return;

        if (currentVerse < verses.length - 1) {
            setCurrentVerse(prev => prev + 1);
        } else {
            // Surah finished
            setIsPlaying(false);
        }
    };

    // Load and play audio for current verse
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isPlaying || !currentSurah || !verses[currentVerse]) return;

        const sources = getAudioSources(currentSurah, currentVerse + 1);
        sourceIndexRef.current = 0;
        audio.src = sources[0];

        const tryNextSource = () => {
            sourceIndexRef.current++;
            if (sourceIndexRef.current < sources.length) {
                audio.src = sources[sourceIndexRef.current];
                audio.load();
            } else {
                // All sources failed, skip to next verse
                playNextVerse();
            }
        };

        const handleCanPlay = () => {
            audio.play().catch(() => tryNextSource());
        };

        const handleError = () => {
            tryNextSource();
        };

        const handleEnded = () => {
            playNextVerse();
        };

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('ended', handleEnded);

        audio.load();

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSurah, currentVerse, isPlaying, verses]);

    const playSurah = (surah: number, versesData: VerseDTO[], startFrom: number = 0) => {
        setCurrentSurah(surah);
        setVerses(versesData);
        setCurrentVerse(startFrom);
        setIsPlaying(true);
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
    };

    const resume = () => {
        if (currentSurah && verses.length > 0) {
            setIsPlaying(true);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentSurah(null);
        setCurrentVerse(0);
        setVerses([]);
    };

    const nextVerse = () => {
        if (currentVerse < verses.length - 1) {
            setCurrentVerse(prev => prev + 1);
        }
    };

    const previousVerse = () => {
        if (currentVerse > 0) {
            setCurrentVerse(prev => prev - 1);
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const value: QuranAudioContextType = {
        currentSurah,
        currentVerse,
        isPlaying,
        verses,
        playSurah,
        pause,
        resume,
        stop,
        nextVerse,
        previousVerse,
        getGlobalAyahNumber
    };

    return (
        <QuranAudioContext.Provider value={value}>
            {children}
        </QuranAudioContext.Provider>
    );
};

export const useQuranAudio = () => {
    const context = useContext(QuranAudioContext);
    if (context === undefined) {
        throw new Error("useQuranAudio must be used within a QuranAudioProvider");
    }
    return context;
};
