import { Adkar } from '../types';

export const morningAdkar: Adkar[] = [
  {
    id: 1,
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
    category: "morning",
    reference: "Muslim"
  },
  {
    id: 2,
    text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
    category: "morning",
    reference: "Tirmidhi"
  },
  {
    id: 3,
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي.",
    translation: "O Allah, I ask You for pardon and well-being in this life and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth.",
    category: "morning",
    reference: "Ibn Majah"
  }
];

export const eveningAdkar: Adkar[] = [
  {
    id: 4,
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
    category: "evening",
    reference: "Muslim"
  },
  {
    id: 5,
    text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
    translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.",
    category: "evening",
    reference: "Tirmidhi"
  },
  {
    id: 6,
    text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    category: "evening",
    reference: "Muslim"
  }
];

export const generalAdkar: Adkar[] = [
  {
    id: 7,
    text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
    translation: "Glory is to Allah and praise is to Him, Glory is to Allah the Almighty.",
    category: "general",
    reference: "Bukhari, Muslim"
  },
  {
    id: 8,
    text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    translation: "None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
    category: "general",
    reference: "Bukhari, Muslim"
  },
  {
    id: 9,
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
    translation: "O Allah, I ask You for knowledge that is beneficial, provision that is good, and deeds that are acceptable.",
    category: "general",
    reference: "Ibn Majah"
  },
  {
    id: 10,
    text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    category: "general",
    reference: "Quran 2:201"
  }
];

export const getAllAdkar = (): Adkar[] => {
  return [...morningAdkar, ...eveningAdkar, ...generalAdkar];
};

export const getRandomAdkar = (): Adkar => {
  const allAdkar = getAllAdkar();
  const randomIndex = Math.floor(Math.random() * allAdkar.length);
  return allAdkar[randomIndex];
};

export const getAdkarByCategory = (category: string): Adkar[] => {
  const allAdkar = getAllAdkar();
  return allAdkar.filter(adkar => adkar.category === category);
};