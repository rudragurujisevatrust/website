/**
 * English is the source of truth: `Dictionary` is derived from this object, so
 * every other locale file is type-checked against it and a missing key is a
 * build error rather than a blank space on the page.
 */
const en = {
  meta: {
    description:
      "Rudra Guruji Naga Sadhu Charitable Trust serves the community every day through Nithya Annadhanam, support for farmers, medical aid, and financial help for families in need.",
    eventsDescription:
      "Daily updates from the Rudra Guruji Naga Sadhu Charitable Trust — annadhanam, farmer support, medical aid and more.",
    sevaDescription:
      "The standing charitable programmes of the Rudra Guruji Naga Sadhu Charitable Trust.",
    donateDescription:
      "Support the daily annadhanam and the charitable work of the Rudra Guruji Naga Sadhu Charitable Trust.",
    volunteerDescription:
      "Give your time to the Rudra Guruji Naga Sadhu Charitable Trust — kitchen seva, serving, distribution and transport.",
    aboutDescription:
      "The story, principles and reach of the Rudra Guruji Naga Sadhu Charitable Trust.",
    galleryDescription:
      "Photographs from the seva of the Rudra Guruji Naga Sadhu Charitable Trust — gau seva, farmer support, and the ashram.",
  },

  brand: {
    name: "Rudra Guruji Naga Sadhu Charitable Trust",
    nameLine1: "Rudra Guruji Naga Sadhu",
    nameLine2: "Charitable Trust",
    tagline: "Seva is the highest worship",
    mantra: "ॐ नमः शिवाय",
  },

  nav: {
    home: "Home",
    events: "Daily Events",
    gallery: "Gallery",
    seva: "Our Seva",
    donate: "Donate",
    volunteer: "Volunteer",
    about: "About",
    admin: "Admin",
    mainLabel: "Main",
    skipToContent: "Skip to content",
    openMenu: "Open navigation menu",
    menuTitle: "Navigation menu",
    menuDescription:
      "Links to every section of the Rudra Guruji Naga Sadhu Charitable Trust website.",
  },

  language: {
    label: "Language",
    choose: "Choose a language",
  },

  audio: {
    play: "Play Om Namah Shivaya",
    pause: "Press here to pause",
    unavailable: "Background chant unavailable",
    waiting: "Tap anywhere to start the chant",
    hint: "Tap anywhere to begin the chant",
    playing: "Press here to pause",
    muted: "Muted — press to play",
    tapToStart: "Tap page to start",
    notFound: "Track not found",
    gateTitle: "Enter with the chant",
    gateBody:
      "Your browser needs one tap before it will play sound. Touch anywhere to enter and begin Om Namah Shivaya.",
    gateEnter: "Enter",
    gateSkip: "Enter without sound",
  },

  home: {
    heroIntro__part1: "Not one day has passed without the afternoon meal being served. Beside the ",
    heroIntro__strong: "Nithya Annadhanam",
    heroIntro__part2:
      ", the trust stands with farmers through a hard season, meets hospital bills for families who cannot, and keeps children in school.",
    ctaDonate: "Offer a donation",
    ctaEvents: "See today's seva",
    missionEyebrow: "Our Mission",
    missionTitle: "Seva that happens every day",
    missionDescription:
      "Five standing karyakramas, run by volunteers, funded entirely by devotees.",
    missionMoreLabel: "Read how each karyakrama runs",
    missionMoreCta: "Our Seva in detail",
    donateEyebrow: "Annadhanam Seva",
    donateTitle: "Feed one more person today",
    donateDescription:
      "₹60 serves one full meal. Scan the code with any UPI app — GPay, PhonePe, Paytm or BHIM.",
    recentEyebrow: "From the ground",
    recentTitle: "Recent daily events",
    recentDescription: "What the volunteers did this week, in their own words.",
    recentCta: "All daily updates",
  },

  stats: {
    days: "Days of unbroken annadhanam",
    meals: "Meals served every afternoon",
    farmers: "Farmer families supported",
    hospital: "Hospitalisations funded",
  },

  seva: {
    eyebrow: "Seva Karyakramas",
    title: "How each programme runs",
    description:
      "Nothing here is seasonal. These are standing commitments the trust keeps, day after day.",
    items: {
      annadhanam: {
        title: "Nithya Annadhanam",
        titleLocal: "नित्य अन्नदानम्",
        summary:
          "A free hot meal served every single afternoon, to anyone who comes.",
        detail:
          "Cooking begins before dawn and the first pankti is seated by half past twelve. No register is kept and no questions are asked — labourers, patients' families, students and pilgrims eat the same prasadam from the same vessel. This is the trust's oldest and most important vow.",
      },
      farming: {
        title: "Farmer Support",
        titleLocal: "रैतर सहाय",
        summary:
          "Seed, manure, and equipment repair for small and marginal farmers.",
        detail:
          "Before each sowing season the trust distributes certified seed and organic manure to farmers holding under two acres. When a borewell pump fails or a crop is lost to unseasonal rain, we step in with repair and replanting assistance so that no family's land is left fallow.",
      },
      medical: {
        title: "Medical & Hospitalisation",
        titleLocal: "आरोग्य सेवा",
        summary:
          "Hospital deposits, surgery costs, and medicines for those who cannot pay.",
        detail:
          "The trust settles admission deposits, funds surgeries, and covers post-operative medicine for families with no means. Attendants staying at the bedside are fed daily so that nobody has to leave a sick relative to look for food. We also run free screening camps with visiting doctors.",
      },
      financial: {
        title: "Financial Help",
        titleLocal: "आर्थिक सहाय",
        summary: "Monthly rations and rent support for families in crisis.",
        detail:
          "Volunteers identify households — most often headed by widows, the elderly, or someone unable to work through illness — and provide a month of dry rations along with direct rent assistance, reviewed every month.",
      },
      education: {
        title: "Vidya Daanam",
        titleLocal: "विद्या दानम्",
        summary:
          "School fees, uniforms, and books for children of daily labourers.",
        detail:
          "Fees, uniforms, notebooks and geometry boxes are given at the start of each academic year, and volunteers follow up with class teachers every quarter to make sure attendance holds through the harvest months.",
      },
    },
  },

  events: {
    eyebrow: "Seva Karyakrama",
    title: "Daily events & updates",
    description:
      "Every meal served, every family helped, recorded here by the volunteers who were there.",
    filterLabel: "Filter events by category",
    allUpdates: "All updates",
    emptyTitle: "No updates in this category yet",
    emptyBody: "Please check back soon — seva continues every day.",
    viewImage: "View image {n} of {total}",
    photoAlt: "photo {n}",
    photoViewer: "photo viewer",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    closeViewer: "Close photo viewer",
  },

  gallery: {
    eyebrow: "Darshan",
    title: "Gallery",
    description:
      "Moments from the trust's seva, and from Guruji's own practice.",
    homeEyebrow: "Gallery",
    homeTitle: "Glimpses of the seva",
    homeDescription:
      "Photographs sent in by the volunteers who were there.",
    homeCta: "View the full gallery",
    filterLabel: "Filter photographs by subject",
    all: "All",
    categories: {
      seva: "Seva",
      guruji: "Guruji",
      trust: "The Trust",
    },
    open: "Open photograph: {caption}",
    viewer: "Photograph viewer",
    prev: "Previous photograph",
    next: "Next photograph",
    close: "Close viewer",
    captions: {
      "himalaya-tapas": "Tapas in the Himalayas",
      "farmer-support-temple":
        "₹5,00,000 given at once to a farmer in distress",
      "gau-seva-1": "Gau seva at the ashram",
      "gau-seva-2": "Feeding the cattle",
      "guruji-tapas-rock": "In meditation",
      "gau-seva-3": "Fodder and water for the herd",
      "ashram-new-vessels": "New vessels for the annadhanam kitchen",
      "trust-emblem": "The trust emblem",
      "guruji-blessing": "Blessing the devotees",
      "for-dharma": "For dharma, for the people",
      "guru-anugraham": "The Guru's grace",
      "guru-portrait": "Guru puja",
      dhyana: "Absorbed in dhyana",
      "guru-and-disciples": "With the devotees",
      "prayer-for-farmers": "Prayers for rain, and for the farmers",
      "justice-day": "International Justice Day greetings",
    },
  },

  donate: {
    eyebrow: "Dana",
    title: "Give to the annadhanam",
    description:
      "The trust runs on the offerings of devotees. There is no corpus and no salaried staff — what comes in today is served tomorrow.",
    scanToGive: "Scan to give",
    chooseAmount: "Choose an amount (optional)",
    anyAmount: "Any amount",
    upiId: "UPI ID",
    copyAria: "Copy UPI ID",
    copied: "UPI ID copied",
    copyFailed: "Could not copy — please note the UPI ID manually",
    payWithUpi: "Pay with a UPI app",
    note__part1:
      "Every contribution goes directly to the day's annadhanam and to families under our care. For 80G receipts or bank transfer details, write to ",
    impact: {
      meal: {
        amount: "₹60",
        title: "One full meal",
        detail:
          "Rice, sambar, palya, curd and a sweet — one person, one afternoon.",
      },
      seed: {
        amount: "₹3,000",
        title: "A season of seed",
        detail:
          "Certified seed and organic manure for one marginal farmer's sowing.",
      },
      hospital: {
        amount: "₹25,000",
        title: "A hospital deposit",
        detail: "Admission and surgery costs for a family that cannot pay.",
      },
    },
    otherTitle: "Other ways to give",
    otherSponsorStrong: "Sponsor a day of annadhanam",
    otherSponsorRest:
      " in the name of a family member or on a birthday or shraddha tithi. Write to us and we will arrange it.",
    otherBankStrong: "Bank transfer / cheque",
    otherBankRest: " — contact the trust for account details and 80G receipts.",
    otherKindStrong: "In kind",
    otherKindRest:
      " — rice, dal, oil and vegetables are always needed at the kitchen.",
    reachPrefix: "Reach us at ",
    reachJoin: " or ",
  },

  volunteer: {
    eyebrow: "Seva Opportunities",
    title: "Come stand in the kitchen",
    description:
      "No skill is required and no commitment is too small. Most of our volunteers began by coming once.",
    flexible: "Flexible",
    weekends: "Weekends",
    roles: {
      kitchen: {
        title: "Kitchen seva",
        time: "6:00 AM – 11:00 AM",
        detail:
          "Cleaning rice and vegetables, cooking alongside the head cook, and preparing the serving vessels.",
      },
      serving: {
        title: "Serving the pankti",
        time: "12:00 PM – 2:30 PM",
        detail:
          "Seating guests, serving prasadam, and making sure nobody leaves without eating fully.",
      },
      transport: {
        title: "Distribution & transport",
        time: "Flexible",
        detail:
          "Carrying rations to families, delivering seed to farms, and taking patients to hospital appointments.",
      },
      weekend: {
        title: "Weekend & festival seva",
        time: "Weekends",
        detail:
          "Extra hands for the monthly Rudrabhishekam, health camps, and school-kit distribution days.",
      },
    },
    ctaTitle: "Ready to join?",
    ctaBody:
      "Call or write to the trust and tell us which day suits you. There is no form to fill and no fee — simply arrive and we will put you to work.",
    ctaWrite: "Write to us",
  },

  about: {
    eyebrow: "About the Trust",
    title: "Born from a single afternoon meal",
    description:
      "What began as one pot of rice offered at Guruji's doorstep has become an unbroken daily annadhanam.",
    story1__prefix: "The ",
    story1__suffix:
      " was founded on a simple instruction from Rudra Guruji: no one who comes to the door in the afternoon should leave hungry. In the beginning it was one pot of rice, cooked by a handful of devotees and served on the verandah.",
    story2:
      "As word spread, so did the need. Farmers came asking for seed after a failed monsoon. Families came with hospital bills they could not settle. Children stopped attending school because uniforms cost more than a day's wage. The trust grew around these needs rather than around a plan.",
    story3:
      "Today the kitchen serves over four hundred people every afternoon, and the same volunteers who wash the vessels also carry rations to homes, sit with patients in hospital corridors, and follow up with class teachers. The work is ordinary. It is the continuity that matters.",
    quote:
      "Seva is not what you do after your own needs are met. It is what fills the time you would otherwise spend on yourself.",
    principlesTitle: "What we hold to",
    principles: {
      anna: {
        title: "Anna is never refused",
        detail:
          "Whoever arrives at the hall is fed. We keep no register, ask no caste, and check no income.",
      },
      rupee: {
        title: "Every rupee is seva",
        detail:
          "The trust has no salaried staff. Donations go to provisions, medicines, seed and fees — nothing else.",
      },
      quiet: {
        title: "Help where it is quiet",
        detail:
          "Most of the families we support never ask. Volunteers find them, and the help arrives without ceremony.",
      },
      accounts: {
        title: "Accounts stay open",
        detail:
          "What was received and what was spent is available to any donor who asks for it.",
      },
    },
  },

  footer: {
    explore: "Explore",
    reach: "Reach the trust",
    rights: "Every rupee received goes to seva.",
  },

  admin: {
    title: "Admin portal",
    body: "The secure dashboard for managing daily events, image uploads and categories is not built yet. It arrives in the next step, protected by Supabase Authentication.",
    plannedLabel: "Planned",
    planned1: "Email + password login for the single master admin",
    planned2: "Create, edit and delete daily event posts",
    planned3: "Single or multi-image upload to Supabase Storage",
    planned4: "Add and remove categories used by the public filter",
  },

  categories: {
    annadhanam: "Annadhanam",
    farming: "Farmer Support",
    medical: "Medical Aid",
    financial: "Financial Help",
    education: "Vidya Daanam",
    utsava: "Utsava",
  },

  demoEvents: {
    "evt-001": {
      title: "Nithya Annadhanam — 412 devotees served",
      description:
        "By Guruji's grace the afternoon annadhanam continued for the 1,180th unbroken day. Volunteers began at 6 in the morning cleaning rice and vegetables, and the first pankti was seated by 12:30. Today's prasadam was pulihora, majjige huli, palya, curd rice and a sweet of kesari bath. Families from the nearby construction site and patients' relatives from the taluk hospital ate with us. Anyone who arrives hungry is fed — no register, no questions.",
    },
    "evt-002": {
      title: "Seed and manure support for 23 small farmers",
      description:
        "Ahead of the sowing season the trust distributed certified ragi and tur dal seed along with organic manure to twenty-three farmers holding under two acres. Each family also received a soil health card reading arranged through the local krishi kendra. Two farmers who lost their borewell pumps in last month's storm were given repair assistance so their land does not go fallow this cycle.",
    },
    "evt-003": {
      title: "Hospitalisation support for Smt. Lakshmamma",
      description:
        "Smt. Lakshmamma, a daily wage worker and mother of two, needed an emergency gall bladder surgery. The trust settled the hospital deposit and arranged her medicines for the post-operative month. Her family was given annadhanam every day of her admission so that no one had to leave her bedside to find food. She has been discharged and is recovering at home.",
    },
    "evt-004": {
      title: "School kits handed to 60 children",
      description:
        "Notebooks, geometry boxes, uniforms and a year of school fees were provided to sixty children whose parents work as agricultural labour. Guruji spoke to the children about discipline and gratitude before the kits were distributed. Volunteers will follow up each quarter with the class teachers to make sure attendance holds.",
    },
    "evt-005": {
      title: "Maha Rudrabhishekam and mass annadhanam",
      description:
        "The monthly Rudrabhishekam was performed with eleven ritwiks chanting the Rudram. Over nine hundred devotees took part and stayed for the annadhanam that followed. Donors sponsored the entire day's provisions, and the surplus vegetables were sent to two orphanages in the district.",
    },
    "evt-006": {
      title: "Monthly ration and rent assistance to 14 families",
      description:
        "Fourteen families identified by our volunteers received a month of dry rations — rice, dal, oil, salt and spices — along with direct rent assistance. Priority this month went to households headed by widows and to three families where the earning member is undergoing dialysis.",
    },
    "evt-007": {
      title: "Free health camp with 6 visiting doctors",
      description:
        "A day-long camp screened 268 villagers for blood pressure, diabetes and anaemia. Six doctors volunteered their time and medicines were dispensed free of cost. Nineteen people were referred for further tests, and the trust has committed to covering those costs.",
    },
  },
};

export default en;

/** Every other locale file must satisfy this exact shape. */
export type Dictionary = typeof en;
