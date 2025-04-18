import { QuranVerse } from '../types';

export const quranVerses: QuranVerse[] = [
  {
    id: 1,
    surah: 1,
    ayah: 1,
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    reference: "Surah Al-Fatihah 1:1"
  },
  {
    id: 2,
    surah: 2,
    ayah: 255,
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    reference: "Surah Al-Baqarah 2:255"
  },
  {
    id: 3,
    surah: 3,
    ayah: 190,
    arabicText: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ",
    translation: "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.",
    reference: "Surah Ali 'Imran 3:190"
  },
  {
    id: 4,
    surah: 93,
    ayah: 5,
    arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    translation: "And your Lord is going to give you, and you will be satisfied.",
    reference: "Surah Ad-Duha 93:5"
  },
  {
    id: 5,
    surah: 94,
    ayah: 5,
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease.",
    reference: "Surah Ash-Sharh 94:5"
  },
  {
    id: 6,
    surah: 2,
    ayah: 286,
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not charge a soul except [with that within] its capacity.",
    reference: "Surah Al-Baqarah 2:286"
  },
  {
    id: 7,
    surah: 65,
    ayah: 3,
    arabicText: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever relies upon Allah - then He is sufficient for him.",
    reference: "Surah At-Talaq 65:3"
  },
  {
    id: 8,
    surah: 2,
    ayah: 152,
    arabicText: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    reference: "Surah Al-Baqarah 2:152"
  },
  {
    id: 9,
    surah: 3,
    ayah: 159,
    arabicText: "فَبِمَا رَحْمَةٍ مِنَ اللَّهِ لِنْتَ لَهُمْ",
    translation: "So by mercy from Allah, [O Muhammad], you were lenient with them.",
    reference: "Surah Ali 'Imran 3:159"
  },
  {
    id: 10,
    surah: 17,
    ayah: 80,
    arabicText: "وَقُلْ رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَلْ لِي مِنْ لَدُنْكَ سُلْطَانًا نَصِيرًا",
    translation: "And say, 'My Lord, cause me to enter a sound entrance and to exit a sound exit and grant me from Yourself a supporting authority.'",
    reference: "Surah Al-Isra 17:80"
  }
];

export const getRandomQuranVerse = (): QuranVerse => {
  const randomIndex = Math.floor(Math.random() * quranVerses.length);
  return quranVerses[randomIndex];
};

export const getQuranVerseBySurah = (surah: number): QuranVerse[] => {
  return quranVerses.filter(verse => verse.surah === surah);
};

export const getQuranVerseById = (id: number): QuranVerse | undefined => {
  return quranVerses.find(verse => verse.id === id);
};