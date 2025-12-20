import { Post, Category, Author, Country, City, Area } from './types';
import { generateSlug } from './utils/post';

export const currentUser: Author = {
  id: '1',
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
    description: "Where strategy meets execution—insights for today's professionals."
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
  {
    id: 'hanoi',
    name: 'Hanoi',
    icon: 'location_city',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', // reuse Travel image
    colorClass: 'bg-emerald-500/20',
    description: 'The capital city of Vietnam, rich in history, food, and street life.',
    isCity: true,
    areaId: 'southeast-asia',
    countryId: 'vietnam',
  },
  {
    id: 'ho-chi-minh-city',
    name: 'Ho Chi Minh City',
    icon: 'apartment',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', // reuse Tech image
    colorClass: 'bg-red-500/20',
    description: "Vietnam's largest city, fast-paced and packed with energy.",
    isCity: true,
    areaId: 'southeast-asia',
    countryId: 'vietnam',
  },
  // Korea - East Asia
  {
    id: 'seoul',
    name: 'Seoul',
    icon: 'location_city',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPyH1It7mPYLVY97FblovAeScYYB7xvyZWmjkhRDwJLHxXLAXYak-zFyCWDooKEtG9HEyFhDyYcFF4XarCZ7rO3WvaeHdMiPWrp7zBweI12u0GVxwS1J04WLJSJumkTkP_z_20tMJLhi4xMh6x1JJqjQHeIi5dC9WZD4I-RFWrjXmClbe8QcC3LBuKYdd9A-9HEOXMMwvBJbAvuDxT3b6kUalf-71EY1NlDB9xHm5oMb9VTGNQ4nUvPSIclzQKcB2qvOOuUXf7SOT1', // reuse Startup image
    colorClass: 'bg-indigo-500/20',
    description: 'A modern megacity where tech, culture, and tradition meet.',
    isCity: true,
    areaId: 'east-asia',
    countryId: 'korea',
  },
  {
    id: 'busan',
    name: 'Busan',
    icon: 'beach_access',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6vGpgwpnbGLX9wjrzgI9JThIX1mrklILsT97zyDgYhgx_rNCstWU-OUZMTAflluijImP5G7PlpNGx22yP_PiNVLJrCID2LBaEpNQj_ePUC86sBSoV_UP8PNAps4GcstyeENgxWAfDU95mTZDP7WRhJ6dPnNOe3if8pO8j1_u01tAv0vXmEsPZshUiRSINmkU-qicFbxuI2rWSEzmZj3Rezs2hG-SOq8T3F-qs8GNorT2uq55CX09ccRMPEQ81OFgJHeUa2zGj2u4N', // reuse Sport image
    colorClass: 'bg-sky-400/30',
    description: 'A coastal city known for its beaches, seafood, and festivals.',
    isCity: true,
    areaId: 'east-asia',
    countryId: 'korea',
  },
  // France - Western Europe
  {
    id: 'paris',
    name: 'Paris',
    icon: 'location_city',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7', // reuse Business image
    colorClass: 'bg-pink-400/20',
    description: 'The City of Light, with art, fashion, cafes, and iconic landmarks.',
    isCity: true,
    areaId: 'western-europe',
    countryId: 'france',
  },
  {
    id: 'lyon',
    name: 'Lyon',
    icon: 'restaurant',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASmyq8UXVPZR8m3jATk5SXW1sjH8Y3ovyEJDKbnb4dffrSHkGgemDEPV6GyIs-DO2vAApCa9CbF7AKdGZ03njJwpqA8VVOh_MukBeXJh1hl_JUmH5thuyhKFlX_bzrOh9KwFvX8Ur0j8WeWXWEBiQcVn5oLGJUtoOHJTeT1qhJ_oI4usHZuvq7DdywM-M3qqeroZwyjr7irUZrXzP49ZMtmjqZFXC3L5SzPib46RvMfHW1vYU7XX2vUbHQu_nF6h7t0K5SD_D69G6l', // reuse Education image
    colorClass: 'bg-orange-400/20',
    description: "France's gastronomic capital with a relaxed, historic feel.",
    isCity: true,
    areaId: 'western-europe',
    countryId: 'france',
  },
  // Germany - Central Europe
  {
    id: 'berlin',
    name: 'Berlin',
    icon: 'location_city',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', // reuse Tech image
    colorClass: 'bg-slate-500/20',
    description: 'A creative hub for startups, history, and modern culture.',
    isCity: true,
    areaId: 'central-europe',
    countryId: 'germany',
  },
  {
    id: 'munich',
    name: 'Munich',
    icon: 'park',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6vGpgwpnbGLX9wjrzgI9JThIX1mrklILsT97zyDgYhgx_rNCstWU-OUZMTAflluijImP5G7PlpNGx22yP_PiNVLJrCID2LBaEpNQj_ePUC86sBSoV_UP8PNAps4GcstyeENgxWAfDU95mTZDP7WRhJ6dPnNOe3if8pO8j1_u01tAv0vXmEsPZshUiRSINmkU-qicFbxuI2rWSEzmZj3Rezs2hG-SOq8T3F-qs8GNorT2uq55CX09ccRMPEQ81OFgJHeUa2zGj2u4N', // reuse Sport image
    colorClass: 'bg-green-500/20',
    description: 'Known for its beer gardens, parks, and proximity to the Alps.',
    isCity: true,
    areaId: 'central-europe',
    countryId: 'germany',
  },
];

