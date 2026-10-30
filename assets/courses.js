/* Learn Anything — course pages prototype script (library, course, lesson).
   Static data + behaviour so the pages can be reviewed without the app. In the Lovable port the data
   comes from the existing loaders; only the rendering and the interaction patterns carry over. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  var state = params.get('state') || '';

  /* ---------------- icons (lucide paths) ---------------- */
  var I = {
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    menu: '<line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    'share-2': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    'bar-chart': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    'chef-hat': '<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    'grid-2x2': '<path d="M12 3v18"/><path d="M3 12h18"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
    quote: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>'
  };
  function ico(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[name] || '') + '</svg>';
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- data (pulled from the live site on Oct 30 2026) ---------------- */
  var LIBRARY = [
    { slug: 'gardening-for-beginners', title: 'Gardening for Absolute Beginners', description: 'A practical, step-by-step guide to starting your first home garden, focusing on immediate results and essential maintenance.', lessons: 6, level: 'Beginner', img: 'img/gardening.jpg', tag: 'outdoors' },
    { slug: 'budgeting-on-an-irregular-income', title: 'Mastering the Rollercoaster: Budgeting on an Irregular Income', description: 'A practical roadmap for freelancers, gig workers, and commission-based professionals to achieve financial stability despite fluctuating monthly paychecks.', lessons: 10, level: 'Beginner', img: 'img/budgeting.jpg', tag: 'money' },
    { slug: 'sink-chip-and-scratch-repair', title: 'DIY Sink Restoration: Repairing Chips and Scratches', description: 'A practical, step-by-step guide to restoring the finish of porcelain, ceramic, and acrylic sinks using professional-grade DIY techniques.', lessons: 11, level: 'Beginner', img: 'img/sink.jpg', tag: 'home' },
    { slug: 'home-electrical-safety', title: 'Home Electrical Safety Fundamentals', description: "A practical guide for homeowners to identify hazards, understand their home's electrical system, and perform basic maintenance safely.", lessons: 10, level: 'Beginner', img: 'img/electrical.jpg', tag: 'home' },
    { slug: 'basic-knife-skills', title: 'Mastering Basic Knife Skills', description: 'A practical, hands-on guide to becoming confident and efficient with a kitchen knife, focusing on safety, technique, and essential cuts.', lessons: 10, level: 'Beginner', img: 'img/knife.jpg', tag: 'kitchen' },
    { slug: 'tying-a-bowline-knot', title: 'Mastering the Bowline Knot', description: "A hands-on, step-by-step guide to learning the 'King of Knots,' moving from basic mechanics to tying it behind your back.", lessons: 10, level: 'Beginner', img: 'img/bowline.jpg', tag: 'outdoors' },
    { slug: 'horseback-riding-for-beginners', title: 'Horseback Riding for Absolute Beginners', description: 'A practical, step-by-step guide to safe horse handling, basic riding techniques, and building a confident relationship with your horse.', lessons: 11, level: 'Beginner', img: 'img/horseback.jpg', tag: 'outdoors' },
    { slug: 'fix-a-running-toilet', title: 'Fixing a Running Toilet: A DIY Guide', description: 'A practical, step-by-step course designed to help beginners diagnose and repair common toilet leaks and running issues without hiring a plumber.', lessons: 10, level: 'Beginner', img: 'img/toilet.jpg', tag: 'home' },
    { slug: 'how-mortgages-work', title: "Mortgages 101: A Beginner's Guide to Home Financing", description: 'A comprehensive introduction to the world of home loans, covering how they function, the different types available, and the application process for first-time buyers.', lessons: 12, level: 'Beginner', img: 'img/mortgages.jpg', tag: 'money' },
    { slug: 'beekeeping-basics', title: "Beekeeping Basics: A Beginner's Guide to Starting Your First Hive", description: 'A comprehensive introductory course covering the biology of bees, essential equipment, hive management, and the seasonal cycles of beekeeping.', lessons: 12, level: 'Beginner', img: 'img/beekeeping.jpg', tag: 'outdoors' },
    { slug: 'personal-finance-fundamentals', title: 'Personal Finance Mastery for Beginners', description: 'A practical, step-by-step guide to managing your money, eliminating debt, and building long-term wealth through automated systems.', lessons: 11, level: 'Beginner', img: 'img/finance.jpg', tag: 'money' }
  ];
  var TAGS = [
    { id: 'all', label: 'All courses', icon: 'grid-2x2' },
    { id: 'home', label: 'Home & DIY', icon: 'house' },
    { id: 'money', label: 'Money', icon: 'wallet' },
    { id: 'kitchen', label: 'Kitchen', icon: 'chef-hat' },
    { id: 'outdoors', label: 'Outdoors & animals', icon: 'leaf' }
  ];
  // the signed-in user's own list (from the live "Your courses" section); progress is sample state
  var MINE = [
    { slug: 'basic-knife-skills', title: 'Mastering Basic Knife Skills', done: 1, total: 10, img: 'img/knife.jpg', next: "The 'Claw' Hand" },
    { slug: 'underwater-basket-weaving', title: 'Underwater Basket Weaving for Beginners', done: 0, total: 10, next: 'Lesson 1' },
    { slug: 'surfing-backwards', title: 'Reverse Riding: Master Surfing Backwards', done: 0, total: 6, next: 'Lesson 1' }
  ];
  var COURSE = {
    slug: 'basic-knife-skills', title: 'Mastering Basic Knife Skills',
    description: 'A practical, hands-on guide to becoming confident and efficient with a kitchen knife, focusing on safety, technique, and essential cuts.',
    level: 'Beginner', lessonCount: 10, sittings: 'about 4 sittings of 20 min', updated: 'Oct 27, 2026', category: 'Everyday essentials',
    prerequisites: ['Access to a kitchen', 'A chef’s knife (8-inch recommended)', 'A stable cutting board'],
    modules: [
      { title: 'Foundation and Safety', description: 'Establish the correct grip and stance to ensure safety and control before you start cutting.', lessons: [
        { title: 'The Pinch Grip', description: 'Learn why holding the blade itself provides more control than just holding the handle.' },
        { title: "The 'Claw' Hand", description: 'Practice the essential non-cutting hand position to protect your fingertips from the blade.' },
        { title: 'Setting Up Your Station', description: 'How to secure your cutting board with a damp towel and organize your workspace for efficiency.' }] },
      { title: 'The Mechanics of Cutting', description: 'Master the physical motion of the knife to achieve clean cuts without using excessive force.', lessons: [
        { title: 'The Circular Motion', description: "Practice the 'rocking' motion where the tip of the knife stays in contact with the board." },
        { title: 'The Draw Cut', description: 'Learn how to pull the blade through delicate items like herbs to avoid bruising them.' }] },
      { title: 'Essential Vegetable Shapes', description: 'Apply your technique to common vegetables to create uniform pieces for even cooking.', lessons: [
        { title: 'Squaring and Dicing', description: "Turn a round potato into uniform cubes using the 'plank and stick' method." },
        { title: 'The Onion Technique', description: 'The professional way to dice an onion quickly and safely using its natural structure.' },
        { title: 'Julienne and Batonnet', description: 'Practice cutting vegetables into consistent matchsticks for salads and stir-fries.' }] },
      { title: 'Maintenance and Speed', description: 'Keep your tools in top shape and learn how to gradually increase your kitchen efficiency.', lessons: [
        { title: 'Honing vs. Sharpening', description: "How to use a honing rod to realign your blade's edge between professional sharpenings." },
        { title: 'Cleaning and Storage', description: 'Best practices for washing and storing knives to prevent dulling and accidents.' }] }
    ],
    resources: [
      { kind: 'book', title: 'Salt, Fat, Acid, Heat', provider: 'by Samin Nosrat', url: 'https://www.goodreads.com/search?q=Salt%2C%20Fat%2C%20Acid%2C%20Heat%20Samin%20Nosrat' },
      { kind: 'book', title: 'The Professional Chef', provider: 'by The Culinary Institute of America', url: 'https://www.goodreads.com/search?q=The%20Professional%20Chef%20Culinary%20Institute%20of%20America' },
      { kind: 'youtube', title: 'Basics with Babish: Knife Skills', provider: 'Babish Culinary Universe', url: 'https://www.youtube.com/results?search_query=Basics%20with%20Babish%20Knife%20Skills' },
      { kind: 'article', title: 'Knife Skills 101', provider: 'Serious Eats', url: 'https://www.google.com/search?q=Knife%20Skills%20101%20Serious%20Eats' }
    ],
    related: ['beekeeping-basics', 'budgeting-on-an-irregular-income', 'fix-a-running-toilet', 'gardening-for-beginners', 'home-electrical-safety', 'horseback-riding-for-beginners']
  };
  var LESSON = {
    id: '0-0', title: 'The Pinch Grip', number: 1, module: 'Foundation and Safety',
    next: { id: '0-1', title: "The 'Claw' Hand" },
    segments: [
      { type: 'intro', heading: 'Why Your Grip Matters', narration: 'Most beginners hold a knife like a hammer, with their hand entirely on the handle. While it feels natural, this actually gives you less control and causes your hand to tire quickly. Today, we are learning the professional standard: the pinch grip.', visual: { kind: 'image', src: 'img/lesson-grip.jpg', alt: 'A chef expertly slicing vegetables with a professional grip', caption: 'Control starts with how you hold the tool.' } },
      { type: 'concept', heading: 'The Anatomy of the Grip', narration: "The secret to the pinch grip is shifting your hand forward. Instead of just holding the handle, you will use your thumb and index finger to 'pinch' the blade itself, right where it meets the handle. This area is called the bolster.", visual: { kind: 'icon', name: 'target', label: 'Precision Point', caption: 'Focus your grip on the bolster for maximum stability.' } },
      { type: 'steps', heading: 'Three Steps to a Pro Grip', narration: "Let's break it down. First, pinch the blade between your thumb and the side of your index finger. Second, curl your remaining three fingers comfortably around the handle. Finally, relax your wrist to allow the knife to do the work.", visual: { kind: 'steps', items: ['Pinch the blade bolster with thumb and index finger.', 'Wrap the other three fingers around the handle.', "Keep a firm but relaxed hold; don't squeeze too hard."] } },
      { type: 'comparison', heading: 'Handle Grip vs. Pinch Grip', narration: 'When you hold only the handle, the blade can wobble left or right, leading to uneven cuts or slips. The pinch grip turns the knife into an extension of your arm, providing a pivot point that makes every slice more predictable.', visual: { kind: 'comparison', left: { label: 'Handle grip', text: 'Unstable, less leverage, higher fatigue.' }, right: { label: 'Pinch grip', text: 'Maximum control, better balance, safer cuts.' } } },
      { type: 'visual', heading: 'Safety in Stability', narration: 'Stability is the foundation of kitchen safety. By securing the blade at the bolster, you prevent the knife from rolling in your hand. This significantly reduces the risk of accidental nicks or deeper cuts during heavy-duty tasks like dicing carrots.', visual: { kind: 'emoji', emoji: '🛡️', caption: 'Stability equals safety.' } },
      { type: 'summary', heading: 'Ready to Slice', narration: 'Mastering this grip is the single biggest step you can take toward cooking like a professional. It might feel strange at first, but with practice, it will become second nature, making your prep work faster and much safer.', visual: { kind: 'callout', text: 'The knife should feel like an extension of your hand, not a separate tool.' } }
    ],
    quiz: [
      { question: 'Where should your thumb and index finger be placed in a proper pinch grip?', options: ["On the blade's bolster", 'At the very end of the handle', 'Directly on the sharp edge', 'Tucked into your palm'], correct: 0, explanation: 'Pinching the bolster provides the pivot point necessary for control and stability.' },
      { question: 'What is the primary disadvantage of holding the knife only by the handle?', options: ['The blade is more likely to wobble or roll', 'It makes the knife too sharp to handle', 'It causes the blade to rust faster', 'It requires using two hands to cut'], correct: 0, explanation: 'A handle-only grip lacks a secure connection to the blade, allowing it to twist during tough cuts.' },
      { question: 'How should your other three fingers (middle, ring, and pinky) behave during the pinch grip?', options: ['Wrap loosely around the handle', 'Point straight out for balance', 'Tuck behind your back for safety', 'Pinch the blade along with the thumb'], correct: 0, explanation: 'The bottom three fingers provide support by wrapping comfortably around the handle while the pinch does the steering.' }
    ],
    keyConcepts: [
      { term: 'Pinch grip', definition: 'Thumb and index finger pinch the blade at the bolster; the other three fingers wrap the handle.' },
      { term: 'Bolster', definition: 'The thick junction where the blade meets the handle, and the pivot point of a controlled grip.' },
      { term: 'Stability', definition: 'A blade that cannot roll in your hand is what prevents slips and uneven cuts.' }
    ]
  };
  var TYPE_LABEL = { intro: 'Intro', concept: 'Concept', steps: 'Steps', comparison: 'Compare', visual: 'Visual', summary: 'Summary', quiz: 'Quiz' };

  /* ---------------- starfield (same engine as the home page, band variant) ---------------- */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function starfield(canvas) {
    var ctx = canvas.getContext('2d');
    var cfg = { density: 6500, field: 1, fadeFrom: 0.62, fadeTo: 1.05, orbs: 6, seed: 11, drift: 0.6 };
    var W = 0, H = 0, stars = [], orbs = [], raf = 0, visible = true, last = 0;
    function seed() {
      var rnd = mulberry32(cfg.seed), n = Math.min(360, Math.round(W * H * cfg.field / cfg.density)), i, d;
      stars = [];
      for (i = 0; i < n; i++) { d = Math.pow(rnd(), 1.6); stars.push({ x: rnd() * W, y: rnd() * H, depth: d, r: .45 + d * 1.3, ph: rnd() * 6.283, sp: .5 + rnd() * 1.3, big: rnd() < .07, vy: (.6 + d * 1.6) * cfg.drift }); }
      orbs = [];
      for (i = 0; i < cfg.orbs; i++) orbs.push({ x: rnd() * W, y: rnd() * H, r: 2.5 + rnd() * 4.5, a: .06 + rnd() * .12, vy: -(2 + rnd() * 4), ph: rnd() * 6.283 });
    }
    function resize() {
      var r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width || !r.height) return;
      W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed(); draw(0, 0);
    }
    function fade(y) { var a = cfg.fadeFrom * H, b = cfg.fadeTo * H, t; if (y <= a) return 1; if (y >= b) return 0; t = (y - a) / (b - a); return 1 - t * t * (3 - 2 * t); }
    function draw(t, dt) {
      var i, o, s, f, a, g, x, y, tw, gr, L;
      ctx.clearRect(0, 0, W, H);
      for (i = 0; i < orbs.length; i++) {
        o = orbs[i];
        if (!reduceMotion) { o.y += o.vy * dt; if (o.y < -20) { o.y = H + 10; o.x = Math.random() * W; } }
        f = fade(o.y); if (f <= 0) continue;
        a = o.a * f * (.7 + .3 * Math.sin(t * .6 + o.ph)); x = o.x; y = o.y;
        g = ctx.createRadialGradient(x, y, 0, x, y, o.r * 3); g.addColorStop(0, 'rgba(190,215,255,' + a + ')'); g.addColorStop(1, 'rgba(190,215,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, o.r * 3, 0, 6.283); ctx.fill();
      }
      for (i = 0; i < stars.length; i++) {
        s = stars[i];
        if (!reduceMotion) { s.y += s.vy * dt; if (s.y > H + 4) { s.y = -4; s.x = Math.random() * W; } }
        f = fade(s.y); if (f <= 0) continue;
        tw = reduceMotion ? .85 : (.62 + .38 * Math.sin(t * s.sp + s.ph)); a = f * tw * (.35 + .65 * s.depth); x = s.x; y = s.y;
        if (s.big) {
          gr = s.r * 7; g = ctx.createRadialGradient(x, y, 0, x, y, gr);
          g.addColorStop(0, 'rgba(255,255,255,' + (.55 * a) + ')'); g.addColorStop(.3, 'rgba(200,222,255,' + (.18 * a) + ')'); g.addColorStop(1, 'rgba(200,222,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, gr, 0, 6.283); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,' + (.5 * a) + ')'; ctx.lineWidth = .8; L = s.r * 5 * (.8 + .4 * tw);
          ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,' + a + ')'; ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      }
    }
    function loop(now) {
      raf = 0; if (!visible || reduceMotion) return;
      var t = now / 1000, dt = last ? Math.min(.05, t - last) : 0; last = t; draw(t, dt); raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && visible && !reduceMotion) { last = 0; raf = requestAnimationFrame(loop); } }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(function () { resize(); }).observe(canvas); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting && !document.hidden; if (visible) start(); }, { threshold: 0 }).observe(canvas);
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) start(); });
    start();
  }
  $$('canvas.la-stars').forEach(starfield);

  /* ---------------- nav menu ---------------- */
  $$('.la-nav').forEach(function (nav) {
    var btn = $('.la-nav-menu', nav), panel = $('.la-menu-panel', nav);
    if (!btn || !panel) return;
    btn.addEventListener('click', function () { var open = panel.hidden; panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('click', function (e) { if (!panel.hidden && !nav.contains(e.target)) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
  });

  /* ---------------- shared renderers ---------------- */
  function sittings(n) { return Math.max(1, Math.ceil(n / 3)); }
  function courseCard(c, compact) {
    return '<a class="la-card" href="course.html" data-tag="' + c.tag + '" data-title="' + esc(c.title.toLowerCase()) + '">' +
      '<img class="la-card-img" src="' + c.img + '" alt="" loading="lazy">' +
      '<div class="la-card-body"><h3>' + esc(c.title) + '</h3>' + (compact ? '' : '<p>' + esc(c.description) + '</p>') +
      '<div class="la-card-meta"><span>' + ico('layers') + c.lessons + ' lessons</span><span>' + ico('clock') + sittings(c.lessons) + ' sittings</span><span class="la-level">' + c.level + '</span></div></div></a>';
  }
  // progress: { done: Set of "m-l", now: "m-l" | null }  access: 'public' shows the free/sign-in tags
  function syllabus(course, progress, opts) {
    opts = opts || {};
    var html = '', n = 0;
    course.modules.forEach(function (m, mi) {
      html += '<section class="la-mod"><div class="la-mod-head"><span class="la-mod-num">' + (mi + 1) + '</span><div><h3>' + esc(m.title) + '</h3><p>' + esc(m.description) + '</p><p class="la-mod-count">' + m.lessons.length + ' lessons</p></div></div><ol class="la-path">';
      m.lessons.forEach(function (l, li) {
        var id = mi + '-' + li; n++;
        var done = progress.done.has(id), now = progress.now === id;
        var nodeCls = done ? ' is-done' : now ? ' is-now' : '';
        var meta = '';
        if (done) meta = '<span class="la-lesson-m is-done">' + ico('check') + 'Done</span>';
        else if (now) meta = '<span class="la-lesson-m is-now">Up next</span>';
        else if (opts.access === 'public') meta = n === 1 ? '<span class="la-lesson-m is-free">Free · no sign-up</span>' : '<span class="la-lesson-m">Free · sign in</span>';
        html += '<li><a class="la-lesson' + (now ? ' is-now' : '') + '" href="' + (opts.href || 'lesson.html') + '"><span class="la-node' + nodeCls + '">' + (done ? ico('check') : '') + '</span>' +
          '<span class="la-lesson-t">' + esc(l.title) + '</span>' + (opts.short ? '' : '<span class="la-lesson-d">' + esc(l.description) + '</span>') + meta + '</a></li>';
      });
      html += '</ol></section>';
    });
    return html;
  }
  function mark(size, tone) {
    var ring = tone === 'light' ? 'rgba(255,255,255,.72)' : '#8DB6FF', planet = tone === 'light' ? '#fff' : '#0F62E6', id = 'mk' + Math.random().toString(36).slice(2, 7);
    return '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true"><defs><clipPath id="' + id + '"><rect x="-20" y="32" width="104" height="60"/></clipPath></defs><g transform="rotate(-18 32 32)"><ellipse cx="32" cy="32" rx="27" ry="8" fill="none" stroke="' + ring + '" stroke-width="3.2"/></g><circle cx="32" cy="32" r="15" fill="' + planet + '"/><g transform="rotate(-18 32 32)" clip-path="url(#' + id + ')"><ellipse cx="32" cy="32" rx="27" ry="8" fill="none" stroke="' + ring + '" stroke-width="3.2"/><circle cx="8.6" cy="36" r="3.2" fill="#F2A14F" stroke="#fff" stroke-width="1.2"/></g></svg>';
  }

  /* ---------------- library page ---------------- */
  function initLibrary() {
    var grid = $('#la-grid'); if (!grid) return;
    grid.innerHTML = LIBRARY.map(function (c) { return courseCard(c); }).join('');
    var filters = $('#la-filters');
    filters.innerHTML = TAGS.map(function (t) {
      var count = t.id === 'all' ? LIBRARY.length : LIBRARY.filter(function (c) { return c.tag === t.id; }).length;
      return '<button type="button" data-tag="' + t.id + '" aria-pressed="' + (t.id === 'all') + '">' + ico(t.icon) + esc(t.label) + ' <i>' + count + '</i></button>';
    }).join('');
    var mine = $('#la-mine');
    if (mine) mine.innerHTML = MINE.map(function (c) {
      var pct = Math.round(c.done / c.total * 100);
      var thumb = c.img ? '<img src="' + c.img + '" alt="">' : '<span class="la-thumb" aria-hidden="true">' + esc(c.title.charAt(0)) + '</span>';
      return '<a class="la-cont" href="course.html' + (c.done ? '?state=progress' : '') + '">' + thumb + '<div><h3>' + esc(c.title) + '</h3><p>' + (c.done ? c.done + ' of ' + c.total + ' lessons done · next: ' + esc(c.next) : 'Not started · ' + c.total + ' lessons') + '</p><div class="la-bar"><i style="width:' + pct + '%"></i></div></div></a>';
    }).join('');
    var input = $('#la-q'), box = $('.la-search'), clear = $('.la-search-clear'), count = $('.la-search-count'), empty = $('#la-empty');
    var tag = 'all';
    function apply() {
      var q = input.value.trim().toLowerCase(), shown = 0;
      $$('.la-card', grid).forEach(function (card) {
        var ok = (tag === 'all' || card.dataset.tag === tag) && (!q || card.dataset.title.indexOf(q) > -1);
        card.classList.toggle('is-hidden', !ok); if (ok) shown++;
      });
      box.classList.toggle('has-value', !!q);
      count.textContent = shown + ' courses';
      empty.classList.toggle('on', shown === 0);
      $('#la-grid-count').textContent = shown === LIBRARY.length ? LIBRARY.length + ' courses' : shown + ' of ' + LIBRARY.length + ' courses';
    }
    input.addEventListener('input', apply);
    clear.addEventListener('click', function () { input.value = ''; apply(); input.focus(); });
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      tag = b.dataset.tag; $$('button', filters).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); apply();
    });
    apply();
  }

  /* ---------------- course page ---------------- */
  function initCourse() {
    var root = $('#la-course'); if (!root) return;
    var inProgress = state === 'progress';
    var progress = { done: new Set(inProgress ? ['0-0', '0-1', '0-2'] : []), now: inProgress ? '1-0' : null };
    var doneCount = progress.done.size, pct = Math.round(doneCount / COURSE.lessonCount * 100);
    $('#la-syllabus').innerHTML = syllabus(COURSE, progress, { access: inProgress ? 'enrolled' : 'public' });
    // hero CTA + progress
    var cta = $('#la-cta'), ctaText = inProgress ? 'Continue · The Circular Motion' : 'Start the course';
    cta.innerHTML = esc(ctaText) + ico('arrow-right');
    var prog = $('#la-hero-progress');
    if (inProgress) { prog.hidden = false; $('.la-bar i', prog).style.width = pct + '%'; $('p', prog).textContent = doneCount + ' of ' + COURSE.lessonCount + ' lessons done · ' + pct + '%'; }
    $('#la-sticky-title').textContent = ctaText;
    $('#la-sticky-sub').textContent = inProgress ? doneCount + ' of ' + COURSE.lessonCount + ' lessons done' : COURSE.lessonCount + ' lessons · ' + COURSE.sittings;
    $('#la-crumb-last').textContent = COURSE.title;
    // related
    $('#la-related').innerHTML = COURSE.related.map(function (slug) { var c = LIBRARY.filter(function (x) { return x.slug === slug; })[0]; return c ? courseCard(c, true) : ''; }).join('');
    // resources
    var kindIcon = { book: 'book-open', youtube: 'youtube', article: 'file-text', course: 'graduation-cap', tool: 'compass' };
    $('#la-resources').innerHTML = COURSE.resources.map(function (r) {
      return '<li><a href="' + r.url + '" target="_blank" rel="noopener noreferrer"><span class="la-res-ico">' + ico(kindIcon[r.kind] || 'compass') + '</span><span><span class="la-res-t">' + esc(r.title) + '</span><br><span class="la-res-p">' + esc(r.provider) + '</span></span>' + ico('external-link', 'la-res-ext') + '</a></li>';
    }).join('');
    // sticky bar on phones once the hero CTA is out of view
    var bar = $('.la-stickybar');
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { bar.classList.toggle('on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }, { threshold: 0 }).observe(cta);
    $('#la-share').addEventListener('click', function () {
      var b = this, t = b.innerHTML; b.innerHTML = ico('check') + 'Link copied';
      try { navigator.clipboard && navigator.clipboard.writeText('https://learn-anything-public.site/library/' + COURSE.slug); } catch (e) { /* noop */ }
      setTimeout(function () { b.innerHTML = t; }, 1600);
    });
  }

  /* ---------------- lesson page ---------------- */
  function visualHTML(v) {
    switch (v.kind) {
      case 'image': return '<img src="' + v.src + '" alt="' + esc(v.alt || '') + '">';
      case 'icon': return '<div class="la-glow"></div><div class="la-v-icon"><span class="la-tile-ico">' + ico(v.name) + '</span>' + (v.label ? '<span class="la-v-label">' + esc(v.label) + '</span>' : '') + (v.caption ? '<span class="la-v-sub">' + esc(v.caption) + '</span>' : '') + '</div>';
      case 'emoji': return '<div class="la-glow"></div><div class="la-v-emoji"><span class="la-emoji" aria-hidden="true">' + v.emoji + '</span>' + (v.caption ? '<span class="la-v-sub">' + esc(v.caption) + '</span>' : '') + '</div>';
      case 'stat': return '<div class="la-glow"></div><div class="la-v-stat"><div class="la-v-num">' + esc(v.value) + '</div><div class="la-v-label">' + esc(v.label) + '</div>' + (v.sublabel ? '<div class="la-v-sub">' + esc(v.sublabel) + '</div>' : '') + '</div>';
      case 'callout': return '<blockquote class="la-v-callout">' + ico('quote', 'la-q') + '<p>' + esc(v.text) + '</p></blockquote>';
      case 'comparison': return '<div class="la-v-cmp"><div class="la-tile"><p class="la-eyebrow">' + esc(v.left.label) + '</p><p>' + esc(v.left.text) + '</p></div><div class="la-tile hi"><p class="la-eyebrow">' + esc(v.right.label) + '</p><p>' + esc(v.right.text) + '</p></div></div>';
      case 'steps': return '<ol class="la-v-steps">' + v.items.map(function (s, i) { return '<li><b>' + (i + 1) + '</b><span>' + esc(s) + '</span></li>'; }).join('') + '</ol>';
      case 'code': return '<div class="la-v-code">' + (v.caption ? '<div class="la-v-codebar">' + esc(v.caption) + '</div>' : '') + '<pre><code>' + v.code + '</code></pre></div>';
      case 'timeline': return '<ol class="la-v-tl">' + v.items.map(function (it) { return '<li><p class="la-eyebrow">' + esc(it.date) + '</p><p class="t">' + esc(it.title) + '</p>' + (it.description ? '<p class="d">' + esc(it.description) + '</p>' : '') + '</li>'; }).join('') + '</ol>';
      case 'chart': { var max = Math.max.apply(null, v.points.map(function (p) { return p.value; })); return '<figure class="la-v-chart">' + (v.title ? '<p class="t">' + esc(v.title) + '</p>' : '') + '<div class="la-bars">' + v.points.map(function (p) { return '<i style="height:' + Math.round(p.value / max * 100) + '%" title="' + esc(p.label + ': ' + p.value) + '"></i>'; }).join('') + '</div><div class="la-bars-x">' + v.points.map(function (p) { return '<span>' + esc(p.label) + '</span>'; }).join('') + '</div>' + (v.caption ? '<figcaption class="la-v-sub">' + esc(v.caption) + '</figcaption>' : '') + '</figure>'; }
      default: return '';
    }
  }
  function initLesson() {
    var shell = $('#la-lesson'); if (!shell) return;
    var segs = LESSON.segments, total = segs.length;
    var idx = 0, playing = false, revealed = 0, speed = 1, timer = null, tapped = false, phase = 'play';
    var qIdx = 0, qAnswered = false, score = 0;
    var el = {
      type: $('#la-type'), counter: $('#la-counter'), segs: $('#la-segs'), stage: $('#la-stage'), cap: $('#la-cap'), head: $('#la-lh'), nar: $('#la-nar'),
      play: $('#la-play'), prev: $('#la-prev'), next: $('#la-next'), player: $('.la-player'), main: $('.la-lmain'), col: $('#la-lcol'), speedCycle: $('#la-speed-cycle'),
      drawer: $('#la-drawer'), hint: $('#la-nar-hint')
    };
    el.segs.innerHTML = segs.map(function () { return '<span class="la-seg"><i></i></span>'; }).join('');
    $('#la-drawer-body').innerHTML = syllabus(COURSE, { done: new Set(), now: '0-0' }, { short: true, href: 'lesson.html' });
    var fills = $$('.la-seg i', el.segs), segEls = $$('.la-seg', el.segs);
    var words = [];

    function setFill(i, ratio) { fills[i].style.width = Math.round(ratio * 100) + '%'; }
    function renderSegment() {
      var s = segs[idx];
      words = s.narration.split(/\s+/).filter(Boolean); revealed = 0;
      el.type.innerHTML = ico('sparkles') + TYPE_LABEL[s.type];
      el.counter.textContent = (idx + 1) + ' of ' + total;
      el.stage.className = 'la-stage' + (s.visual.kind === 'image' ? ' is-img' : '');
      el.stage.innerHTML = visualHTML(s.visual) + (!tapped ? '<button type="button" class="la-tap" id="la-tap" aria-label="Play narration"><span class="la-tap-in"><span class="la-tap-btn">' + ico('play') + '</span><span class="la-tap-label">Tap to start narration</span></span></button>' : '');
      el.cap.textContent = s.visual.caption && s.visual.kind === 'image' ? s.visual.caption : '';
      el.cap.hidden = !el.cap.textContent;
      el.head.textContent = s.heading;
      el.nar.innerHTML = words.map(function (w) { return '<span class="is-dim">' + esc(w) + '</span>'; }).join(' ');
      segEls.forEach(function (sEl, i) { sEl.classList.toggle('is-done', i < idx); });
      setFill(idx, 0); for (var i = idx + 1; i < total; i++) setFill(i, 0);
      el.prev.disabled = idx === 0;
      el.next.innerHTML = (idx === total - 1 ? '<span>Finish</span>' : '<span>Next</span>') + ico('chevron-right');
      el.next.setAttribute('aria-label', idx === total - 1 ? 'Finish lesson' : 'Next segment');
      // restart the stage entrance
      el.main.scrollTop = 0;
      var tap = $('#la-tap'); if (tap) tap.addEventListener('click', function () { tapped = true; tap.remove(); setPlaying(true); });
      if (playing) startTimer();
    }
    function paint() {
      var spans = el.nar.children;
      for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('is-dim', i >= revealed);
      setFill(idx, words.length ? revealed / words.length : 1);
    }
    function startTimer() {
      stopTimer();
      var wps = 2.7 * speed;
      timer = setInterval(function () {
        if (revealed < words.length) { revealed++; paint(); }
        if (revealed >= words.length) { stopTimer(); setFill(idx, 1); setTimeout(function () { if (playing) goNext(); }, 650); }
      }, 1000 / wps);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    function setPlaying(on) {
      playing = on; el.play.classList.toggle('is-playing', on); el.play.setAttribute('aria-label', on ? 'Pause' : 'Play');
      if (on) { if (revealed >= words.length) { revealed = 0; paint(); } startTimer(); } else stopTimer();
    }
    function goNext() { if (idx < total - 1) { idx++; renderSegment(); } else showQuiz(); }
    function goPrev() { if (idx > 0) { idx--; renderSegment(); } }
    function setSpeed(s) { speed = s; $$('.la-speed button').forEach(function (b) { b.setAttribute('aria-pressed', String(parseFloat(b.dataset.speed) === s)); }); el.speedCycle.textContent = s + 'x'; if (playing) startTimer(); }

    /* quiz */
    function showQuiz() {
      stopTimer(); playing = false; phase = 'quiz'; qIdx = 0; qAnswered = false; score = 0;
      el.player.hidden = true; el.hint.hidden = true;
      segEls.forEach(function (sEl) { sEl.classList.add('is-done'); });
      el.type.innerHTML = ico('circle-check') + 'Quiz'; el.counter.textContent = 'Check your understanding';
      renderQuestion();
    }
    function renderQuestion() {
      var q = LESSON.quiz[qIdx];
      el.col.innerHTML = '<section class="la-qcard" aria-live="polite"><div class="la-qhead"><span>Question ' + (qIdx + 1) + ' of ' + LESSON.quiz.length + '</span><span class="la-qdots">' + LESSON.quiz.map(function (_, i) { return '<i class="' + (i < qIdx ? 'is-done' : i === qIdx ? 'is-now' : '') + '"></i>'; }).join('') + '</span></div>' +
        '<h2 class="la-q">' + esc(q.question) + '</h2><div class="la-opts" id="la-opts">' + q.options.map(function (o, i) { return '<button type="button" class="la-opt" data-i="' + i + '"><b>' + String.fromCharCode(65 + i) + '</b><span>' + esc(o) + '</span>' + ico('check') + '</button>'; }).join('') + '</div>' +
        '<div id="la-why"></div><div class="la-qactions"><button type="button" class="la-qask">' + '<span class="la-orb" aria-hidden="true"></span>Stuck? Ask the teacher</button><span id="la-qnext"></span></div></section>';
      $('#la-opts').addEventListener('click', function (e) {
        var b = e.target.closest('.la-opt'); if (!b || qAnswered) return;
        qAnswered = true; var i = +b.dataset.i, right = i === q.correct; if (right) score++;
        $$('.la-opt', this).forEach(function (o) { o.disabled = true; });
        this.classList.add('is-answered');
        $$('.la-opt', this)[q.correct].classList.add('is-correct');
        if (!right) b.classList.add('is-wrong');
        $('#la-why').innerHTML = '<div class="la-why' + (right ? ' is-good' : '') + '"><b>' + (right ? 'Correct.' : 'Not quite.') + '</b>' + esc(q.explanation) + '</div>';
        $('#la-qnext').innerHTML = '<button type="button" class="la-btn la-btn-ink la-btn-lg" id="la-qgo">' + (qIdx < LESSON.quiz.length - 1 ? 'Next question' : 'Finish lesson') + ico('arrow-right') + '</button>';
        $('#la-qgo').addEventListener('click', function () { if (qIdx < LESSON.quiz.length - 1) { qIdx++; qAnswered = false; renderQuestion(); } else showComplete(); });
        $('#la-qgo').focus();
      });
      el.main.scrollTop = 0;
    }
    function showComplete() {
      phase = 'done'; el.type.innerHTML = ico('check') + 'Complete'; el.counter.textContent = 'Lesson ' + LESSON.number + ' of ' + COURSE.lessonCount;
      el.col.innerHTML = '<section class="la-done-sky"><div class="la-sky" aria-hidden="true"><canvas class="la-stars"></canvas></div><div class="la-done-mark">' + mark(34, 'light') + '</div><h2 class="la-display">Lesson complete</h2><p class="la-sub">You got ' + score + ' of ' + LESSON.quiz.length + ' right. ' + esc(LESSON.title) + ' is done.</p>' +
        '<div class="la-done-prog"><div class="la-bar"><i style="--w:' + Math.round(LESSON.number / COURSE.lessonCount * 100) + '%"></i></div><p>' + LESSON.number + ' of ' + COURSE.lessonCount + ' lessons done</p></div>' +
        '<div class="la-cta-row"><a class="la-btn la-btn-white la-btn-lg" href="lesson.html">Next lesson: ' + esc(LESSON.next.title) + ico('arrow-right') + '</a><a class="la-btn la-btn-ghost la-btn-lg" href="course.html?state=progress">Back to course</a></div></section>' +
        '<section class="la-keys"><h3>Key ideas from this lesson</h3><dl>' + LESSON.keyConcepts.map(function (k) { return '<div><dt>' + esc(k.term) + '</dt><dd>' + esc(k.definition) + '</dd></div>'; }).join('') + '</dl></section>';
      $$('canvas.la-stars', el.col).forEach(starfield);
      el.main.scrollTop = 0;
    }
    /* visual kinds gallery (styleguide state) */
    function showKinds() {
      phase = 'kinds'; el.player.hidden = true; el.hint.hidden = true; el.type.innerHTML = ico('sparkles') + 'Visual kinds'; el.counter.textContent = 'All 10 segment visuals';
      var kinds = [
        ['image', { kind: 'image', src: 'img/lesson-grip.jpg', alt: '' }],
        ['icon', { kind: 'icon', name: 'target', label: 'Precision Point', caption: 'Focus your grip on the bolster for maximum stability.' }],
        ['emoji', { kind: 'emoji', emoji: '🛡️', caption: 'Stability equals safety.' }],
        ['stat', { kind: 'stat', value: '30 yrs', label: 'Most common U.S. mortgage term', sublabel: 'Fixed-rate loans' }],
        ['callout', { kind: 'callout', text: 'The knife should feel like an extension of your hand, not a separate tool.' }],
        ['comparison', { kind: 'comparison', left: { label: 'Handle grip', text: 'Unstable, less leverage, higher fatigue.' }, right: { label: 'Pinch grip', text: 'Maximum control, better balance, safer cuts.' } }],
        ['steps', { kind: 'steps', items: ['Pinch the blade bolster with thumb and index finger.', 'Wrap the other three fingers around the handle.', "Keep a firm but relaxed hold; don't squeeze too hard."] }],
        ['code', { kind: 'code', caption: 'monthly-payment.js', code: '<span class="c">// fixed-rate payment for a 30-year loan</span>\n<span class="k">const</span> rate = annualRate / <span class="s">12</span>;\n<span class="k">const</span> n = <span class="s">360</span>;\n<span class="k">const</span> payment = principal * rate / (<span class="s">1</span> - (<span class="s">1</span> + rate) ** -n);' }],
        ['chart', { kind: 'chart', title: 'Share of each payment that is interest', caption: 'Illustrative, 30-year fixed loan', points: [{ label: 'Year 1', value: 85 }, { label: 'Year 10', value: 62 }, { label: 'Year 20', value: 35 }, { label: 'Year 30', value: 5 }] }],
        ['timeline', { kind: 'timeline', items: [{ date: 'Week 1', title: 'Pre-approval', description: 'A lender checks income, debt and credit.' }, { date: 'Weeks 2–3', title: 'Offer accepted', description: 'The purchase contract starts the clock.' }, { date: 'Weeks 4–6', title: 'Underwriting and appraisal' }, { date: 'Closing day', title: 'Keys', description: 'Sign, fund, move in.' }] }]
      ];
      el.col.innerHTML = '<div class="la-kinds">' + kinds.map(function (k) { return '<section><h2>' + k[0] + '</h2><div class="la-stage' + (k[1].kind === 'image' ? ' is-img' : '') + '">' + visualHTML(k[1]) + '</div></section>'; }).join('') + '</div>';
    }

    /* controls */
    el.play.addEventListener('click', function () { if (!tapped) { tapped = true; var t = $('#la-tap'); if (t) t.remove(); } setPlaying(!playing); });
    el.prev.addEventListener('click', goPrev);
    el.next.addEventListener('click', goNext);
    el.nar.addEventListener('click', function () { revealed = words.length; paint(); });
    $$('.la-speed button').forEach(function (b) { b.addEventListener('click', function () { setSpeed(parseFloat(b.dataset.speed)); }); });
    el.speedCycle.addEventListener('click', function () { var opts = [1, 1.5, 2]; setSpeed(opts[(opts.indexOf(speed) + 1) % opts.length]); });
    window.addEventListener('keydown', function (e) {
      if (phase !== 'play' || e.target.matches('input,textarea,button')) return;
      if (e.code === 'Space') { e.preventDefault(); if (!tapped) { tapped = true; var t = $('#la-tap'); if (t) t.remove(); } setPlaying(!playing); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); goNext(); }
      else if (e.code === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    });
    /* drawer */
    function openDrawer(on) { el.drawer.hidden = !on; $('#la-lessons-btn').setAttribute('aria-expanded', String(on)); if (on) $('.la-dpanel .la-iconbtn', el.drawer).focus(); }
    $('#la-lessons-btn').addEventListener('click', function () { openDrawer(true); });
    $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(false); }); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.drawer.hidden) openDrawer(false); });
    /* ask the teacher: no voice session in the prototype */
    $$('[data-ask]').forEach(function (b) { b.addEventListener('click', function () { var o = $('#la-ask-toast'); o.hidden = false; clearTimeout(o._t); o._t = setTimeout(function () { o.hidden = true; }, 2600); }); });

    renderSegment();
    if (state === 'quiz') { idx = total - 1; renderSegment(); showQuiz(); }
    else if (state === 'done') { score = 3; showComplete(); el.player.hidden = true; segEls.forEach(function (s) { s.classList.add('is-done'); }); }
    else if (state === 'kinds') showKinds();
    else if (state === 'playing') { tapped = true; var t0 = $('#la-tap'); if (t0) t0.remove(); setPlaying(true); }
    else if (/^seg(\d)$/.test(state)) { idx = Math.min(total - 1, +RegExp.$1 - 1); tapped = true; renderSegment(); revealed = Math.ceil(words.length * 0.45); paint(); }
    if (params.get('drawer') === '1') openDrawer(true);
  }

  /* ---------------- loading page ---------------- */
  function initLoading() {
    var box = $('#la-loading'); if (!box) return;
    var steps = $$('.la-steps-l li', box), i = 0;
    steps[0].classList.add('is-now');
    if (reduceMotion) return;
    var id = setInterval(function () { steps[i].classList.remove('is-now'); steps[i].classList.add('is-done'); i++; if (i >= steps.length) { clearInterval(id); return; } steps[i].classList.add('is-now'); }, 2600);
    var tips = ['Teaching a topic out loud is the fastest way to learn it.', 'A five-minute recap tomorrow beats an hour of review next week.', 'Practice recalling, not just re-reading, locks knowledge in.', 'If you can’t explain it simply, you don’t understand it yet.'];
    var tip = $('.la-tip', box), ti = 0;
    setInterval(function () { ti = (ti + 1) % tips.length; tip.textContent = tips[ti]; }, 8000);
  }

  initLibrary(); initCourse(); initLesson(); initLoading();
  window.LA = { LIBRARY: LIBRARY, COURSE: COURSE, LESSON: LESSON, ico: ico, mark: mark };
})();
