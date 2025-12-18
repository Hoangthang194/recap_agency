import { Post, Category, Author, Country, City } from './types';

export const currentUser: Author = {
  name: "Rowan Blake",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEWE4PWVi-noHBer7hGHoPTj9HHSHWkhCSm8jAIU7JRRLpAuDdFmPTmiklMA2fgMjbTiLdRnBV55W9xH6cwyLcOfNx3faVnhuIucoX9u4_OlGQLFuoUyono7PXfkKveBfJ1Awu5TNhlbhpVhe4egCmuSKSc4wk_tUi07posmV5U_WDxh8znK9HUNsrNdE4RiRxQa5-RNh1FIHRJu90o6a8AhqWMRtvk06Y6DJO7EE4u-wxfobXM_QLSDeYdMRIiuGskhhhh9TAhX0y"
};

export const categories: Category[] = [
  { 
    id: 'tech', 
    name: 'Tech', 
    icon: 'computer', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', 
    colorClass: 'bg-indigo-900/40',
    description: "Breaking down innovations, gadgets, and digital shifts in everyday life."
  },
  { 
    id: 'startup', 
    name: 'Startup', 
    icon: 'rocket_launch', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPyH1It7mPYLVY97FblovAeScYYB7xvyZWmjkhRDwJLHxXLAXYak-zFyCWDooKEtG9HEyFhDyYcFF4XarCZ7rO3WvaeHdMiPWrp7zBweI12u0GVxwS1J04WLJSJumkTkP_z_20tMJLhi4xMh6x1JJqjQHeIi5dC9WZD4I-RFWrjXmClbe8QcC3LBuKYdd9A-9HEOXMMwvBJbAvuDxT3b6kUalf-71EY1NlDB9xHm5oMb9VTGNQ4nUvPSIclzQKcB2qvOOuUXf7SOT1', 
    colorClass: 'bg-sky-200/40',
    description: "From idea to launch—follow the journey of building something new."
  },
  { 
    id: 'sport', 
    name: 'Sport', 
    icon: 'sports_basketball', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6vGpgwpnbGLX9wjrzgI9JThIX1mrklILsT97zyDgYhgx_rNCstWU-OUZMTAflluijImP5G7PlpNGx22yP_PiNVLJrCID2LBaEpNQj_ePUC86sBSoV_UP8PNAps4GcstyeENgxWAfDU95mTZDP7WRhJ6dPnNOe3if8pO8j1_u01tAv0vXmEsPZshUiRSINmkU-qicFbxuI2rWSEzmZj3Rezs2hG-SOq8T3F-qs8GNorT2uq55CX09ccRMPEQ81OFgJHeUa2zGj2u4N', 
    colorClass: 'bg-blue-600/30',
    description: "Game highlights, athlete stories, and everything in motion."
  },
  { 
    id: 'business', 
    name: 'Business', 
    icon: 'pie_chart', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7', 
    colorClass: 'bg-orange-500/20',
    description: "Where strategy meets execution—insights for today’s professionals."
  },
  { 
    id: 'education', 
    name: 'Education', 
    icon: 'school', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASmyq8UXVPZR8m3jATk5SXW1sjH8Y3ovyEJDKbnb4dffrSHkGgemDEPV6GyIs-DO2vAApCa9CbF7AKdGZ03njJwpqA8VVOh_MukBeXJh1hl_JUmH5thuyhKFlX_bzrOh9KwFvX8Ur0j8WeWXWEBiQcVn5oLGJUtoOHJTeT1qhJ_oI4usHZuvq7DdywM-M3qqeroZwyjr7irUZrXzP49ZMtmjqZFXC3L5SzPib46RvMfHW1vYU7XX2vUbHQu_nF6h7t0K5SD_D69G6l', 
    colorClass: 'bg-yellow-500/20',
    description: "Explore how we learn, teach, and grow in a fast-changing world."
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    icon: 'flight', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 
    colorClass: 'bg-red-400/30',
    description: "Journeys near and far, culture, and tips for the road."
  },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'Pitching Your Idea: A Guide to Presenting with Impact',
    excerpt: "Wherever you're headed, pause here to reset, reflect, and bring something meaningful with you.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E',
    category: 'Business',
    author: currentUser,
    date: 'Aug 8, 2025'
  },
  {
    id: '2',
    title: 'Turning Big Ideas into Real-World Achievements',
    excerpt: 'Easy to reflect on and even easier to use — these thoughts can improve both action and intention.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO',
    category: 'Sport',
    author: currentUser,
    date: 'Aug 5, 2025'
  },
  {
    id: '3',
    title: 'What Travel Can Teach You About Culture and Life',
    excerpt: 'Take what works for you — this blog is written to support personal reflection and practical use.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASrgrgwUOmxHiB_Wzjn2q44znt3BHx-TP9feSFktOSaBxlnuiq3bpoddNsubdZ9k4rNb26L0rqDeGbVQejTp8Sfk0SRa5oiR3Uyck4avMoWAUpXJKM2kllNkvkHym9mIogumaAG3Bf9LauTOlGzrOk8VNIuzdpW2wrlP-zhT0UlM3clna8eChUgmb-oKZv8Ky_P_ZQerMPOUUulAmss-v8urvEzCvM7hDZmWd_pbAvG5C4PcVmWv5hlRO-Wu-8mWHDXcMKH3IGlozV',
    category: 'Education',
    author: currentUser,
    date: 'Aug 4, 2025'
  },
  {
    id: '4',
    title: 'How to Build a Team That Stays Strong and Loyal',
    excerpt: 'Read this for a calm shift in mindset, with practical takeaways and easy next steps to explore.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuBAOJE_FSwsW5RFUnX0e_fIhO9BAQdkEa6WGyDpSKwrICLjoVtBKo76FHoES0ZooqeKgTvJYH1fHMqFCACMh8-hhJlZYoJfg1qrEn8R9RnIXjIUXsKSttfpRk4eP0hoetWlDFghBr6z9uvTfixnhqsodMmAvFcGTIscA8qfpOK1WdWgpCqAEKQkmMAsSMkn_ioOMNGlFcX3yJHttR9Q6s7ylUDzNRvgD0dZU0r06YP71ltMNThOmkKCKnWD4RgV9bpe0YF9ysCdaz',
    category: 'Tech',
    author: currentUser,
    date: 'Aug 2, 2025'
  },
  {
    id: '5',
    title: 'Learning from Past Mistakes',
    excerpt: 'Check this out for a fresh shift in perspective, with helpful ideas and practical moves to make.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD48JrjOU5yhEBG-xN_Ky0XBydKAm-Ejpo_yPP1y2H5xz1-DPk1VTfnFLUKuWy5ntGIPo1uQ28TIGjR2stIu8qAWpGxrCvQtAf-Z8XJnvAIigiVJKIgkfmo0Gfpl1HYFg-nfEY5FWdYM6Dm-RHxhW7PNObfEaCCKVu6OPDXkNgPlJZNFegY3s9l7VkxXS6MFuClhtXFqNHAXDDQ3_Pmh0UfyoJGnWCltdg_GWHoa_vVlQeGWGNCA-Fxhz1QLEjURlftZtOBoGne92RS',
    category: 'History',
    author: currentUser,
    date: 'July 8, 2025'
  },
  {
    id: '6',
    title: 'Simple Ways to Stay Productive',
    excerpt: 'Simple ideas with flexible use — relevant for now, tomorrow, or when you\'re ready for change.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzLWKKu1wP43aqWYEwSC-EiTuWskq1AvJtkqXRDDCCmPbw1UdHPSQyw96rOkuZEiQqvCcUPxyAhzB-OEdFY_OovyQBd_ivpBAtVaHn-qwZu7WQn8osHTi6uzGI5cJhrfCU_qgm69kFl6AdH4DoEuO0Xh2b-zuAueqgiqwwbhVD_rOSy1VvsQGmr5uUO3f8nLLd95x3XqbcQx1hogu55qJZNd-JtsSzOI0DUMA79xwIPL2zIAgdhC1K4PHqScKQykqcXevPYbxE1WUc',
    category: 'Productivity',
    author: currentUser,
    date: 'July 7, 2025'
  },
    {
    id: '7',
    title: 'Education for the Modern Age',
    excerpt: 'These insights aim to bring clarity to work, focus, goals, habits, and everyday adjustments.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCbTzNCxtSnXUdZcxM97EsutmjRIhsTGUVYTYwqsu_C8_N7WZ58h2tQgZ_F5ncyZjMmT32lghNhLcRUvz3JPN_mhvi3chCbmh7oqRCbrRsfbgib6e6z6Yb1gHb9-QnhUvvUcAQG3pa6gn9J9wem2UqNAbWMM9BEFHxeMYPqfNbEQdRpzmQf-f_SSa5CYGp-iGdSDLCXnRW5lPnocM0HUVjbtc6mDemwFMC8svwMsVGwJe9IT4q2ECrO8UFpCT1ff5W4y9pL0JYrvMr',
    category: 'Education',
    author: currentUser,
    date: 'July 5, 2025'
  },
  {
    id: '8',
    title: 'Key Business Trends You Should Start Following Today',
    excerpt: 'Keep going, keep adjusting — this blog supports thoughtful progress and consistent reflection.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcklzEp_WtHIkFBEh7DicoXlZAwsSdiC2aerVT8GWNj-ZOLMVc7xiA4Nhnsobm6i1QyvjSB4wNOJCG9SmGoO3fW0M9XcvZE4oDrV5Jyjvzmh1rSWm6dyz5aRZgjshB9Z7Ko4_Rp1XqUFem-Y1YGt5PmiHiNtVgs7dV4QXaSPUIU9kaZ3abua2wOOM099sBvgkRQZGfYGEEacbd5_zEodHJz8Sz8gs1ufvJLOmyuocbkPhE05acMafMlW1QLFeKNuBQO7ZiHej2Llkv',
    category: 'Trends',
    author: currentUser,
    date: 'July 1, 2025'
  },
    {
    id: '9',
    title: 'Life Lessons We Can Learn from Today\'s Top Athletes',
    excerpt: 'Designed to support your thinking and direction — without pressure, just something to take in.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu2A_EVRP-Cu6ZpMsEWqp67EIbb_by26EHAf-Pjy16AZt8YbPKG6Yuw3bRzM1DGpzoYlLz_LSUhJ-D5JID9xZtPy1txwz2vJ8yqRuTkmg0AizdCmIsn3GD07IV75WW69seJNLQxYBoB-r24ICGmOffVnZakwkjgwOhZUqh36qXuI4bjreOMYq2NA3xOHUDgzTyINN9HvC2n3EpksmPKrBh07gDQsGwXy1iWy-E0lEFoRQzogzFQV3K66J4h1fSPnDCmJAF55cvOpz_',
    category: 'Arts',
    author: currentUser,
    date: 'June 8, 2025'
  },
];