const postsData: Post[] = [
  {
    id: '1',
    title: 'Pitching Your Idea: A Guide to Presenting with Impact',
    excerpt: "Wherever you're headed, pause here to reset, reflect, and bring something meaningful with you.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E',
    category: 'business',
    author: currentUser,
    date: 'Aug 8, 2025',
    slug: 'pitching_your_idea_a_guide_to_presenting_with_impact',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Whether you're managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.</p>

<p>In today's world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour. Without a system to guide your choices, it's easy to get stuck in reactive mode—working hard but not necessarily working smart. That's where prioritization frameworks come in.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Getting Lost in "Busy Work"</h2>
<p>In every field—whether you're a student, entrepreneur, team leader, or solo professional—it's easy to confuse activity with progress. You might spend hours responding to emails, putting out fires, or finishing small tasks, all while delaying the things that could actually drive meaningful outcomes.</p>
<p>The solution isn't just about doing less; it's about doing what matters more. By identifying which actions have the greatest impact, you create space to focus deeply.</p>

<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">Popular Frameworks to Get Started:</h3>
<ul class="space-y-3 list-none pl-0">
  <li class="flex items-start gap-3">
    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
    <span><strong class="text-gray-900">The Eisenhower Matrix</strong> helps you evaluate every task by its urgency and importance so you can act on what truly matters now.</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
    <span><strong class="text-gray-900">The MoSCoW Method</strong> sorts your projects into must-haves, should-haves, could-haves, and won't-haves.</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
    <span><strong class="text-gray-900">The RICE Model</strong> evaluates reach, impact, confidence, and effort to prioritize based on value versus cost.</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
    <span><strong class="text-gray-900">The 80/20 Rule</strong> reminds you to identify and invest in the small percentage of tasks that produce results.</span>
  </li>
</ul>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Support Real Progress</h2>
<p>Prioritization frameworks give you a shared language for decision-making, especially in collaborative environments. Whether you're working with a product team, a class group, or across departments.</p>

<figure class="my-10">
  <img class="w-full rounded-2xl shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrgXpbgThq5fyGwb-w3JcOU9eHo0qrGLJWSE91EX4Ze9cWErY3oN8ARc3onv7rrJnLT-5nY76SSJav6rvx43Y1xYCMZU1zHW2u0fzUUu5dv_NnAqRJiTzUYRTfCgKjqUTrD47pw8hWp48VoSC83UZzqLuvSIypJazn3hvLCTJmi0ixgt8v9QR4Nrhl7u-fj95RM02xSe6HoJ4uX46q-4cKq3HaCNpvhulUtTbWtuzPEigGh340g36U2k_PYX2ClGw7Bupvf5Ty8r0W" alt="Monkey thinking" />
  <figcaption class="text-center text-sm text-gray-400 mt-3 italic">Plans give yet mindfulness thick stars consider they.</figcaption>
</figure>

<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">How to Apply Frameworks in Your Day-to-Day Workflow</h3>
<p>The process is simple—and it works no matter your role, goals, or the type of work you're doing:</p>
<ol class="list-decimal pl-5 space-y-4 marker:text-primary marker:font-bold">
  <li><strong>Start with a full list of tasks or ideas:</strong> Don't worry about order—just write down everything that's on your plate so you can see it clearly.</li>
  <li><strong>Pick a framework that fits your context:</strong> Choose based on what you're prioritizing—Eisenhower for urgent items, MoSCoW for shared plans, or RICE for resource-heavy projects.</li>
  <li><strong>Evaluate and categorize everything honestly:</strong> Use objective criteria and sort your tasks accordingly—this is where clarity and action begin to take shape.</li>
</ol>

<div class="my-12 p-8 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between flex-wrap gap-4">
  <p class="font-bold text-gray-900 text-lg m-0 max-w-sm">Are you effectively managing tasks across different teams, languages, or global time zones?</p>
  <button class="bg-white text-gray-900 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">Learn More</button>
</div>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>At its core, prioritization is about gaining control of your time, your work, and your attention. It empowers you to act with intention, not just urgency.</p>`
  },
  {
    id: '2',
    title: 'Turning Big Ideas into Real-World Achievements',
    excerpt: 'Easy to reflect on and even easier to use — these thoughts can improve both action and intention.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO',
    category: 'sport',
    author: currentUser,
    date: 'Aug 5, 2025',
    slug: 'turning_big_ideas_into_real_world_achievements',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Whether you're managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.</p>

<p>In today's world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour. Without a system to guide your choices, it's easy to get stuck in reactive mode—working hard but not necessarily working smart. That's where prioritization frameworks come in.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Getting Lost in "Busy Work"</h2>
<p>In every field—whether you're a student, entrepreneur, team leader, or solo professional—it's easy to confuse activity with progress. You might spend hours responding to emails, putting out fires, or finishing small tasks, all while delaying the things that could actually drive meaningful outcomes.</p>
<p>The solution isn't just about doing less; it's about doing what matters more. By identifying which actions have the greatest impact, you create space to focus deeply.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Support Real Progress</h2>
<p>Prioritization frameworks give you a shared language for decision-making, especially in collaborative environments. Whether you're working with a product team, a class group, or across departments.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>At its core, prioritization is about gaining control of your time, your work, and your attention. It empowers you to act with intention, not just urgency.</p>`
  },
  {
    id: '3',
    title: 'What Travel Can Teach You About Culture and Life',
    excerpt: 'Take what works for you — this blog is written to support personal reflection and practical use.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASrgrgwUOmxHiB_Wzjn2q44znt3BHx-TP9feSFktOSaBxlnuiq3bpoddNsubdZ9k4rNb26L0rqDeGbVQejTp8Sfk0SRa5oiR3Uyck4avMoWAUpXJKM2kllNkvkHym9mIogumaAG3Bf9LauTOlGzrOk8VNIuzdpW2wrlP-zhT0UlM3clna8eChUgmb-oKZv8Ky_P_ZQerMPOUUulAmss-v8urvEzCvM7hDZmWd_pbAvG5C4PcVmWv5hlRO-Wu-8mWHDXcMKH3IGlozV',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASrgrgwUOmxHiB_Wzjn2q44znt3BHx-TP9feSFktOSaBxlnuiq3bpoddNsubdZ9k4rNb26L0rqDeGbVQejTp8Sfk0SRa5oiR3Uyck4avMoWAUpXJKM2kllNkvkHym9mIogumaAG3Bf9LauTOlGzrOk8VNIuzdpW2wrlP-zhT0UlM3clna8eChUgmb-oKZv8Ky_P_ZQerMPOUUulAmss-v8urvEzCvM7hDZmWd_pbAvG5C4PcVmWv5hlRO-Wu-8mWHDXcMKH3IGlozV',
    category: 'education',
    author: currentUser,
    date: 'Aug 4, 2025',
    slug: 'what_travel_can_teach_you_about_culture_and_life',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Travel opens doors to new perspectives, cultures, and ways of thinking that can transform how we see the world.</p>

<p>When we step outside our comfort zones and immerse ourselves in different environments, we gain insights that books and documentaries simply cannot provide. Travel teaches us about resilience, adaptability, and the beauty of human diversity.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Cultural Understanding Through Experience</h2>
<p>There's something powerful about experiencing a culture firsthand—tasting local food, hearing the language, and observing daily life. These experiences create lasting memories and deeper understanding.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Travel is more than just visiting places—it's about growing, learning, and connecting with the world around us.</p>`
  },
  {
    id: '4',
    title: 'How to Build a Team That Stays Strong and Loyal',
    excerpt: 'Read this for a calm shift in mindset, with practical takeaways and easy next steps to explore.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuBAOJE_FSwsW5RFUnX0e_fIhO9BAQdkEa6WGyDpSKwrICLjoVtBKo76FHoES0ZooqeKgTvJYH1fHMqFCACMh8-hhJlZYoJfg1qrEn8R9RnIXjIUXsKSttfpRk4eP0hoetWlDFghBr6z9uvTfixnhqsodMmAvFcGTIscA8qfpOK1WdWgpCqAEKQkmMAsSMkn_ioOMNGlFcX3yJHttR9Q6s7ylUDzNRvgD0dZU0r06YP71ltMNThOmkKCKnWD4RgV9bpe0YF9ysCdaz',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuBAOJE_FSwsW5RFUnX0e_fIhO9BAQdkEa6WGyDpSKwrICLjoVtBKo76FHoES0ZooqeKgTvJYH1fHMqFCACMh8-hhJlZYoJfg1qrEn8R9RnIXjIUXsKSttfpRk4eP0hoetWlDFghBr6z9uvTfixnhqsodMmAvFcGTIscA8qfpOK1WdWgpCqAEKQkmMAsSMkn_ioOMNGlFcX3yJHttR9Q6s7ylUDzNRvgD0dZU0r06YP71ltMNThOmkKCKnWD4RgV9bpe0YF9ysCdaz',
    category: 'tech',
    author: currentUser,
    date: 'Aug 2, 2025',
    slug: 'how_to_build_a_team_that_stays_strong_and_loyal',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Building a strong, loyal team requires more than just hiring talented individuals—it demands creating an environment where people feel valued, heard, and empowered.</p>

<p>Great teams are built on trust, clear communication, and shared values. When team members feel connected to the mission and each other, they're more likely to stay committed through challenges.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Creating a Culture of Trust</h2>
<p>Trust is the foundation of any strong team. It's built through consistent actions, transparency, and showing genuine care for each team member's growth and well-being.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>A loyal team is your greatest asset. Invest in relationships, communicate openly, and create an environment where everyone can thrive.</p>`
  },
  {
    id: '5',
    title: 'Learning from Past Mistakes',
    excerpt: 'Check this out for a fresh shift in perspective, with helpful ideas and practical moves to make.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD48JrjOU5yhEBG-xN_Ky0XBydKAm-Ejpo_yPP1y2H5xz1-DPk1VTfnFLUKuWy5ntGIPo1uQ28TIGjR2stIu8qAWpGxrCvQtAf-Z8XJnvAIigiVJKIgkfmo0Gfpl1HYFg-nfEY5FWdYM6Dm-RHxhW7PNObfEaCCKVu6OPDXkNgPlJZNFegY3s9l7VkxXS6MFuClhtXFqNHAXDDQ3_Pmh0UfyoJGnWCltdg_GWHoa_vVlQeGWGNCA-Fxhz1QLEjURlftZtOBoGne92RS',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD48JrjOU5yhEBG-xN_Ky0XBydKAm-Ejpo_yPP1y2H5xz1-DPk1VTfnFLUKuWy5ntGIPo1uQ28TIGjR2stIu8qAWpGxrCvQtAf-Z8XJnvAIigiVJKIgkfmo0Gfpl1HYFg-nfEY5FWdYM6Dm-RHxhW7PNObfEaCCKVu6OPDXkNgPlJZNFegY3s9l7VkxXS6MFuClhtXFqNHAXDDQ3_Pmh0UfyoJGnWCltdg_GWHoa_vVlQeGWGNCA-Fxhz1QLEjURlftZtOBoGne92RS',
    category: 'history',
    author: currentUser,
    date: 'July 8, 2025',
    slug: 'learning_from_past_mistakes',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Mistakes are not failures—they're opportunities for growth and learning that shape who we become.</p>

<p>Every mistake carries valuable lessons if we're willing to reflect honestly and apply what we've learned. The key is to view setbacks as stepping stones rather than roadblocks.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Reflecting on What Went Wrong</h2>
<p>Honest reflection is the first step toward learning. Ask yourself what happened, why it happened, and what you could do differently next time.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Embrace your mistakes as teachers. They provide insights that success alone cannot offer.</p>`
  },
  {
    id: '6',
    title: 'Simple Ways to Stay Productive',
    excerpt: 'Simple ideas with flexible use — relevant for now, tomorrow, or when you\'re ready for change.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzLWKKu1wP43aqWYEwSC-EiTuWskq1AvJtkqXRDDCCmPbw1UdHPSQyw96rOkuZEiQqvCcUPxyAhzB-OEdFY_OovyQBd_ivpBAtVaHn-qwZu7WQn8osHTi6uzGI5cJhrfCU_qgm69kFl6AdH4DoEuO0Xh2b-zuAueqgiqwwbhVD_rOSy1VvsQGmr5uUO3f8nLLd95x3XqbcQx1hogu55qJZNd-JtsSzOI0DUMA79xwIPL2zIAgdhC1K4PHqScKQykqcXevPYbxE1WUc',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzLWKKu1wP43aqWYEwSC-EiTuWskq1AvJtkqXRDDCCmPbw1UdHPSQyw96rOkuZEiQqvCcUPxyAhzB-OEdFY_OovyQBd_ivpBAtVaHn-qwZu7WQn8osHTi6uzGI5cJhrfCU_qgm69kFl6AdH4DoEuO0Xh2b-zuAueqgiqwwbhVD_rOSy1VvsQGmr5uUO3f8nLLd95x3XqbcQx1hogu55qJZNd-JtsSzOI0DUMA79xwIPL2zIAgdhC1K4PHqScKQykqcXevPYbxE1WUc',
    category: 'productivity',
    author: currentUser,
    date: 'July 7, 2025',
    slug: 'simple_ways_to_stay_productive',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Productivity isn't about doing more—it's about doing the right things with focus and intention.</p>

<p>Simple habits and systems can dramatically improve your output without overwhelming your schedule. The key is consistency and choosing methods that work for your unique situation.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Focus on What Matters</h2>
<p>Identify your most important tasks and tackle them first. This ensures you make progress on what truly moves the needle.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Productivity is a journey, not a destination. Find what works for you and stick with it.</p>`
  },
    {
    id: '7',
    title: 'Education for the Modern Age',
    excerpt: 'These insights aim to bring clarity to work, focus, goals, habits, and everyday adjustments.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCbTzNCxtSnXUdZcxM97EsutmjRIhsTGUVYTYwqsu_C8_N7WZ58h2tQgZ_F5ncyZjMmT32lghNhLcRUvz3JPN_mhvi3chCbmh7oqRCbrRsfbgib6e6z6Yb1gHb9-QnhUvvUcAQG3pa6gn9J9wem2UqNAbWMM9BEFHxeMYPqfNbEQdRpzmQf-f_SSa5CYGp-iGdSDLCXnRW5lPnocM0HUVjbtc6mDemwFMC8svwMsVGwJe9IT4q2ECrO8UFpCT1ff5W4y9pL0JYrvMr',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCbTzNCxtSnXUdZcxM97EsutmjRIhsTGUVYTYwqsu_C8_N7WZ58h2tQgZ_F5ncyZjMmT32lghNhLcRUvz3JPN_mhvi3chCbmh7oqRCbrRsfbgib6e6z6Yb1gHb9-QnhUvvUcAQG3pa6gn9J9wem2UqNAbWMM9BEFHxeMYPqfNbEQdRpzmQf-f_SSa5CYGp-iGdSDLCXnRW5lPnocM0HUVjbtc6mDemwFMC8svwMsVGwJe9IT4q2ECrO8UFpCT1ff5W4y9pL0JYrvMr',
    category: 'education',
    author: currentUser,
    date: 'July 5, 2025',
    slug: 'education_for_the_modern_age',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Education in the modern age must adapt to new technologies, changing job markets, and evolving learning styles.</p>

<p>The traditional classroom is being transformed by digital tools, personalized learning paths, and a focus on practical skills that prepare students for real-world challenges.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Embracing Technology in Learning</h2>
<p>Technology opens new possibilities for interactive, engaging education that meets students where they are and adapts to their learning pace.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>The future of education is flexible, personalized, and focused on developing skills that matter in today's world.</p>`
  },
  {
    id: '8',
    title: 'Key Business Trends You Should Start Following Today',
    excerpt: 'Keep going, keep adjusting — this blog supports thoughtful progress and consistent reflection.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcklzEp_WtHIkFBEh7DicoXlZAwsSdiC2aerVT8GWNj-ZOLMVc7xiA4Nhnsobm6i1QyvjSB4wNOJCG9SmGoO3fW0M9XcvZE4oDrV5Jyjvzmh1rSWm6dyz5aRZgjshB9Z7Ko4_Rp1XqUFem-Y1YGt5PmiHiNtVgs7dV4QXaSPUIU9kaZ3abua2wOOM099sBvgkRQZGfYGEEacbd5_zEodHJz8Sz8gs1ufvJLOmyuocbkPhE05acMafMlW1QLFeKNuBQO7ZiHej2Llkv',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcklzEp_WtHIkFBEh7DicoXlZAwsSdiC2aerVT8GWNj-ZOLMVc7xiA4Nhnsobm6i1QyvjSB4wNOJCG9SmGoO3fW0M9XcvZE4oDrV5Jyjvzmh1rSWm6dyz5aRZgjshB9Z7Ko4_Rp1XqUFem-Y1YGt5PmiHiNtVgs7dV4QXaSPUIU9kaZ3abua2wOOM099sBvgkRQZGfYGEEacbd5_zEodHJz8Sz8gs1ufvJLOmyuocbkPhE05acMafMlW1QLFeKNuBQO7ZiHej2Llkv',
    category: 'trends',
    author: currentUser,
    date: 'July 1, 2025',
    slug: 'key_business_trends_you_should_start_following_today',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Staying ahead in business means understanding and adapting to emerging trends before they become mainstream.</p>

<p>From AI integration to sustainability initiatives, today's business landscape is evolving rapidly. Companies that embrace change and innovation are positioning themselves for long-term success.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">The Rise of AI and Automation</h2>
<p>Artificial intelligence is transforming how businesses operate, from customer service to data analysis. Understanding these tools is becoming essential.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Stay curious, stay informed, and be ready to adapt. The businesses that thrive are those that evolve with the times.</p>`
  },
    {
    id: '9',
    title: 'Life Lessons We Can Learn from Today\'s Top Athletes',
    excerpt: 'Designed to support your thinking and direction — without pressure, just something to take in.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu2A_EVRP-Cu6ZpMsEWqp67EIbb_by26EHAf-Pjy16AZt8YbPKG6Yuw3bRzM1DGpzoYlLz_LSUhJ-D5JID9xZtPy1txwz2vJ8yqRuTkmg0AizdCmIsn3GD07IV75WW69seJNLQxYBoB-r24ICGmOffVnZakwkjgwOhZUqh36qXuI4bjreOMYq2NA3xOHUDgzTyINN9HvC2n3EpksmPKrBh07gDQsGwXy1iWy-E0lEFoRQzogzFQV3K66J4h1fSPnDCmJAF55cvOpz_',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu2A_EVRP-Cu6ZpMsEWqp67EIbb_by26EHAf-Pjy16AZt8YbPKG6Yuw3bRzM1DGpzoYlLz_LSUhJ-D5JID9xZtPy1txwz2vJ8yqRuTkmg0AizdCmIsn3GD07IV75WW69seJNLQxYBoB-r24ICGmOffVnZakwkjgwOhZUqh36qXuI4bjreOMYq2NA3xOHUDgzTyINN9HvC2n3EpksmPKrBh07gDQsGwXy1iWy-E0lEFoRQzogzFQV3K66J4h1fSPnDCmJAF55cvOpz_',
    category: 'arts',
    author: currentUser,
    date: 'June 8, 2025',
    slug: 'life_lessons_we_can_learn_from_todays_top_athletes',
    sidebarBanner: {
      badge: 'Ultimate Guide',
      title: 'Follow the\nThought Trail',
      description: 'Explore all topics and find the ones that matter to you.',
      buttonText: 'Explore Categories',
      buttonLink: '/categories',
      backgroundColor: '#4c1d95'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Top athletes demonstrate qualities that extend far beyond their sport—discipline, resilience, and the ability to perform under pressure.</p>

<p>Their dedication to continuous improvement, mental toughness, and teamwork offers valuable lessons we can apply to our own lives and careers.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">The Power of Discipline</h2>
<p>Elite athletes show us that consistent, daily practice is what separates good from great. Small, repeated actions compound into extraordinary results.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Whether in sports or life, success comes from dedication, resilience, and the willingness to push beyond your comfort zone.</p>`
  },
  // Posts for cities
  {
    id: '10',
    title: 'Exploring the Historic Streets of Hanoi',
    excerpt: 'Discover the charm of Vietnam\'s capital city, from ancient temples to bustling street markets.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM',
    category: 'hanoi',
    author: currentUser,
    date: 'Aug 10, 2025',
    slug: 'exploring_the_historic_streets_of_hanoi',
    sidebarBanner: {
      badge: 'City Guide',
      title: 'Discover\nHanoi',
      description: 'Explore the rich culture and history of Vietnam\'s capital.',
      buttonText: 'More Stories',
      buttonLink: '/hanoi',
      backgroundColor: '#059669'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Hanoi, the capital of Vietnam, is a city where ancient traditions meet modern life in perfect harmony.</p>

<p>From the historic Old Quarter with its narrow streets and colonial architecture to the serene Hoan Kiem Lake, Hanoi offers a unique blend of culture, history, and vibrant street life.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">The Old Quarter Experience</h2>
<p>Wander through the maze of streets in the Old Quarter, each named after the goods once sold there. Today, these streets are filled with cafes, shops, and the energy of daily life.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Hanoi is a city that captures the heart with its charm, history, and the warmth of its people.</p>`
  },
  {
    id: '11',
    title: 'The Modern Pulse of Ho Chi Minh City',
    excerpt: 'Experience the energy of Vietnam\'s largest city, where innovation meets tradition.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae',
    category: 'ho-chi-minh-city',
    author: currentUser,
    date: 'Aug 9, 2025',
    slug: 'the_modern_pulse_of_ho_chi_minh_city',
    sidebarBanner: {
      badge: 'City Guide',
      title: 'Explore\nHo Chi Minh',
      description: 'Discover the dynamic energy of Vietnam\'s economic hub.',
      buttonText: 'More Stories',
      buttonLink: '/ho-chi-minh-city',
      backgroundColor: '#dc2626'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Ho Chi Minh City, formerly known as Saigon, is Vietnam\'s largest and most dynamic city.</p>

<p>This bustling metropolis is a hub of commerce, culture, and innovation, where skyscrapers rise alongside historic landmarks and street food vendors serve up authentic flavors.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">A City of Contrasts</h2>
<p>From the historic Notre-Dame Cathedral to the modern Bitexco Financial Tower, Ho Chi Minh City seamlessly blends its colonial past with a forward-looking vision.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Ho Chi Minh City is a city that never sleeps, offering endless opportunities for exploration and discovery.</p>`
  },
  {
    id: '12',
    title: 'Seoul: Where Tradition Meets Innovation',
    excerpt: 'Discover the vibrant capital of South Korea, a city that perfectly balances ancient culture with cutting-edge technology.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPyH1It7mPYLVY97FblovAeScYYB7xvyZWmjkhRDwJLHxXLAXYak-zFyCWDooKEtG9HEyFhDyYcFF4XarCZ7rO3WvaeHdMiPWrp7zBweI12u0GVxwS1J04WLJSJumkTkP_z_20tMJLhi4xMh6x1JJqjQHeIi5dC9WZD4I-RFWrjXmClbe8QcC3LBuKYdd9A-9HEOXMMwvBJbAvuDxT3b6kUalf-71EY1NlDB9xHm5oMb9VTGNQ4nUvPSIclzQKcB2qvOOuUXf7SOT1',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPyH1It7mPYLVY97FblovAeScYYB7xvyZWmjkhRDwJLHxXLAXYak-zFyCWDooKEtG9HEyFhDyYcFF4XarCZ7rO3WvaeHdMiPWrp7zBweI12u0GVxwS1J04WLJSJumkTkP_z_20tMJLhi4xMh6x1JJqjQHeIi5dC9WZD4I-RFWrjXmClbe8QcC3LBuKYdd9A-9HEOXMMwvBJbAvuDxT3b6kUalf-71EY1NlDB9xHm5oMb9VTGNQ4nUvPSIclzQKcB2qvOOuUXf7SOT1',
    category: 'seoul',
    author: currentUser,
    date: 'Aug 7, 2025',
    slug: 'seoul_where_tradition_meets_innovation',
    sidebarBanner: {
      badge: 'City Guide',
      title: 'Discover\nSeoul',
      description: 'Experience the perfect blend of tradition and innovation.',
      buttonText: 'More Stories',
      buttonLink: '/seoul',
      backgroundColor: '#4f46e5'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Seoul is a city of contrasts, where ancient palaces stand alongside futuristic skyscrapers.</p>

<p>From the historic Gyeongbokgung Palace to the bustling streets of Gangnam, Seoul offers a unique experience that combines Korea\'s rich heritage with modern innovation.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">A Cultural Melting Pot</h2>
<p>Seoul\'s neighborhoods each tell a different story—from the traditional Bukchon Hanok Village to the trendy streets of Hongdae.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Seoul is a city that invites you to explore, discover, and be inspired by its unique blend of past and present.</p>`
  },
  {
    id: '13',
    title: 'Paris: The City of Light and Inspiration',
    excerpt: 'Immerse yourself in the art, culture, and romance of Paris, where every corner tells a story.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7',
    category: 'paris',
    author: currentUser,
    date: 'Aug 6, 2025',
    slug: 'paris_the_city_of_light_and_inspiration',
    sidebarBanner: {
      badge: 'City Guide',
      title: 'Explore\nParis',
      description: 'Discover the art, culture, and romance of the City of Light.',
      buttonText: 'More Stories',
      buttonLink: '/paris',
      backgroundColor: '#ec4899'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Paris, the City of Light, has long been a source of inspiration for artists, writers, and dreamers.</p>

<p>From the iconic Eiffel Tower to the charming streets of Montmartre, Paris offers an endless array of cultural experiences, world-class cuisine, and architectural marvels.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Art and Culture</h2>
<p>The Louvre, Musée d\'Orsay, and countless galleries showcase the city\'s rich artistic heritage, while street performers and local artists add to the vibrant cultural scene.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Paris is more than a city—it\'s an experience that stays with you long after you\'ve left its beautiful streets.</p>`
  },
  {
    id: '14',
    title: 'Berlin: A Creative Hub of Innovation',
    excerpt: 'Explore Berlin\'s vibrant startup scene, rich history, and thriving creative culture.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae',
    category: 'berlin',
    author: currentUser,
    date: 'Aug 4, 2025',
    slug: 'berlin_a_creative_hub_of_innovation',
    sidebarBanner: {
      badge: 'City Guide',
      title: 'Discover\nBerlin',
      description: 'Experience the creative energy and innovation of Germany\'s capital.',
      buttonText: 'More Stories',
      buttonLink: '/berlin',
      backgroundColor: '#475569'
    },
    content: `<p class="lead text-xl text-gray-600 mb-8">Berlin is a city that embraces change, creativity, and innovation like no other.</p>

<p>From its thriving startup ecosystem to its world-renowned art scene, Berlin has become a magnet for entrepreneurs, artists, and innovators from around the world.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">A City of Transformation</h2>
<p>Berlin\'s history is written in its architecture, from the remnants of the Berlin Wall to the modern glass towers of Potsdamer Platz, telling a story of resilience and renewal.</p>

<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
<p>Berlin is a city that challenges, inspires, and invites you to be part of its ongoing story of innovation and creativity.</p>`
  },
];

// Export posts with slugs
export const posts: Post[] = postsData;

// Areas (khu vực)
export const areas: Area[] = [
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    region: 'Asia',
    icon: 'beach_access',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM',
    colorClass: 'bg-emerald-500/30',
    description: 'A vibrant region known for its diverse cultures, tropical landscapes, and rich history.'
  },
  {
    id: 'east-asia',
    name: 'East Asia',
    region: 'Asia',
    icon: 'location_city',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae',
    colorClass: 'bg-indigo-500/30',
    description: 'Modern metropolises blending ancient traditions with cutting-edge technology.'
  },
  {
    id: 'western-europe',
    name: 'Western Europe',
    region: 'Europe',
    icon: 'museum',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7',
    colorClass: 'bg-orange-500/30',
    description: 'Historic cities, art, cuisine, and cultural landmarks that define European elegance.'
  },
  {
    id: 'central-europe',
    name: 'Central Europe',
    region: 'Europe',
    icon: 'castle',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6vGpgwpnbGLX9wjrzgI9JThIX1mrklILsT97zyDgYhgx_rNCstWU-OUZMTAflluijImP5G7PlpNGx22yP_PiNVLJrCID2LBaEpNQj_ePUC86sBSoV_UP8PNAps4GcstyeENgxWAfDU95mTZDP7WRhJ6dPnNOe3if8pO8j1_u01tAv0vXmEsPZshUiRSINmkU-qicFbxuI2rWSEzmZj3Rezs2hG-SOq8T3F-qs8GNorT2uq55CX09ccRMPEQ81OFgJHeUa2zGj2u4N',
    colorClass: 'bg-blue-500/30',
    description: 'A region of innovation, history, and cultural diversity at the heart of Europe.'
  }
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

// Export cities as computed array from categories (for backward compatibility)
export const cities: City[] = categories
  .filter((cat): cat is Category & { isCity: true; areaId: string; countryId: string } => 
    cat.isCity === true && !!cat.areaId && !!cat.countryId
  )
  .map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    image: cat.image,
    colorClass: cat.colorClass,
    description: cat.description || '',
    areaId: cat.areaId!,
    countryId: cat.countryId!,
  }));
