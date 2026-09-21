import React, { useState } from 'react';
import { BrandingConfig } from '../types';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mic,
  MessageSquare,
  Award,
  Clock,
  Layers,
  FileText,
  Volume2,
  Flame,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  PenTool,
  Bookmark,
  Users,
  Compass,
  Smile,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  BookMarked,
  GraduationCap,
} from 'lucide-react';

interface CurriculumPageProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
}

type GradeKey = 'g1_2' | 'g3_4' | 'g5_6' | 'g7_8';
type PillarKey = 'overview' | 'spoken' | 'prose_poetry' | 'grammar' | 'vocabulary' | 'debate' | 'worksheets' | 'assessment';

export const CurriculumPage: React.FC<CurriculumPageProps> = ({ branding, onOpenDemoModal }) => {
  const [activeGrade, setActiveGrade] = useState<GradeKey>('g1_2');
  const [activePillar, setActivePillar] = useState<PillarKey>('overview');
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  const toggleAnswer = (key: string) => {
    setShowAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // COMPLETE CURRICULUM DATA FOR ALL 4 GRADE TIERS
  const curriculumData = {
    g1_2: {
      id: 'g1_2',
      badge: 'Grade 1 & 2 Combined',
      title: 'Foundational Communication & Story Explorers',
      ageRange: 'Ages 5–7 • Dual-Level Base & Stretch Framework',
      summary:
        'A picture-rich, oral-first language foundation designed for early learners. Built on a shared core where Grade 1 masters fundamental phonics, sight words, and oral prompts, while Grade 2 engages with stretch sentences, story sequencing, and self-expression.',
      highlights: [
        'Oral-First Pedagogy: Every concept is spoken and dramatized before writing',
        'Visual Anchor Cards & Picture Talk for natural vocabulary absorption',
        'Rhyme, Rhythm & Action Poetry to develop speech clarity and intonation',
        'Base + Stretch Progression ensuring no child is left behind while advancing fast learners',
      ],
      pillars: [
        {
          id: 'spoken',
          name: 'Spoken English & Expression',
          icon: Mic,
          color: 'from-amber-500 to-orange-500',
          baseG1: [
            'Polite greetings & essential etiquette (Good morning, please, thank you, excuse me)',
            'Clear self-introductions (Name, age, family, school) aloud in front of peers',
            'Naming family members, body parts, animals, and classroom objects',
            'Days of the week, months, colors, and numbers 1–20 spoken aloud',
            'Following multi-step oral instructions (e.g., "Stand up, open your book to page 4")',
            '1-minute Show-and-Tell with a favorite toy or drawing',
            'Classroom action rhymes and clapping chants',
          ],
          stretchG2: [
            'Speaking in complete sentences ("I am doing great, thank you!")',
            'Describing picture scenes in 2–3 coherent spoken sentences',
            'Audible opposites and antonym pairing (big/small, hot/cold, day/night)',
            'Interactive role-plays (Shopkeeper & Customer, Doctor & Patient, Teacher & Pupil)',
            'Asking polite questions to classmates and listening attentively to replies',
            '2-minute Show-and-Tell using 3 descriptive adjectives',
            'Expressive solo rhyme recitation with voice modulation and confidence',
          ],
        },
        {
          id: 'prose_poetry',
          name: 'Prose & Poetry',
          icon: BookOpen,
          color: 'from-rose-500 to-pink-500',
          baseG1: [
            'Short illustrated 4–6 line fables (animals, family, festivals, community helpers)',
            'Teacher-guided read-aloud pointing word-by-word with phonics cues',
            'Left-to-right reading coordination and matching sentences to pictures',
            'Simple Wh- comprehension (Who was in the story? What did they do?)',
            'Yes/No sentence validation exercises',
            'Reciting action rhymes with rhythm, clapping, and gestures (e.g., "Rain, Rain, Go Away")',
          ],
          stretchG2: [
            '8–12 line moral stories (The Thirsty Crow, The Lion & the Mouse, The Hare & the Tortoise)',
            'Independent silent reading followed by fluent read-aloud',
            '5W1H comprehension questions (Who, What, Where, When, Why)',
            'Story sequencing challenges (Ordering events: First, Next, Then, Last)',
            'Character identification and summarizing the moral in one sentence',
            'Expressive poetry recitation (2–3 stanzas) and identifying rhyming pairs (e.g., "Twinkle, Twinkle")',
          ],
        },
        {
          id: 'grammar',
          name: 'Grammar & Sentence Construction',
          icon: Layers,
          color: 'from-blue-500 to-indigo-500',
          baseG1: [
            'Naming words (Nouns) — People, places, animals, and everyday objects',
            'Action words (Verbs) — run, eat, sleep, jump, sing, read',
            'One and Many — Singular & plural formation using basic -s',
            'Capital letters at sentence start and full stops (.) at sentence end',
            'Articles — Understanding "a" vs "an" before vowel and consonant sounds',
            'Joining two everyday words using "and" (e.g., cup and saucer)',
          ],
          stretchG2: [
            'Distinguishing Common vs Proper Naming Words (boy / Ramu, city / Delhi)',
            'Describing words (Adjectives) — colors, sizes, qualities (big, red, tall, sweet)',
            'Pronouns — he, she, it, they, we in place of repeating nouns',
            'Punctuation masterclass — Capital letters, full stops, and question marks (?)',
            'Definite & indefinite articles — a, an, and the in simple contexts',
            'Simple Present Tense forms (I play / She plays; is, am, are)',
            'Prepositions of place — in, on, under, near',
            'Unscrambling jumbled words into correct meaningful sentences',
          ],
        },
        {
          id: 'vocabulary',
          name: 'Vocabulary & Word Power',
          icon: Sparkles,
          color: 'from-emerald-500 to-teal-500',
          baseG1: [
            '40–50 Core Sight Words recognition (sun, cat, bus, tree, fish, home)',
            'Thematic word banks — Animals, Fruits, Vehicles, School essentials, Colors',
            'Beginning phonetic sounds (A to Z) with picture association',
            'Everyday opposites — big/small, in/out, up/down, hot/cold',
            'Tracing and copying new vocabulary words with correct handwriting spacing',
          ],
          stretchG2: [
            '5–6 new story-derived words weekly with simple contextual definitions',
            'Constructing original sentences using newly introduced vocabulary',
            'Plural suffixes with -s and -es (bus/buses, box/boxes)',
            'Word Families & Phonics patterns (-at, -an, -ig, -op: cat, bat, mat, hat)',
            'Compound word creation (sun + flower = sunflower, rain + bow = rainbow)',
            'Introduction to basic homophones (sun/son, see/sea)',
            'Building a personal illustrated Picture Dictionary across the academic year',
          ],
        },
      ],
      methodology: [
        {
          title: 'Same Lesson, Two Levels',
          desc: 'Grade 1 and Grade 2 explore the same core topic simultaneously; Grade 1 masters the oral foundation while Grade 2 undertakes the stretch analytical task.',
        },
        {
          title: 'Oral-First, Writing Follows',
          desc: 'Every language concept is verbalized in class first. Grade 1 answers in single words or phrases; Grade 2 formulates full articulate sentences.',
        },
        {
          title: 'Visuals for Everything',
          desc: 'Children associate language directly with vivid illustrations, emoji cues, and real-world objects rather than abstract dry grammatical rules.',
        },
      ],
      worksheets: [
        {
          id: 'ws1_g1_2_spoken',
          title: 'Worksheet 1: Spoken English (Greetings & Picture Talk)',
          subtitle: 'Grade 1 & 2 Combined • Polite Expressions & Object Recognition',
          questions: [
            {
              q: 'A. Say these polite words aloud with your teacher, then write them neatly:',
              sub: ['Good morning', 'Please', 'Thank you', 'Sorry', 'Excuse me'],
              ans: 'Practiced aloud with correct pronunciation and polite intonation.',
            },
            {
              q: 'B. Look at each picture clue (☀️ Sun, 🐱 Cat, 🚌 Bus, 🌳 Tree, 🐟 Fish, 📖 Book, ⚽ Ball, 🏠 House). Say the name aloud and write the spelling:',
              ans: 'Sun, Cat, Bus, Tree, Fish, Book, Ball, House.',
            },
            {
              q: 'C. Full Sentence Speaking: Answer aloud — "How are you today?"',
              ans: 'Sample: "I am feeling happy and energetic today!" or "I am doing great, thank you!"',
            },
          ],
        },
        {
          id: 'ws2_g1_2_prose',
          title: 'Worksheet 2: Prose Comprehension (The Thirsty Crow)',
          subtitle: 'Grade 1 & 2 Combined • Story Reading, 5W1H & Sequencing',
          story:
            'It was a hot summer day. A crow was very thirsty. He flew here and there looking for water. At last, he saw a pot with a little water at the bottom. The crow could not reach it with his beak. He saw some pebbles nearby. He picked up the pebbles one by one and dropped them into the pot. Slowly, the water rose up. The crow drank the water happily and flew away.',
          questions: [
            {
              q: '1. Who was thirsty and flew here and there looking for water?',
              ans: 'A thirsty crow was looking for water on a hot summer day.',
            },
            {
              q: '2. What was inside the pot and why was the crow unable to drink at first?',
              ans: 'There was a little water at the bottom of the pot, and the crow’s beak could not reach it.',
            },
            {
              q: '3. How did the crow make the water rise up?',
              ans: 'The clever crow picked up pebbles one by one and dropped them into the pot until the water rose.',
            },
            {
              q: '4. True or False: The pot was completely full of water from the start.',
              ans: 'False. The pot only had a little water at the bottom.',
            },
            {
              q: '5. Key Vocabulary Meanings: thirsty, pebbles, beak',
              ans: 'Thirsty: needing water to drink; Pebbles: small smooth stones; Beak: the hard pointed mouth of a bird.',
            },
          ],
        },
        {
          id: 'ws3_g1_2_grammar',
          title: 'Worksheet 3: Grammar (Naming Words & Articles)',
          subtitle: 'Grade 1 & 2 Combined • Nouns, "a" vs "an", and Describing Words',
          questions: [
            {
              q: 'A. Underline the naming word (Noun) in each sentence:',
              sub: [
                '1. The dog is barking.',
                '2. Riya is reading a book.',
                '3. The sun is very bright.',
                '4. My mother cooks food.',
                '5. A bird sits on the tree.',
              ],
              ans: '1. dog, 2. Riya / book, 3. sun, 4. mother / food, 5. bird / tree.',
            },
            {
              q: 'B. Fill in the blanks with "a" or "an":',
              sub: [
                '1. I saw _____ elephant at the zoo.',
                '2. She has _____ pencil box.',
                '3. He ate _____ apple.',
                '4. It is _____ umbrella.',
                '5. There is _____ star in the sky.',
              ],
              ans: '1. an, 2. a, 3. an, 4. an, 5. a.',
            },
          ],
        },
      ],
    },

    g3_4: {
      id: 'g3_4',
      badge: 'Grade 3 & 4 Combined',
      title: 'English Wonderland: Expression & Story Explorers',
      ageRange: 'Ages 7–9 • Conversational Spoken English, Prose Fables & Sentence Building',
      summary:
        'A vibrant, theme-driven curriculum designed to transition young students from word-by-word speech to expressive storytelling, conversational etiquette, poetic recitation, and solid grammatical sentence structure.',
      highlights: [
        'Interactive Spoken Scenarios: Daily routines, shop conversations, phone etiquette, and 1-minute extempore',
        'Moral Fables & Global Tales: The Clever Tortoise & The Honest Woodcutter with inferential reasoning',
        'Poetry in Action: Rhyme schemes, alliteration drills, sensory imagery, and 4-line original stanza writing',
        'Grammar Precision: Mastering tenses, prepositions, conjunctions, and subject-verb agreement',
      ],
      pillars: [
        {
          id: 'spoken',
          name: 'Spoken English & Communication',
          icon: Mic,
          color: 'from-sky-500 to-blue-500',
          baseG1: [
            'Conversational warm-ups: Self & family introductions with eye contact',
            'Describing daily routines step-by-step (Morning, School, Play, Night)',
            'Asking for and giving simple directions politely (Turn left, go straight)',
            'Shop dialogue simulations: Inquiring prices, ordering items, saying please/thank you',
            'Picture talk: Narrating action cues from illustrated scenes in 3–4 sentences',
          ],
          stretchG2: [
            '1-minute structured public speaking on familiar topics (My Favorite Season, My Pet)',
            'Junior Mini-Debates: Books vs Television, Indoor vs Outdoor games',
            'Telephone manners & etiquette: Greeting, taking a message, ending conversations politely',
            'Detailed picture narration with sensory descriptors (colors, weather, emotions)',
            'Spontaneous role-play dialogues (Doctor & Patient, Airport Check-in, Classroom Monitor)',
          ],
        },
        {
          id: 'prose_poetry',
          name: 'Prose & Poetry Appreciation',
          icon: BookOpen,
          color: 'from-coral-500 to-rose-500',
          baseG1: [
            'Engaging moral fables: "The Clever Tortoise" (Slow & steady wins the race)',
            'Wh- questions, identifying key characters, and locating main story morals',
            'Nature verse: "Rain, Rain" (Pitter patter, pitter patter, rain is falling...)',
            'Identifying rhyming word pairs and reciting with rhythmic hand claps',
            'Composing 2-line original rhyming couplets about the sun or wind',
          ],
          stretchG2: [
            'Value-driven narratives: "The Honest Woodcutter" (Golden, Silver & Iron axes)',
            'Inferential questioning: Why did characters behave that way? What would you do?',
            'Event sequencing: Chronologically ordering 4 key narrative milestones',
            'Reflective nature poems: "The Friendly Tree" with rhythm and stanza cadence',
            'Exploring poetic devices: Alliteration (gentle ways), sensory imagery, and writing 4-line stanzas',
          ],
        },
        {
          id: 'grammar',
          name: 'Grammar & Syntax Mastery',
          icon: Layers,
          color: 'from-emerald-500 to-green-600',
          baseG1: [
            'Nouns: Common vs Proper nouns, identifying nouns in live speech',
            'Personal Pronouns: he, she, it, they, we replacing repetitive subjects',
            'Describing words (Adjectives) and spotting adjectives in sentences',
            'Action verbs (swimming, painting, baking) and verb identification',
            'Sentence punctuation: Full stops (.), Question marks (?), Exclamation marks (!)',
          ],
          stretchG2: [
            'Tense Mastery: Simple Present, Past, and Future (played, plays, will play)',
            'Prepositions of place and relationship: in, on, under, between, behind',
            'Conjunctions: Joining thoughts logically using "and", "but", "because"',
            'Sentence Classification: Statements, Questions, Commands, and Exclamations',
            'Subject-Verb Agreement: Matching singular/plural subjects with correct auxiliary verbs (is/are, was/were)',
          ],
        },
        {
          id: 'vocabulary',
          name: 'Vocabulary Expansion & Word Building',
          icon: Sparkles,
          color: 'from-amber-500 to-yellow-500',
          baseG1: [
            'Antonym pairings: hot/cold, happy/sad, up/down, fast/slow',
            'Synonym discovery: big → huge, happy → joyful, fast → quick',
            'Phonetic rhyming families: -at, -in, -og, -un word chains',
            'Visual picture-word recognition across nature, transport, and occupations',
          ],
          stretchG2: [
            'Compound word synthesis: sun + flower = sunflower, note + book = notebook',
            'Homophone clarity: hear vs here, write vs right, see vs sea',
            'Collective nouns for groups: A swarm of bees, a pack of wolves, a flock of birds',
            'Prefixes & Suffixes: un- (unhappy, unkind), -ful (careful, joyful), -less (careless)',
          ],
        },
      ],
      methodology: [
        {
          title: 'Storytelling Centered',
          desc: 'Children learn language best through characters, dilemmas, and morals that spark imagination and classroom discussions.',
        },
        {
          title: 'Expressive Voice Drills',
          desc: 'Focus on rhythm, pace, inflection, and eliminating shy monotone whispers in daily read-alouds.',
        },
        {
          title: 'Integrated Word Games',
          desc: 'Vocabulary is reinforced through word searches, synonym relays, and spontaneous descriptive challenges.',
        },
      ],
      worksheets: [
        {
          id: 'ws1_g3_4_prose',
          title: 'Worksheet 1: Prose Comprehension (The Clever Tortoise)',
          subtitle: 'Grade 3 Focus • Character Analysis, Morals & Wh- Questions',
          story:
            'A little tortoise named Toto lived near a pond. One day, a rabbit laughed at him and said, "You are so slow!" Toto smiled and said, "Slow and steady, but I never give up." The rabbit challenged him to a race. Toto agreed happily. The race began. The rabbit ran far ahead and felt sure he would win, so he lay down under a tree for a nap. Toto kept walking, slowly but surely, without stopping. When the rabbit woke up, Toto had already crossed the finish line! Everyone cheered for the tortoise. The rabbit learnt an important lesson that day.',
          questions: [
            {
              q: '1. Who are the two characters in the story?',
              ans: 'Toto the tortoise and the boastful rabbit.',
            },
            {
              q: '2. Why did the rabbit lose the race despite being much faster?',
              ans: 'The rabbit was overconfident, stopped to take a nap under a tree, while Toto walked continuously without stopping.',
            },
            {
              q: '3. What important life lesson does this story teach us?',
              ans: 'Slow and steady wins the race; persistence and determination overcome boasting.',
            },
          ],
        },
        {
          id: 'ws2_g3_4_grammar',
          title: 'Worksheet 2: Grammar (Tenses, Prepositions & Conjunctions)',
          subtitle: 'Grade 4 Focus • Verb Forms, Spatial Prepositions & Sentence Joining',
          questions: [
            {
              q: 'A. Change the verb to the correct tense:',
              sub: [
                '1. Yesterday, I ________ (play / played) football in the rain.',
                '2. Tomorrow, our class ________ (will visit / visited) the science museum.',
                '3. Every morning, she ________ (drink / drinks) a warm glass of milk.',
              ],
              ans: '1. played, 2. will visit, 3. drinks.',
            },
            {
              q: 'B. Join each pair of sentences using "and", "but", or "because":',
              sub: [
                '1. I was tired. I finished all my homework.',
                '2. He is small. He is very strong and fast.',
                '3. We stayed indoors. It was pouring with rain.',
              ],
              ans: '1. I was tired, but I finished all my homework. 2. He is small, but he is very strong and fast. 3. We stayed indoors because it was pouring with rain.',
            },
          ],
        },
      ],
    },

    g5_6: {
      id: 'g5_6',
      badge: 'Grade 5 & 6 Curriculum',
      title: 'Intermediate Fluency & 4-Pillar Mastery',
      ageRange: 'Ages 9–11 • Accurate Grammar, Literary Appreciation & 1-Minute JAM',
      summary:
        'A comprehensive English curriculum that connects 4 interdependent pillars: Strong Grammar provides structural accuracy, Prose & Poetry builds empathy and expression, Rich Vocabulary unlocks precise articulation, and Regular Spoken Drills turn knowledge into confident everyday communication.',
      highlights: [
        'The 4 Connected Pillars: Grammar, Literature, Vocabulary Banks, Spoken English',
        'Term-Wise Progression Map: Covering Tenses, Voice, Reported Speech, and Clauses block by block',
        'Thematic Monthly Word Banks: Weather & Nature, Feelings, Places & Travel, Tech & School',
        'Signature Classroom Drills: 1-Minute JAM (Just-A-Minute), Pronunciation v/w & s/sh pairs, and Tongue Twisters',
      ],
      pillars: [
        {
          id: 'grammar',
          name: 'Grammar Syllabus (Building Correct Sentences)',
          icon: Layers,
          color: 'from-blue-600 to-indigo-600',
          baseG1: [
            'Grade 5: Nouns (Common, Proper, Collective, Gender, Number)',
            'Grade 5: Pronouns (Personal, Possessive, Reflexive)',
            'Grade 5: Adjectives & Degrees of Comparison (Positive, Comparative, Superlative)',
            'Grade 5: Verbs & Simple Tenses (Present, Past, Future)',
            'Grade 5: Adverbs of manner, time, and place',
            'Grade 5: Prepositions of place, time, and movement',
            'Grade 5: Conjunctions (and, but, or, because, so)',
            'Grade 5: Articles (a, an, the) & Punctuation with kinds of sentences',
          ],
          stretchG2: [
            'Grade 6: Tenses (Simple, Continuous & Introduction to Perfect Tenses)',
            'Grade 6: Modal Auxiliaries (can, could, may, might, must, should)',
            'Grade 6: Prepositions & Subordinating Conjunctions',
            'Grade 6: Active & Passive Voice in simple sentences',
            'Grade 6: Direct & Indirect (Reported) Speech for statements',
            'Grade 6: Main & Subordinate Clauses (Introductory analysis)',
            'Grade 6: Sentence Transformation (Simple ↔ Compound)',
            'Grade 6: Question Tags and deep punctuation mastery',
          ],
        },
        {
          id: 'prose_poetry',
          name: 'Prose & Poetry (Reading & Reciting with Feeling)',
          icon: BookOpen,
          color: 'from-rose-500 to-purple-600',
          baseG1: [
            'Grade 5 Reading List: Jungle-themed animal adventure stories, moral folk tales',
            'Grade 5 Poetry List: Nature verse (rivers, brooks), rhyming poems on animals/seasons',
            'Comprehension: Wh- extraction, identifying central morals, event sequencing, simple inference',
            'Expression: Read-aloud with appropriate pacing, rhythm recitation with expressive gestures',
            'Follow-up Writing: 3–4 line character sketches, alternate endings, writing rhyming stanzas',
          ],
          stretchG2: [
            'Grade 6 Reading List: Classic adventure extracts, humorous stories with clever twists',
            'Grade 6 Poetry List: Poems on journeys/machines, rhythmic character poems',
            'Literary Appreciation: Analyzing motives, inferential cause-and-effect questioning',
            'Dramatization: Role-playing key story scenes and retelling narratives in own words',
            'Values Discussion: "What lesson does the story teach? What would you have done differently?"',
          ],
        },
        {
          id: 'vocabulary',
          name: 'Vocabulary Building (Thematic Word Banks)',
          icon: Sparkles,
          color: 'from-amber-500 to-orange-500',
          baseG1: [
            'Grade 5 Focus: Synonyms & Antonyms for everyday words, Homophones (their/there, to/too/two)',
            'Grade 5 Affixes: Basic prefixes & suffixes (un-, re-, -ful, -less)',
            'Theme 1 (Nature): breeze, drizzle, shade, bloom',
            'Theme 2 (Feelings): joyful, nervous, proud, gloomy',
            'Theme 3 (Travel): market, harbour, village, cottage',
            'Theme 4 (Technology): screen, keyboard, device, message',
          ],
          stretchG2: [
            'Grade 6 Focus: Advanced Synonyms & Antonyms, One-Word Substitution, Advanced Affixes',
            'Grade 6 Idioms: Common idiomatic expressions and figurative language in context',
            'Theme 1 (Nature): humid, drought, gust, horizon',
            'Theme 2 (Feelings): anxious, delighted, reluctant, confident',
            'Theme 3 (Travel): terrain, landmark, itinerary, destination',
            'Theme 4 (Technology): network, application, gadget, database',
          ],
        },
        {
          id: 'spoken',
          name: 'Spoken English (From Correctness to Fluency)',
          icon: Mic,
          color: 'from-teal-500 to-emerald-600',
          baseG1: [
            'Listening: Sound & stress practice, listening to short audio stories and answering questions',
            'Pronunciation: Correct stress on common words, tricky pairs (v/w, s/sh), tongue twisters',
            'Daily Conversations: Shop, school, and household dialogues; asking questions politely',
            'Performance: Show & Tell (object/pet/place), role-play short scenes, picture narration',
            'Public Speaking: Self-introductions in front of class, Beginner 1-minute JAM rounds',
          ],
          stretchG2: [
            '5-Day Weekly Routine: Mon (Listening & Vocab) → Tue (Pronunciation Drill) → Wed (Show & Tell) → Thu (Role-play Dialogues) → Fri (JAM & Weekly Recap)',
            'Storytelling: Retelling familiar stories in own words, narrating "My Weekend" or "My Day"',
            'Picture Story Sequencing: Narrating multi-frame visual scenarios with transitional words',
          ],
        },
      ],
      methodology: [
        {
          title: 'Every Rule Taught Through Examples',
          desc: 'Grammar rules are introduced with visual scenarios or everyday sentences before writing formal definitions.',
        },
        {
          title: 'Oral Practice Before Writing',
          desc: 'Students say the correct sentence aloud ("Say it right") before writing worksheets.',
        },
        {
          title: 'Continuous Error Recycling',
          desc: 'Common classroom speech slips are compiled and revised through lighthearted weekly oral quizzes.',
        },
      ],
      worksheets: [
        {
          id: 'ws1_g5_grammar',
          title: 'Worksheet 1: Grammar (Grade 5)',
          subtitle: 'Tenses • Nouns & Pronouns • Degrees of Comparison',
          questions: [
            {
              q: 'A. Fill in the blanks with the correct form of the verb (tense):',
              sub: [
                '1. Riya ________ (play) in the garden every evening.',
                '2. Yesterday, we ________ (visit) our grandmother.',
                '3. They ________ (go) to the fair tomorrow.',
                '4. The baby ________ (sleep) right now.',
              ],
              ans: '1. plays, 2. visited, 3. will go, 4. is sleeping.',
            },
            {
              q: 'B. Underline the noun and circle the pronoun in each sentence:',
              sub: [
                '1. Meena gave her book to Farhan.',
                '2. The dog wagged its tail happily.',
                '3. We saw a rainbow after the rain.',
              ],
              ans: '1. Noun: book / Farhan; Pronoun: her. 2. Noun: dog / tail; Pronoun: its. 3. Noun: rainbow / rain; Pronoun: We.',
            },
            {
              q: 'C. Choose the correct degree of adjective:',
              sub: [
                '1. This mango is ________ than that one. (sweet / sweeter / sweetest)',
                '2. Ravi is the ________ boy in the class. (tall / taller / tallest)',
                '3. My bag is ________ than yours. (heavy / heavier / heaviest)',
              ],
              ans: '1. sweeter, 2. tallest, 3. heavier.',
            },
          ],
        },
        {
          id: 'ws2_g6_grammar',
          title: 'Worksheet 2: Grammar (Grade 6)',
          subtitle: 'Active & Passive Voice • Reported Speech • Prepositions & Conjunctions',
          questions: [
            {
              q: 'A. Change the following into Passive Voice:',
              sub: [
                '1. The gardener waters the plants. →',
                '2. Riya wrote a letter. →',
                '3. The teacher will explain the lesson. →',
              ],
              ans: '1. The plants are watered by the gardener. 2. A letter was written by Riya. 3. The lesson will be explained by the teacher.',
            },
            {
              q: 'B. Change into Indirect (Reported) Speech:',
              sub: [
                '1. He said, "I am going to the market." →',
                '2. She said, "I have finished my homework." →',
              ],
              ans: '1. He said that he was going to the market. 2. She said that she had finished her homework.',
            },
            {
              q: 'C. Fill in the blanks with suitable prepositions (in, on, under, between, at):',
              sub: [
                '1. The keys are ________ the table.',
                '2. My birthday is ________ March.',
                '3. The cat is hiding ________ the bed.',
                '4. Sit ________ Aman and Zoya.',
              ],
              ans: '1. on, 2. in, 3. under, 4. between.',
            },
          ],
        },
        {
          id: 'ws3_g5_6_comprehension',
          title: 'Worksheet 3: Reading Comprehension & Poetry Analysis',
          subtitle: 'Story Passage & Nature Stanza with Wh- Questions',
          story:
            'Little Amara loved the old banyan tree behind her house. Every afternoon, she would climb its lowest branch and watch the sparrows build their nest. One day, she noticed a baby sparrow had fallen to the ground. Gently, she picked it up and placed it back in the nest. From that day, the sparrows would sing loudly whenever Amara sat under the tree, as if they were thanking her for her kindness.\n\nPoem Stanza:\nThe little seed lay still and small,\nBeneath the earth, it heard the call.\nIt drank the rain, it felt the sun,\nAnd grew and grew till day was done.',
          questions: [
            {
              q: '1. Where did Amara like to sit every afternoon, and what did she watch?',
              ans: 'Amara liked to sit on the lowest branch of the old banyan tree to watch the sparrows build their nest.',
            },
            {
              q: '2. What did Amara do when she found the fallen baby sparrow?',
              ans: 'She gently picked it up and carefully placed it back into its nest.',
            },
            {
              q: '3. What moral lesson do we learn from Amara’s actions?',
              ans: 'Kindness and compassion toward small living creatures is always appreciated and rewarded.',
            },
            {
              q: '4. From the poem: What two things did the seed drink and feel, and find a rhyming pair?',
              ans: 'The seed drank the rain and felt the sun. Rhyming pairs: small/call, sun/done.',
            },
          ],
        },
      ],
    },

    g7_8: {
      id: 'g7_8',
      badge: 'Grade 7 & 8 Curriculum',
      title: 'Advanced Spoken English, Debate & Rhetoric',
      ageRange: 'Ages 12–14 • Command of Language, Parliamentary Debate & Critical Literary Analysis',
      summary:
        'A high-order curriculum moving students from grammatical correctness to rhetorical command. Grammar becomes analytical (clauses, subjunctive mood, voice transformation), literature advances to literary appreciation and poetic devices, vocabulary grows through etymological root words, and spoken English culminates in formal debates and public speeches.',
      highlights: [
        '5 High-Order Pillars: Advanced Grammar, Literary Appreciation, Root-Word Etymology, Spoken Fluency, Formal Debate',
        'Oxford & Parliamentary Debate Formats: Motion, Opening Arguments, 1-Minute Rebuttals, and Conclusions',
        'Rhetorical Devices & Figures of Speech: Simile, Metaphor, Personification, Alliteration, and Onomatopoeia',
        'Academic & Public Discourse: Extempore under 1-minute prep, Group Discussions, and Speech Outline mastery',
      ],
      pillars: [
        {
          id: 'grammar',
          name: 'Advanced Grammar & Syntax Precision',
          icon: Layers,
          color: 'from-indigo-600 to-purple-700',
          baseG1: [
            'Grade 7: Comprehensive Tenses review + Present/Past/Future Perfect Continuous',
            'Grade 7: Clauses analysis — Noun Clauses, Adjective (Relative) Clauses, Adverb Clauses',
            'Grade 7: Active & Passive Voice transformation across all tenses',
            'Grade 7: Reported Speech — Statements, Wh- Questions, and Yes/No Questions with if/whether',
            'Grade 7: Determiners & Quantifiers (much/many, each/every, few/little)',
            'Grade 7: Degrees of Comparison — Advanced usage and sentence transformation',
            'Grade 7: Error Correction, editing exercises, and synthesis (Simple, Compound, Complex)',
          ],
          stretchG2: [
            'Grade 8: Reported Speech in all forms — Statements, Questions, Commands, and Exclamations',
            'Grade 8: Subordinate Clauses in depth with functional analysis in complex sentences',
            'Grade 8: Passive Voice with Modal Auxiliaries and in Interrogative sentences',
            'Grade 8: Conditional Sentences (Type 1 Probable, Type 2 Hypothetical, Type 3 Impossible/Past)',
            'Grade 8: Subjunctive Mood ("If I were you, I would...")',
            'Grade 8: Modal verbs for deduction and possibility (must, might, can’t)',
            'Grade 8: Advanced sentence synthesis and formal editing/proofreading protocols',
          ],
        },
        {
          id: 'prose_poetry',
          name: 'Prose, Poetry & Literary Appreciation',
          icon: BookOpen,
          color: 'from-purple-600 to-pink-600',
          baseG1: [
            'Grade 7 Reading List: Coming-of-age extracts, humorous short stories with unexpected twists',
            'Grade 7 Poetry List: Descriptive nature verse, narrative poems telling stories in verse',
            'Literary Comprehension: Analyzing central themes, character motivations, and internal/external conflict',
            'Figures of Speech: Identifying and explaining Simile, Metaphor, Personification, Alliteration, Onomatopoeia',
            'Creative Writing: Authoring alternate endings, missing scenes, and character diary entries',
          ],
          stretchG2: [
            'Grade 8 Reading List: Classic novel excerpts exploring social issues, historical/biographical memoirs',
            'Grade 8 Poetry & Drama: Reflective poems, patriotic or philosophical verse, drama script reading in parts',
            'Critical Analysis: Evaluating author tone, mood, rhythm, and underlying social messaging',
            'Dramatic Expression: Character voice acting, poem recitations with intentional pauses and emotional cadence',
          ],
        },
        {
          id: 'vocabulary',
          name: 'Vocabulary, Etymology & Register',
          icon: Sparkles,
          color: 'from-amber-500 to-rose-500',
          baseG1: [
            'Grade 7: Latin & Greek Root Words and families (-spect: look, -port: carry, -dict: speak, -struct: build)',
            'Grade 7 Affixes: Advanced prefixes & suffixes (inter-, mis-, sub-, -tion, -able, -logy)',
            'Grade 7 Context: Understanding nuanced connotations (thrifty vs stingy, proud vs arrogant)',
            'Grade 7: One-Word Substitutions (everyday & academic contexts)',
            'Grade 7 Themes: Environment & Society (pollution, resource, conserve, community), Ambition (determined, achieve)',
          ],
          stretchG2: [
            'Grade 8: Common Idioms & Phrasal Verbs in daily usage (break the ice, piece of cake, give up, put off)',
            'Grade 8 Register: Formal vs Informal language registers (Email vs Chat, Speech vs Conversation)',
            'Grade 8 Confusing Words: Distinguishing affect/effect, than/then, complement/compliment',
            'Grade 8 Rhetorical Vocabulary: assert, refute, contend, justify, articulate, persevere, dilemma',
            'Grade 8 Themes: Sustainability, ecosystem, policy, initiative, controversy, advocacy',
          ],
        },
        {
          id: 'debate',
          name: 'Debate, Public Speaking & Rhetoric',
          icon: Flame,
          color: 'from-red-500 to-orange-500',
          baseG1: [
            'Debate Fundamentals: Motion analysis, For vs Against team roles, evidence and logical reasoning',
            'Speech Architecture: Hook/opening line → 3 structured body points with examples → Memorable closing',
            'Extempore & 1-Minute JAM (Just-A-Minute): Speaking spontaneously without hesitation, repetition, or deviation',
            'Group Discussion Protocols: Initiating discussion, building upon peer points, respectful disagreement',
          ],
          stretchG2: [
            'Formal Oxford/Parliamentary Debate Format: 1.5 min Opening For → 1.5 min Opening Against → 1 min Rebuttals → 1 min Closing',
            'Stage Presence & Non-Verbal Gravitas: Eye contact, vocal projection, body posture, reducing verbal crutches ("um", "like")',
            'Real-Life English: Mock interview simulations, giving clear technical instructions, formal telephone etiquette',
            'Sample Debate Topics: "Should homework be banned?", "Are books better than movies?", "Is AI doing more harm than good?"',
          ],
        },
      ],
      methodology: [
        {
          title: 'Grammar in Service of Argumentation',
          desc: 'Complex grammatical clauses and conditionals are practiced directly within debate speeches and essay writing rather than isolated fill-in-the-blanks.',
        },
        {
          title: 'Structured Debate Sparring',
          desc: 'Weekly simulated debate motions teach students how to listen actively to opposing arguments and construct respectful, evidence-backed rebuttals.',
        },
        {
          title: 'Etymological Word Discovery',
          desc: 'Teaching root words (e.g. -spect = see) equips students to independently deduce the meaning of hundreds of unfamiliar words.',
        },
      ],
      worksheets: [
        {
          id: 'ws1_g7_8_grammar',
          title: 'Worksheet 1: Grammar (Grade 7 & 8 Challenge)',
          subtitle: 'Clause Identification • Conditionals • Voice with Modals',
          questions: [
            {
              q: 'A. Identify the type of underlined clause (Noun / Adjective / Adverb):',
              sub: [
                '1. I know that he is honest. —',
                '2. This is the house where I was born. —',
                '3. She left before the rain started. —',
              ],
              ans: '1. Noun Clause (object of know), 2. Adjective / Relative Clause (describing house), 3. Adverb Clause of Time.',
            },
            {
              q: 'B. Complete the conditional sentences with the correct verb form:',
              sub: [
                '1. If it rains tomorrow, we ________ (cancel) the outdoor picnic.',
                '2. If I were you, I ________ (apologise) immediately.',
                '3. If she had studied harder, she ________ (pass) the examination.',
              ],
              ans: '1. will cancel (Type 1), 2. would apologise (Type 2), 3. would have passed (Type 3).',
            },
            {
              q: 'C. Change into Passive Voice with Modals & Questions:',
              sub: [
                '1. You must submit the registration form today. →',
                '2. Who wrote this inspirational letter? →',
              ],
              ans: '1. The registration form must be submitted today. 2. By whom was this inspirational letter written?',
            },
          ],
        },
        {
          id: 'ws2_g7_8_vocab',
          title: 'Worksheet 2: Vocabulary (Idioms, Phrasal Verbs & Root Words)',
          subtitle: 'Grade 7 & 8 • Etymological Expansion & Contextual Phrases',
          questions: [
            {
              q: 'A. Match the idiom to its meaning:',
              sub: [
                '1. Break the ice → a. Very easy task',
                '2. Piece of cake → b. Start a conversation in a tense setting',
                '3. Under the weather → c. Reveal a secret accidentally',
                '4. Let the cat out of the bag → d. Feeling unwell',
              ],
              ans: '1-b, 2-a, 3-d, 4-c.',
            },
            {
              q: 'B. Fill in the blank with the correct phrasal verb (look up / give up / carry on / put off):',
              sub: [
                '1. Please don’t ________ trying — you are very close to success.',
                '2. We had to ________ the match until next Sunday because of heavy rain.',
                '3. You should ________ the meaning of this root word in a dictionary.',
              ],
              ans: '1. give up, 2. put off, 3. look up.',
            },
            {
              q: 'C. Root Word Challenge: Write two English words derived from each root:',
              sub: ['1. Port (carry)', '2. Spect (see / look)', '3. Dict (say / speak)'],
              ans: '1. Transport, Export, Portable, Report. 2. Spectator, Inspect, Respect, Retrospect. 3. Predict, Dictate, Dictionary, Verdict.',
            },
          ],
        },
        {
          id: 'ws3_g7_8_debate',
          title: 'Worksheet 3: Debate & Public Speaking (Argument Builder & Speech Outline)',
          subtitle: 'Grade 7 & 8 • Motion Analysis, Rebuttal Construction & Speech Planning',
          story:
            'Motion: "Homework should be banned in primary and middle schools."\nChoose your side (For / Against) and construct two structured arguments with real-world examples.',
          questions: [
            {
              q: '1. Argument 1 (Supporting Point + Specific Example):',
              ans: 'Sample (For): Excessive homework increases stress and prevents children from participating in outdoor sports and creative hobbies. For example, countries like Finland assign minimal homework yet rank among the world’s top education systems.',
            },
            {
              q: '2. Argument 2 (Counter-Point Refutation / Rebuttal):',
              ans: 'Sample (Against): Homework reinforces daily classroom learning and builds essential habits of discipline and independent problem-solving. For instance, practicing 3 math problems daily ensures long-term memory retention.',
            },
            {
              q: '3. 3-Part Speech Architecture Outline on "The Habit That Changed My Life":',
              ans: 'Opening Hook: A compelling personal story or surprising statistic → Body: 2–3 actionable points on how the habit improved daily focus → Closing Call to Action: Inspiring the audience to adopt one micro-habit today.',
            },
          ],
        },
      ],
    },
  };

  const active = curriculumData[activeGrade];

  // Assessment framework (Universal across grades)
  const assessmentData = [
    {
      type: 'Written Assessment',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      items: [
        'Curriculum-mapped Grammar & Vocabulary worksheets',
        'Reading comprehension & inferential passage tests',
        'Creative paragraph, diary entry, and speech writing tasks',
        'Dictation, spelling, and sentence transformation quizzes',
      ],
    },
    {
      type: 'Oral & Performance Assessment',
      icon: Mic,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      items: [
        'Read-aloud fluency, cadence, and expressive poetry recitation',
        'Real-life conversational role-play and telephone etiquette',
        '1-Minute Extempore & JAM (Just-A-Minute) presentations',
        'Formal Parliamentary / Oxford debate performances with rebuttals',
      ],
    },
    {
      type: 'Listening & Audio Comprehension',
      icon: Volume2,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      items: [
        'Listen & answer short audio stories and news snippets',
        'Listen & illustrate / follow multi-step instructions',
        'Extracting key arguments and opinions from spoken dialogues',
        'Pronunciation and intonation mimicry drills',
      ],
    },
    {
      type: 'Student Portfolio & Growth Journal',
      icon: Award,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      items: [
        'Personal Vocabulary & Idiom Journal maintained weekly',
        'Best Worksheet & Speech Script Showcase Folder',
        'Active classroom participation and peer constructive feedback',
        'Monthly mentor speech progress rubric ratings',
      ],
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white py-16 lg:py-24 border-b border-slate-800 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(242,124,0,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Complete Spoken English & Language Skills Curriculum</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Grade 1 to Grade 8 <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Communication & Language Roadmap
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Carefully engineered by speech educators and national debaters. From early phonics, rhymes, and
              picture talk in Grade 1 to formal parliamentary debates, literary devices, and rhetoric in Grade 8.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                4 Grade Tiers (G1–G8)
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                Integrated 4 & 5 Pillars
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                Full Practice Worksheets & Answer Keys
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                Multi-Tier Assessment System
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Selector Navigation Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-start lg:justify-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => {
                setActiveGrade('g1_2');
                setActivePillar('overview');
              }}
              className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeGrade === 'g1_2'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Grade 1 & 2 (Story Cubs)</span>
            </button>

            <button
              onClick={() => {
                setActiveGrade('g3_4');
                setActivePillar('overview');
              }}
              className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeGrade === 'g3_4'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Grade 3 & 4 (Wonderland)</span>
            </button>

            <button
              onClick={() => {
                setActiveGrade('g5_6');
                setActivePillar('overview');
              }}
              className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeGrade === 'g5_6'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Grade 5 & 6 (4 Pillars)</span>
            </button>

            <button
              onClick={() => {
                setActiveGrade('g7_8');
                setActivePillar('overview');
              }}
              className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeGrade === 'g7_8'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Grade 7 & 8 (Debate & Speech)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Grade Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Active Grade Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {active.badge}
                </span>
                <span className="text-xs font-semibold text-slate-500">{active.ageRange}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">{active.title}</h2>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#10182C] text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Book Demo for {active.badge.split(' ')[0]}</span>
            </button>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{active.summary}</p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {active.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar Sub-Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Curriculum Strands & Pillars</span>
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => setActivePillar('overview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activePillar === 'overview'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Pillars
              </button>
              <button
                onClick={() => setActivePillar('worksheets')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activePillar === 'worksheets'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-amber-500" />
                <span>Practice Worksheets ({active.worksheets.length})</span>
              </button>
              <button
                onClick={() => setActivePillar('assessment')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer hidden sm:flex items-center gap-1.5 ${
                  activePillar === 'assessment'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Assessment</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: ALL PILLARS VIEW */}
          {(activePillar === 'overview' || activePillar === 'spoken' || activePillar === 'prose_poetry' || activePillar === 'grammar' || activePillar === 'vocabulary' || activePillar === 'debate') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {active.pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center font-bold shadow-xs shrink-0`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base sm:text-lg text-slate-900">{pillar.name}</h4>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Comprehensive Strand Syllabus
                          </span>
                        </div>
                      </div>

                      {/* Grade Column 1 / Base */}
                      <div className="space-y-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                        <span className="text-[11px] font-extrabold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          {activeGrade === 'g1_2'
                            ? 'Grade 1 — Base Strand'
                            : activeGrade === 'g3_4'
                            ? 'Grade 3 — Focus'
                            : activeGrade === 'g5_6'
                            ? 'Grade 5 — Core Strand'
                            : 'Grade 7 — Core Strand'}
                        </span>
                        <ul className="space-y-1.5 pt-1">
                          {pillar.baseG1.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="text-amber-600 font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Grade Column 2 / Stretch */}
                      <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                        <span className="text-[11px] font-extrabold uppercase text-indigo-800 tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          {activeGrade === 'g1_2'
                            ? 'Grade 2 — Stretch Strand'
                            : activeGrade === 'g3_4'
                            ? 'Grade 4 — Advanced'
                            : activeGrade === 'g5_6'
                            ? 'Grade 6 — Advanced Strand'
                            : 'Grade 8 — Advanced Strand'}
                        </span>
                        <ul className="space-y-1.5 pt-1">
                          {pillar.stretchG2.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="text-indigo-600 font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: WORKSHEETS & PRACTICE ARENA */}
          {activePillar === 'worksheets' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-300/60 rounded-2xl p-5 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-amber-700" />
                    <span>Interactive Practice Worksheets for {active.badge}</span>
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    Try solving the questions below or click "Reveal Answer Key" to verify solutions.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {active.worksheets.map((ws, wsIdx) => (
                  <div
                    key={ws.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                          Worksheet {wsIdx + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900">{ws.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{ws.subtitle}</p>
                      </div>

                      <button
                        onClick={() => toggleAnswer(ws.id)}
                        className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {showAnswers[ws.id] ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hide Answer Key</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>Reveal Answer Key</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Story or Context Box */}
                    {ws.story && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs sm:text-sm text-slate-800 space-y-2 whitespace-pre-line leading-relaxed font-serif">
                        <strong className="text-slate-900 block font-sans text-xs uppercase font-extrabold text-amber-800">
                          Reading Text:
                        </strong>
                        <p>{ws.story}</p>
                      </div>
                    )}

                    {/* Question List */}
                    <div className="space-y-4">
                      {ws.questions.map((qObj, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                        >
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{qObj.q}</p>

                          {qObj.sub && (
                            <div className="pl-4 space-y-1">
                              {qObj.sub.map((subQ, sIdx) => (
                                <p key={sIdx} className="text-xs text-slate-700">
                                  {subQ}
                                </p>
                              ))}
                            </div>
                          )}

                          {showAnswers[ws.id] && (
                            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 animate-fadeIn">
                              <strong className="font-bold flex items-center gap-1 text-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Solution / Model Answer:
                              </strong>
                              <p className="mt-1 font-mono text-[11px] text-emerald-950">{qObj.ans}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: ASSESSMENT FRAMEWORK */}
          {activePillar === 'assessment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {assessmentData.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-base text-slate-900">{item.type}</h4>
                    </div>

                    <ul className="space-y-2 pt-2">
                      {item.items.map((it, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Teaching Methodology Cards */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black">How {active.badge} Is Taught</h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Pedagogical techniques engineered to build high participation, zero stage-fright, and lifelong language love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {active.methodology.map((m, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 flex flex-col justify-start"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  0{i + 1}
                </div>
                <h4 className="text-base font-bold text-white">{m.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Universal 4-Tier Assessment Roadmap */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Continuous Progress Evaluation
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">How Students Are Assessed</h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              We replace stressful exams with continuous, multi-dimensional positive reinforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {assessmentData.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-amber-600 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{a.type}</h4>
                  <ul className="space-y-1.5">
                    {a.items.map((point, pIdx) => (
                      <li key={pIdx} className="text-[11px] text-slate-600 leading-snug flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Free Demo CTA Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free 45-Minute Diagnostic Session</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">Experience the Curriculum Live</h3>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              Book a 1-on-1 speech and language diagnostic class. Our senior speech mentor evaluates your child's
              baseline fluency and provides an instant personalized learning path.
            </p>
          </div>

          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs sm:text-sm tracking-wide shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            BOOK FREE 45-MIN DEMO
          </button>
        </div>
      </main>
    </div>
  );
};