// Countries (used for travel regions)
export const countries: Country[] = [
  {
    id: 'vietnam',
    name: 'Vietnam',
    region: 'Asia',
    icon: 'location_on',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM',
    colorClass: 'bg-red-400/30',
    description: 'Explore the beauty of Vietnam',
    categories: [categories[0], categories[2], categories[4]] // Tech, Sport, Education
  },
  {
    id: 'korea',
    name: 'Korea',
    region: 'Asia',
    icon: 'location_on',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae',
    colorClass: 'bg-indigo-900/40',
    description: 'Discover Korean culture',
    categories: [categories[0], categories[1], categories[3]] // Tech, Startup, Business
  },
  {
    id: 'france',
    name: 'France',
    region: 'Europe',
    icon: 'location_on',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7',
    colorClass: 'bg-orange-500/20',
    description: 'Experience French elegance',
    categories: [categories[3], categories[4], categories[5]] // Business, Education, Travel
  },
  {
    id: 'germany',
    name: 'Germany',
    region: 'Europe',
    icon: 'location_on',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6vGpgwpnbGLX9wjrzgI9JThIX1mrklILsT97zyDgYhgx_rNCstWU-OUZMTAflluijImP5G7PlpNGx22yP_PiNVLJrCID2LBaEpNQj_ePUC86sBSoV_UP8PNAps4GcstyeENgxWAfDU95mTZDP7WRhJ6dPnNOe3if8pO8j1_u01tAv0vXmEsPZshUiRSINmkU-qicFbxuI2rWSEzmZj3Rezs2hG-SOq8T3F-qs8GNorT2uq55CX09ccRMPEQ81OFgJHeUa2zGj2u4N',
    colorClass: 'bg-blue-600/30',
    description: 'Discover German heritage',
    categories: [categories[0], categories[1], categories[2]] // Tech, Startup, Sport
  },
];

