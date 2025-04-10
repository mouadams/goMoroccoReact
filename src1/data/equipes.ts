
export interface Equipe {
  id: string;
  nom: string;
  drapeau: string;
  groupe: string;
  abreviation: string;
  confederation: string;
  entraineur: string;
  rang: number;
}

export const equipes: Equipe[] = [
  {
    id: "maroc",
    nom: "Maroc",
    drapeau: "https://flagcdn.com/ma.svg",
    groupe: "A",
    abreviation: "MAR",
    confederation: "CAF",
    entraineur: "Walid Regragui",
    rang: 13
  },
  {
    id: "senegal",
    nom: "Sénégal",
    drapeau: "https://flagcdn.com/sn.svg",
    groupe: "A",
    abreviation: "SEN",
    confederation: "CAF",
    entraineur: "Aliou Cissé",
    rang: 20
  },
  {
    id: "egypte",
    nom: "Égypte",
    drapeau: "https://flagcdn.com/eg.svg",
    groupe: "B",
    abreviation: "EGY",
    confederation: "CAF",
    entraineur: "Rui Vitória",
    rang: 33
  },
  {
    id: "nigeria",
    nom: "Nigeria",
    drapeau: "https://flagcdn.com/ng.svg",
    groupe: "B",
    abreviation: "NGA",
    confederation: "CAF",
    entraineur: "Finidi George",
    rang: 28
  },
  {
    id: "algerie",
    nom: "Algérie",
    drapeau: "https://flagcdn.com/dz.svg",
    groupe: "C",
    abreviation: "ALG",
    confederation: "CAF",
    entraineur: "Vladimir Petković",
    rang: 30
  },
  {
    id: "cameroun",
    nom: "Cameroun",
    drapeau: "https://flagcdn.com/cm.svg",
    groupe: "C",
    abreviation: "CMR",
    confederation: "CAF",
    entraineur: "Marc Brys",
    rang: 42
  },
  {
    id: "tunisie",
    nom: "Tunisie",
    drapeau: "https://flagcdn.com/tn.svg",
    groupe: "D",
    abreviation: "TUN",
    confederation: "CAF",
    entraineur: "Faouzi Benzarti",
    rang: 41
  },
  {
    id: "coteivoire",
    nom: "Côte d'Ivoire",
    drapeau: "https://flagcdn.com/ci.svg",
    groupe: "D",
    abreviation: "CIV",
    confederation: "CAF",
    entraineur: "Emerse Faé",
    rang: 38
  },
  {
    id: "mali",
    nom: "Mali",
    drapeau: "https://flagcdn.com/ml.svg",
    groupe: "E",
    abreviation: "MLI",
    confederation: "CAF",
    entraineur: "Éric Chelle",
    rang: 49
  },
  {
    id: "ghana",
    nom: "Ghana",
    drapeau: "https://flagcdn.com/gh.svg",
    groupe: "E",
    abreviation: "GHA",
    confederation: "CAF",
    entraineur: "Otto Addo",
    rang: 54
  },
  {
    id: "afrdusud",
    nom: "Afrique du Sud",
    drapeau: "https://flagcdn.com/za.svg",
    groupe: "F",
    abreviation: "RSA",
    confederation: "CAF",
    entraineur: "Hugo Broos",
    rang: 59
  },
  {
    id: "rdc",
    nom: "RD Congo",
    drapeau: "https://flagcdn.com/cd.svg",
    groupe: "F",
    abreviation: "RDC",
    confederation: "CAF",
    entraineur: "Sébastien Desabre",
    rang: 65
  },
  {
    id: "angola",
    nom: "Angola",
    drapeau: "https://flagcdn.com/ao.svg",
    groupe: "A",
    abreviation: "ANG",
    confederation: "CAF",
    entraineur: "Pedro Gonçalves",
    rang: 87
  },
  {
    id: "guinee",
    nom: "Guinée",
    drapeau: "https://flagcdn.com/gn.svg",
    groupe: "B",
    abreviation: "GUI",
    confederation: "CAF",
    entraineur: "Kaba Diawara",
    rang: 80
  },
  {
    id: "gabon",
    nom: "Gabon",
    drapeau: "https://flagcdn.com/ga.svg",
    groupe: "C",
    abreviation: "GAB",
    confederation: "CAF",
    entraineur: "Thierry Mouyouma",
    rang: 89
  },
  {
    id: "benin",
    nom: "Bénin",
    drapeau: "https://flagcdn.com/bj.svg",
    groupe: "D",
    abreviation: "BEN",
    confederation: "CAF",
    entraineur: "Gernot Rohr",
    rang: 93
  },
  {
    id: "mozambique",
    nom: "Mozambique",
    drapeau: "https://flagcdn.com/mz.svg",
    groupe: "E",
    abreviation: "MOZ",
    confederation: "CAF",
    entraineur: "Chiquinho Conde",
    rang: 111
  },
  {
    id: "zambie",
    nom: "Zambie",
    drapeau: "https://flagcdn.com/zm.svg",
    groupe: "F",
    abreviation: "ZAM",
    confederation: "CAF",
    entraineur: "Avram Grant",
    rang: 90
  },
  {
    id: "burkina",
    nom: "Burkina Faso",
    drapeau: "https://flagcdn.com/bf.svg",
    groupe: "A",
    abreviation: "BFA",
    confederation: "CAF",
    entraineur: "Brama Traoré",
    rang: 64
  },
  {
    id: "guineeequatoriale",
    nom: "Guinée Équatoriale",
    drapeau: "https://flagcdn.com/gq.svg",
    groupe: "B",
    abreviation: "GEQ",
    confederation: "CAF",
    entraineur: "Juan Micha",
    rang: 88
  },
  {
    id: "capvert",
    nom: "Cap-Vert",
    drapeau: "https://flagcdn.com/cv.svg",
    groupe: "C",
    abreviation: "CPV",
    confederation: "CAF",
    entraineur: "Pedro Brito",
    rang: 71
  },
  {
    id: "tanzanie",
    nom: "Tanzanie",
    drapeau: "https://flagcdn.com/tz.svg",
    groupe: "D",
    abreviation: "TAN",
    confederation: "CAF",
    entraineur: "Adel Amrouche",
    rang: 122
  },
  {
    id: "namibie",
    nom: "Namibie",
    drapeau: "https://flagcdn.com/na.svg",
    groupe: "E",
    abreviation: "NAM",
    confederation: "CAF",
    entraineur: "Collin Benjamin",
    rang: 115
  },
  {
    id: "soudan",
    nom: "Soudan",
    drapeau: "https://flagcdn.com/sd.svg",
    groupe: "F",
    abreviation: "SDN",
    confederation: "CAF",
    entraineur: "Kwesi Appiah",
    rang: 124
  }
];
