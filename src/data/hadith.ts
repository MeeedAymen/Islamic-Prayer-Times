// A small sample of daily hadiths. You can expand this list as needed.
export interface Hadith {
  text: string;
  reference: string;
  translation: string;
}

export const hadiths: Hadith[] = [
  {
    text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    reference: "Sahih Bukhari 1",
    translation: "Actions are judged by intentions."
  },
  {
    text: "الدِّينُ يُسْرٌ",
    reference: "Sahih Bukhari 39",
    translation: "The religion is easy."
  },
  {
    text: "مَنْ لا يَرْحَمْ لا يُرْحَمْ",
    reference: "Sahih Bukhari 6013",
    translation: "Whoever does not show mercy will not be shown mercy."
  }
];

export function getRandomHadith(): Hadith {
  return hadiths[Math.floor(Math.random() * hadiths.length)];
}
