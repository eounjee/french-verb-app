export type Tense = "présent" | "imparfait" | "futur" | "passé composé" | "conditionnel" | "subjonctif";
export type Pronoun = "je" | "tu" | "il/elle" | "nous" | "vous" | "ils/elles";

export interface VerbConjugation {
  [key: string]: string;
}

export interface Verb {
  infinitive: string;
  meaning: string;
  group: 1 | 2 | 3;
  conjugations: {
    [tense in Tense]: VerbConjugation;
  };
}

export const PRONOUNS: Pronoun[] = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

export const TENSES: { id: Tense; label: string; level: "basic" | "advanced" }[] = [
  { id: "présent", label: "현재 (Présent)", level: "basic" },
  { id: "passé composé", label: "복합과거 (Passé Composé)", level: "basic" },
  { id: "futur", label: "단순미래 (Futur Simple)", level: "basic" },
  { id: "imparfait", label: "반과거 (Imparfait)", level: "basic" },
  { id: "conditionnel", label: "조건법 (Conditionnel)", level: "advanced" },
  { id: "subjonctif", label: "접속법 (Subjonctif)", level: "advanced" },
];

// Level → how many tenses from TENSES array to include
// A1: 1 (présent), A2: 3 (présent, passé composé, futur), B1: 4 (+ imparfait), B2+: 6 (all)
export const LEVEL_TENSE_COUNT: Record<string, number> = {
  A1: 1,
  A2: 3,
  B1: 4,
  "B2+": 6,
};

export function getTensesForLevel(level: string) {
  return TENSES.slice(0, LEVEL_TENSE_COUNT[level] ?? 4);
}

