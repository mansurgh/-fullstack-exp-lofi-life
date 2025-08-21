// src/lib/quranApi.ts
export interface VerseDTO {
  arabic: string;
  translation: string;
  audioUrl: string;
}

const RECITER = "ar.abdulbasitmurattal";
const mem = new Map<string, VerseDTO[]>();

const buildAudio = (s: number, a: number) =>
  `https://cdn.islamic.network/quran/audio/ayah/${RECITER}/${s}:${a}.mp3`;

export function loadCachedSurah(surahId: string | number): VerseDTO[] | null {
  try {
    const raw = localStorage.getItem(`quran_surah_${surahId}`);
    return raw ? (JSON.parse(raw) as VerseDTO[]) : null;
  } catch {
    return null;
  }
}

export async function fetchSurahVerses(
  surahId: string | number
): Promise<VerseDTO[]> {
  const key = String(surahId);
  if (mem.has(key)) return mem.get(key)!;

  const url = `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahId}: ${res.status}`);
  const json = await res.json();

  const ar = (json?.data?.[0]?.ayahs ?? []) as Array<{ text: string }>;
  const tr = (json?.data?.[1]?.ayahs ?? []) as Array<{ text: string }>;

  const verses: VerseDTO[] = ar.map((a, i) => ({
    arabic: a?.text ?? "",
    translation: tr?.[i]?.text ?? "",
    audioUrl: buildAudio(Number(surahId), i + 1),
  }));

  mem.set(key, verses);
  try {
    localStorage.setItem(`quran_surah_${key}`, JSON.stringify(verses));
  } catch {}
  return verses;
}