// Cities corresponding to each country
export const cities: City[] = [
  // Vietnam
  {
    id: 'hanoi',
    name: 'Hanoi',
    countryId: 'vietnam',
    region: 'Asia',
    icon: 'location_city',
    image: categories[5].image, // reuse Travel image
    colorClass: 'bg-emerald-500/20',
    description: 'The capital city of Vietnam, rich in history, food, and street life.',
    categories: [categories[0], categories[4], categories[5]], // Tech, Education, Travel
  },
  {
    id: 'ho-chi-minh-city',
    name: 'Ho Chi Minh City',
    countryId: 'vietnam',
    region: 'Asia',
    icon: 'apartment',
    image: categories[0].image, // reuse Tech image
    colorClass: 'bg-red-500/20',
    description: 'Vietnam’s largest city, fast-paced and packed with energy.',
    categories: [categories[0], categories[1], categories[3]], // Tech, Startup, Business
  },
  // Korea
  {
    id: 'seoul',
    name: 'Seoul',
    countryId: 'korea',
    region: 'Asia',
    icon: 'location_city',
    image: categories[1].image, // reuse Startup image
    colorClass: 'bg-indigo-500/20',
    description: 'A modern megacity where tech, culture, and tradition meet.',
    categories: [categories[0], categories[1], categories[5]], // Tech, Startup, Travel
  },
  {
    id: 'busan',
    name: 'Busan',
    countryId: 'korea',
    region: 'Asia',
    icon: 'beach_access',
    image: categories[2].image, // reuse Sport image
    colorClass: 'bg-sky-400/30',
    description: 'A coastal city known for its beaches, seafood, and festivals.',
    categories: [categories[2], categories[5]], // Sport, Travel
  },
  // France
  {
    id: 'paris',
    name: 'Paris',
    countryId: 'france',
    region: 'Europe',
    icon: 'location_city',
    image: categories[3].image, // reuse Business image
    colorClass: 'bg-pink-400/20',
    description: 'The City of Light, with art, fashion, cafes, and iconic landmarks.',
    categories: [categories[3], categories[4], categories[5]], // Business, Education, Travel
  },
  {
    id: 'lyon',
    name: 'Lyon',
    countryId: 'france',
    region: 'Europe',
    icon: 'restaurant',
    image: categories[4].image, // reuse Education image
    colorClass: 'bg-orange-400/20',
    description: 'France’s gastronomic capital with a relaxed, historic feel.',
    categories: [categories[3], categories[4], categories[5]], // Business, Education, Travel
  },
  // Germany
  {
    id: 'berlin',
    name: 'Berlin',
    countryId: 'germany',
    region: 'Europe',
    icon: 'location_city',
    image: categories[0].image, // reuse Tech image
    colorClass: 'bg-slate-500/20',
    description: 'A creative hub for startups, history, and modern culture.',
    categories: [categories[0], categories[1], categories[3]], // Tech, Startup, Business
  },
  {
    id: 'munich',
    name: 'Munich',
    countryId: 'germany',
    region: 'Europe',
    icon: 'park',
    image: categories[2].image, // reuse Sport image
    colorClass: 'bg-green-500/20',
    description: 'Known for its beer gardens, parks, and proximity to the Alps.',
    categories: [categories[2], categories[5]], // Sport, Travel
  },
];