export const VERBS: Verb[] = [
  {
    infinitive: "être",
    meaning: "~이다",
    group: 3,
    conjugations: {
      présent: { je: "suis", tu: "es", "il/elle": "est", nous: "sommes", vous: "êtes", "ils/elles": "sont" },
      imparfait: { je: "étais", tu: "étais", "il/elle": "était", nous: "étions", vous: "étiez", "ils/elles": "étaient" },
      futur: { je: "serai", tu: "seras", "il/elle": "sera", nous: "serons", vous: "serez", "ils/elles": "seront" },
      "passé composé": { je: "ai été", tu: "as été", "il/elle": "a été", nous: "avons été", vous: "avez été", "ils/elles": "ont été" },
      conditionnel: { je: "serais", tu: "serais", "il/elle": "serait", nous: "serions", vous: "seriez", "ils/elles": "seraient" },
      subjonctif: { je: "sois", tu: "sois", "il/elle": "soit", nous: "soyons", vous: "soyez", "ils/elles": "soient" },
    },
  },
  {
    infinitive: "avoir",
    meaning: "가지다",
    group: 3,
    conjugations: {
      présent: { je: "ai", tu: "as", "il/elle": "a", nous: "avons", vous: "avez", "ils/elles": "ont" },
      imparfait: { je: "avais", tu: "avais", "il/elle": "avait", nous: "avions", vous: "aviez", "ils/elles": "avaient" },
      futur: { je: "aurai", tu: "auras", "il/elle": "aura", nous: "aurons", vous: "aurez", "ils/elles": "auront" },
      "passé composé": { je: "ai eu", tu: "as eu", "il/elle": "a eu", nous: "avons eu", vous: "avez eu", "ils/elles": "ont eu" },
      conditionnel: { je: "aurais", tu: "aurais", "il/elle": "aurait", nous: "aurions", vous: "auriez", "ils/elles": "auraient" },
      subjonctif: { je: "aie", tu: "aies", "il/elle": "ait", nous: "ayons", vous: "ayez", "ils/elles": "aient" },
    },
  },
  {
    infinitive: "aller",
    meaning: "가다",
    group: 3,
    conjugations: {
      présent: { je: "vais", tu: "vas", "il/elle": "va", nous: "allons", vous: "allez", "ils/elles": "vont" },
      imparfait: { je: "allais", tu: "allais", "il/elle": "allait", nous: "allions", vous: "alliez", "ils/elles": "allaient" },
      futur: { je: "irai", tu: "iras", "il/elle": "ira", nous: "irons", vous: "irez", "ils/elles": "iront" },
      "passé composé": { je: "suis allé(e)", tu: "es allé(e)", "il/elle": "est allé(e)", nous: "sommes allé(e)s", vous: "êtes allé(e)s", "ils/elles": "sont allé(e)s" },
      conditionnel: { je: "irais", tu: "irais", "il/elle": "irait", nous: "irions", vous: "iriez", "ils/elles": "iraient" },
      subjonctif: { je: "aille", tu: "ailles", "il/elle": "aille", nous: "allions", vous: "alliez", "ils/elles": "aillent" },
    },
  },
  {
    infinitive: "faire",
    meaning: "하다, 만들다",
    group: 3,
    conjugations: {
      présent: { je: "fais", tu: "fais", "il/elle": "fait", nous: "faisons", vous: "faites", "ils/elles": "font" },
      imparfait: { je: "faisais", tu: "faisais", "il/elle": "faisait", nous: "faisions", vous: "faisiez", "ils/elles": "faisaient" },
      futur: { je: "ferai", tu: "feras", "il/elle": "fera", nous: "ferons", vous: "ferez", "ils/elles": "feront" },
      "passé composé": { je: "ai fait", tu: "as fait", "il/elle": "a fait", nous: "avons fait", vous: "avez fait", "ils/elles": "ont fait" },
      conditionnel: { je: "ferais", tu: "ferais", "il/elle": "ferait", nous: "ferions", vous: "feriez", "ils/elles": "feraient" },
      subjonctif: { je: "fasse", tu: "fasses", "il/elle": "fasse", nous: "fassions", vous: "fassiez", "ils/elles": "fassent" },
    },
  },
  {
    infinitive: "parler",
    meaning: "말하다",
    group: 1,
    conjugations: {
      présent: { je: "parle", tu: "parles", "il/elle": "parle", nous: "parlons", vous: "parlez", "ils/elles": "parlent" },
      imparfait: { je: "parlais", tu: "parlais", "il/elle": "parlait", nous: "parlions", vous: "parliez", "ils/elles": "parlaient" },
      futur: { je: "parlerai", tu: "parleras", "il/elle": "parlera", nous: "parlerons", vous: "parlerez", "ils/elles": "parleront" },
      "passé composé": { je: "ai parlé", tu: "as parlé", "il/elle": "a parlé", nous: "avons parlé", vous: "avez parlé", "ils/elles": "ont parlé" },
      conditionnel: { je: "parlerais", tu: "parlerais", "il/elle": "parlerait", nous: "parlerions", vous: "parleriez", "ils/elles": "parleraient" },
      subjonctif: { je: "parle", tu: "parles", "il/elle": "parle", nous: "parlions", vous: "parliez", "ils/elles": "parlent" },
    },
  },
  {
    infinitive: "manger",
    meaning: "먹다",
    group: 1,
    conjugations: {
      présent: { je: "mange", tu: "manges", "il/elle": "mange", nous: "mangeons", vous: "mangez", "ils/elles": "mangent" },
      imparfait: { je: "mangeais", tu: "mangeais", "il/elle": "mangeait", nous: "mangions", vous: "mangiez", "ils/elles": "mangeaient" },
      futur: { je: "mangerai", tu: "mangeras", "il/elle": "mangera", nous: "mangerons", vous: "mangerez", "ils/elles": "mangeront" },
      "passé composé": { je: "ai mangé", tu: "as mangé", "il/elle": "a mangé", nous: "avons mangé", vous: "avez mangé", "ils/elles": "ont mangé" },
      conditionnel: { je: "mangerais", tu: "mangerais", "il/elle": "mangerait", nous: "mangerions", vous: "mangeriez", "ils/elles": "mangeraient" },
      subjonctif: { je: "mange", tu: "manges", "il/elle": "mange", nous: "mangions", vous: "mangiez", "ils/elles": "mangent" },
    },
  },
  {
    infinitive: "vouloir",
    meaning: "원하다",
    group: 3,
    conjugations: {
      présent: { je: "veux", tu: "veux", "il/elle": "veut", nous: "voulons", vous: "voulez", "ils/elles": "veulent" },
      imparfait: { je: "voulais", tu: "voulais", "il/elle": "voulait", nous: "voulions", vous: "vouliez", "ils/elles": "voulaient" },
      futur: { je: "voudrai", tu: "voudras", "il/elle": "voudra", nous: "voudrons", vous: "voudrez", "ils/elles": "voudront" },
      "passé composé": { je: "ai voulu", tu: "as voulu", "il/elle": "a voulu", nous: "avons voulu", vous: "avez voulu", "ils/elles": "ont voulu" },
      conditionnel: { je: "voudrais", tu: "voudrais", "il/elle": "voudrait", nous: "voudrions", vous: "voudriez", "ils/elles": "voudraient" },
      subjonctif: { je: "veuille", tu: "veuilles", "il/elle": "veuille", nous: "voulions", vous: "vouliez", "ils/elles": "veuillent" },
    },
  },
  {
    infinitive: "pouvoir",
    meaning: "할 수 있다",
    group: 3,
    conjugations: {
      présent: { je: "peux", tu: "peux", "il/elle": "peut", nous: "pouvons", vous: "pouvez", "ils/elles": "peuvent" },
      imparfait: { je: "pouvais", tu: "pouvais", "il/elle": "pouvait", nous: "pouvions", vous: "pouviez", "ils/elles": "pouvaient" },
      futur: { je: "pourrai", tu: "pourras", "il/elle": "pourra", nous: "pourrons", vous: "pourrez", "ils/elles": "pourront" },
      "passé composé": { je: "ai pu", tu: "as pu", "il/elle": "a pu", nous: "avons pu", vous: "avez pu", "ils/elles": "ont pu" },
      conditionnel: { je: "pourrais", tu: "pourrais", "il/elle": "pourrait", nous: "pourrions", vous: "pourriez", "ils/elles": "pourraient" },
      subjonctif: { je: "puisse", tu: "puisses", "il/elle": "puisse", nous: "puissions", vous: "puissiez", "ils/elles": "puissent" },
    },
  },
  {
    infinitive: "savoir",
    meaning: "알다",
    group: 3,
    conjugations: {
      présent: { je: "sais", tu: "sais", "il/elle": "sait", nous: "savons", vous: "savez", "ils/elles": "savent" },
      imparfait: { je: "savais", tu: "savais", "il/elle": "savait", nous: "savions", vous: "saviez", "ils/elles": "savaient" },
      futur: { je: "saurai", tu: "sauras", "il/elle": "saura", nous: "saurons", vous: "saurez", "ils/elles": "sauront" },
      "passé composé": { je: "ai su", tu: "as su", "il/elle": "a su", nous: "avons su", vous: "avez su", "ils/elles": "ont su" },
      conditionnel: { je: "saurais", tu: "saurais", "il/elle": "saurait", nous: "saurions", vous: "sauriez", "ils/elles": "sauraient" },
      subjonctif: { je: "sache", tu: "saches", "il/elle": "sache", nous: "sachions", vous: "sachiez", "ils/elles": "sachent" },
    },
  },
  {
    infinitive: "venir",
    meaning: "오다",
    group: 3,
    conjugations: {
      présent: { je: "viens", tu: "viens", "il/elle": "vient", nous: "venons", vous: "venez", "ils/elles": "viennent" },
      imparfait: { je: "venais", tu: "venais", "il/elle": "venait", nous: "venions", vous: "veniez", "ils/elles": "venaient" },
      futur: { je: "viendrai", tu: "viendras", "il/elle": "viendra", nous: "viendrons", vous: "viendrez", "ils/elles": "viendront" },
      "passé composé": { je: "suis venu(e)", tu: "es venu(e)", "il/elle": "est venu(e)", nous: "sommes venu(e)s", vous: "êtes venu(e)s", "ils/elles": "sont venu(e)s" },
      conditionnel: { je: "viendrais", tu: "viendrais", "il/elle": "viendrait", nous: "viendrions", vous: "viendriez", "ils/elles": "viendraient" },
      subjonctif: { je: "vienne", tu: "viennes", "il/elle": "vienne", nous: "venions", vous: "veniez", "ils/elles": "viennent" },
    },
  },
  {
    infinitive: "prendre",
    meaning: "가져가다, 타다",
    group: 3,
    conjugations: {
      présent: { je: "prends", tu: "prends", "il/elle": "prend", nous: "prenons", vous: "prenez", "ils/elles": "prennent" },
      imparfait: { je: "prenais", tu: "prenais", "il/elle": "prenait", nous: "prenions", vous: "preniez", "ils/elles": "prenaient" },
      futur: { je: "prendrai", tu: "prendras", "il/elle": "prendra", nous: "prendrons", vous: "prendrez", "ils/elles": "prendront" },
      "passé composé": { je: "ai pris", tu: "as pris", "il/elle": "a pris", nous: "avons pris", vous: "avez pris", "ils/elles": "ont pris" },
      conditionnel: { je: "prendrais", tu: "prendrais", "il/elle": "prendrait", nous: "prendrions", vous: "prendriez", "ils/elles": "prendraient" },
      subjonctif: { je: "prenne", tu: "prennes", "il/elle": "prenne", nous: "prenions", vous: "preniez", "ils/elles": "prennent" },
    },
  },
  {
    infinitive: "voir",
    meaning: "보다",
    group: 3,
    conjugations: {
      présent: { je: "vois", tu: "vois", "il/elle": "voit", nous: "voyons", vous: "voyez", "ils/elles": "voient" },
      imparfait: { je: "voyais", tu: "voyais", "il/elle": "voyait", nous: "voyions", vous: "voyiez", "ils/elles": "voyaient" },
      futur: { je: "verrai", tu: "verras", "il/elle": "verra", nous: "verrons", vous: "verrez", "ils/elles": "verront" },
      "passé composé": { je: "ai vu", tu: "as vu", "il/elle": "a vu", nous: "avons vu", vous: "avez vu", "ils/elles": "ont vu" },
      conditionnel: { je: "verrais", tu: "verrais", "il/elle": "verrait", nous: "verrions", vous: "verriez", "ils/elles": "verraient" },
      subjonctif: { je: "voie", tu: "voies", "il/elle": "voie", nous: "voyions", vous: "voyiez", "ils/elles": "voient" },
    },
  },
  {
    infinitive: "finir",
    meaning: "끝내다",
    group: 2,
    conjugations: {
      présent: { je: "finis", tu: "finis", "il/elle": "finit", nous: "finissons", vous: "finissez", "ils/elles": "finissent" },
      imparfait: { je: "finissais", tu: "finissais", "il/elle": "finissait", nous: "finissions", vous: "finissiez", "ils/elles": "finissaient" },
      futur: { je: "finirai", tu: "finiras", "il/elle": "finira", nous: "finirons", vous: "finirez", "ils/elles": "finiront" },
      "passé composé": { je: "ai fini", tu: "as fini", "il/elle": "a fini", nous: "avons fini", vous: "avez fini", "ils/elles": "ont fini" },
      conditionnel: { je: "finirais", tu: "finirais", "il/elle": "finirait", nous: "finirions", vous: "finiriez", "ils/elles": "finiraient" },
      subjonctif: { je: "finisse", tu: "finisses", "il/elle": "finisse", nous: "finissions", vous: "finissiez", "ils/elles": "finissent" },
    },
  },
  {
    infinitive: "aimer",
    meaning: "좋아하다, 사랑하다",
    group: 1,
    conjugations: {
      présent: { je: "aime", tu: "aimes", "il/elle": "aime", nous: "aimons", vous: "aimez", "ils/elles": "aiment" },
      imparfait: { je: "aimais", tu: "aimais", "il/elle": "aimait", nous: "aimions", vous: "aimiez", "ils/elles": "aimaient" },
      futur: { je: "aimerai", tu: "aimeras", "il/elle": "aimera", nous: "aimerons", vous: "aimerez", "ils/elles": "aimeront" },
      "passé composé": { je: "ai aimé", tu: "as aimé", "il/elle": "a aimé", nous: "avons aimé", vous: "avez aimé", "ils/elles": "ont aimé" },
      conditionnel: { je: "aimerais", tu: "aimerais", "il/elle": "aimerait", nous: "aimerions", vous: "aimeriez", "ils/elles": "aimeraient" },
      subjonctif: { je: "aime", tu: "aimes", "il/elle": "aime", nous: "aimions", vous: "aimiez", "ils/elles": "aiment" },
    },
  },
  {
    infinitive: "travailler",
    meaning: "일하다",
    group: 1,
    conjugations: {
      présent: { je: "travaille", tu: "travailles", "il/elle": "travaille", nous: "travaillons", vous: "travaillez", "ils/elles": "travaillent" },
      imparfait: { je: "travaillais", tu: "travaillais", "il/elle": "travaillait", nous: "travaillions", vous: "travailliez", "ils/elles": "travaillaient" },
      futur: { je: "travaillerai", tu: "travailleras", "il/elle": "travaillera", nous: "travaillerons", vous: "travaillerez", "ils/elles": "travailleront" },
      "passé composé": { je: "ai travaillé", tu: "as travaillé", "il/elle": "a travaillé", nous: "avons travaillé", vous: "avez travaillé", "ils/elles": "ont travaillé" },
      conditionnel: { je: "travaillerais", tu: "travaillerais", "il/elle": "travaillerait", nous: "travaillerions", vous: "travailleriez", "ils/elles": "travailleraient" },
      subjonctif: { je: "travaille", tu: "travailles", "il/elle": "travaille", nous: "travaillions", vous: "travailliez", "ils/elles": "travaillent" },
    },
  },
];
