import type { School } from "../@types/School";
import type { Teacher } from "../@types/Teachers";
import { UserManagement } from "../userManagement/UserManagement";


// export const TEACHER_DATABASE_GROOTMOOR: TeacherDatabase = [
//   {
//     "short": "Ad",
//     "name": {
//       "firstName": "Frau Adolphi"
//     },
//     "subjects": [
//       "Mus",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Ado",
//     "name": {
//       "firstName": "Katharina",
//       "surname": "Adolphs"
//     },
//     "subjects": [
//       "Deu",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Ba",
//     "name": {
//       "firstName": "Rüdiger",
//       "surname": "Baar"
//     },
//     "subjects": [
//       "Spo",
//       "Ges",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Bec",
//     "name": {
//       "firstName": "Mareike",
//       "surname": "Beck"
//     },
//     "subjects": [
//       "Bio",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Bk",
//     "name": {
//       "firstName": "Swantje",
//       "surname": "Becker"
//     },
//     "subjects": [
//       "Ma",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Ber",
//     "name": {
//       "firstName": "Adrian",
//       "surname": "Berthold"
//     },
//     "subjects": [
//       "Bio",
//       "NuT",
//       "Phy",
//       "Mat"
//     ]
//   },
//   {
//     "short": "Bl",
//     "name": {
//       "firstName": "Svenja",
//       "surname": "Blum"
//     },
//     "subjects": [
//       "Spa",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Bre",
//     "name": {
//       "firstName": "Julia",
//       "surname": "Breiholdt"
//     },
//     "subjects": [
//       "Eng",
//       "PGW",
//       "Wir"
//     ]
//   },
//   {
//     "short": "Bm",
//     "duplicates": true,
//     "name": {
//       "firstName": "Timm",
//       "surname": "Bromm"
//     },
//     "subjects": [
//       "Mat",
//       "Spo"
//     ]
//   },
//   {
//     "short": "CP",
//     "name": {
//       "firstName": "Carla",
//       "surname": "Ceynowa-Paus"
//     },
//     "subjects": [
//       "Kun",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Co",
//     "name": {
//       "firstName": "Susanne",
//       "surname": "Colina"
//     },
//     "subjects": [
//       "Frz",
//       "Ges",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Cor",
//     "name": {
//       "firstName": "Dörte",
//       "surname": "Cornils-Dresbach"
//     },
//     "subjects": [
//       "Bio",
//       "Deu",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Dan",
//     "name": {
//       "firstName": "Nico",
//       "surname": "Danowski-Kirsch"
//     },
//     "subjects": [
//       "PGW",
//       "Phi"
//     ]
//   },
//   {
//     "short": "Ds",
//     "name": {
//       "firstName": "Christel",
//       "surname": "Deisel"
//     },
//     "subjects": [
//       "Eng",
//       "The"
//     ]
//   },
//   {
//     "short": "Dh",
//     "name": {
//       "firstName": "Andrea",
//       "surname": "Diederich"
//     },
//     "subjects": [
//       "Deu",
//       "Eng",
//       "Spa",
//       "The"
//     ]
//   },
//   {
//     "short": "Di",
//     "name": {
//       "firstName": "Jens",
//       "surname": "Diederich"
//     },
//     "subjects": [
//       "Mat",
//       "Phy",
//       "Inf"
//     ]
//   },
//   {
//     "short": "Dr",
//     "name": {
//       "firstName": "Herr Drews"
//     },
//     "subjects": [
//       "Eng",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Es",
//     "name": {
//       "firstName": "Clemens",
//       "surname": "Ehlers"
//     },
//     "subjects": [
//       "PGW",
//       "Phi",
//       "Rel",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Eh",
//     "name": {
//       "firstName": "Anika",
//       "surname": "Ehrenheim"
//     },
//     "subjects": [
//       "Eng",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Em",
//     "name": {
//       "firstName": "Kathrin",
//       "surname": "Emeis"
//     },
//     "subjects": [
//       "Deu",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Er",
//     "name": {
//       "firstName": "Hendrike",
//       "surname": "Ernst"
//     },
//     "subjects": [
//       "Kun",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Fa",
//     "name": {
//       "firstName": "Birgit",
//       "surname": "Fahrenholz"
//     },
//     "subjects": [
//       "Eng",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Fo",
//     "name": {
//       "firstName": "Sigrid",
//       "surname": "Forster"
//     },
//     "subjects": [
//       "Spo",
//       "Deu",
//       "Bio"
//     ]
//   },
//   {
//     "short": "Ga",
//     "name": {
//       "firstName": "Celina",
//       "surname": "García Quispe"
//     },
//     "subjects": [
//       "Spa",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Ge",
//     "name": {
//       "firstName": "Dirk",
//       "surname": "Gellermann"
//     },
//     "subjects": [
//       "Bio",
//       "Geo",
//       "Inf"
//     ]
//   },
//   {
//     "short": "Gi",
//     "name": {
//       "firstName": "Lina",
//       "surname": "Giffhorn"
//     },
//     "subjects": [
//       "Deu",
//       "Phi"
//     ]
//   },
//   {
//     "short": "Gm",
//     "name": {
//       "firstName": "Anna",
//       "surname": "Grahlmann"
//     },
//     "subjects": [
//       "Eng",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Gra",
//     "name": {
//       "firstName": "Carlotta",
//       "surname": "Graß"
//     },
//     "subjects": [
//       "Eng",
//       "PGW",
//       "Wir",
//       "Frz"
//     ]
//   },
//   {
//     "short": "Grt",
//     "name": {
//       "firstName": "Wiebke",
//       "surname": "Grauert"
//     },
//     "subjects": [
//       "Ges",
//       "PGW",
//       "Phi",
//       "Wir"
//     ]
//   },
//   {
//     "short": "Hlb",
//     "name": {
//       "firstName": "Marion",
//       "surname": "Halbach"
//     },
//     "subjects": [
//       "Deu",
//       "Frz"
//     ]
//   },
//   {
//     "short": "Hl",
//     "name": {
//       "firstName": "Heidi",
//       "surname": "Halenza"
//     },
//     "subjects": [
//       "Eng",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Hd",
//     "name": {
//       "firstName": "Jesko",
//       "surname": "Harders"
//     },
//     "subjects": [
//       "Spo",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Ha",
//     "duplicates": true,
//     "name": {
//       "firstName": "Kerstin",
//       "surname": "Hatten"
//     },
//     "subjects": [
//       "Mat",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Hau",
//     "name": {
//       "firstName": "Annette",
//       "surname": "Haubold"
//     },
//     "subjects": [
//       "Ges",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Hk",
//     "name": {
//       "firstName": "Dr. Marvin",
//       "surname": "Heidkamp"
//     },
//     "subjects": [
//       "Mat",
//       "Phy",
//       "Inf",
//       "NuT"
//     ]
//   },
//   {
//     "short": "Hzg",
//     "name": {
//       "firstName": "Betina",
//       "surname": "Herzog"
//     },
//     "subjects": [
//       "Mat",
//       "Spo",
//       "Rel"
//     ]
//   },
//   {
//     "short": "Hi",
//     "name": {
//       "firstName": "Jennifer",
//       "surname": "Hielscher"
//     },
//     "subjects": [
//       "Deu",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Hb",
//     "duplicates": true,
//     "name": {
//       "firstName": "Dr. Almut",
//       "surname": "Hillebrand"
//     },
//     "subjects": [
//       "Ges",
//       "Rel"
//     ]
//   },
//   {
//     "short": "Hgr",
//     "name": {
//       "firstName": "Ralph",
//       "surname": "Höger"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Hö",
//     "name": {
//       "firstName": "Dr. Barbara",
//       "surname": "Hölkemann"
//     },
//     "subjects": [
//       "Mat",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Hs",
//     "name": {
//       "firstName": "Sarah",
//       "surname": "Holmes"
//     },
//     "subjects": [
//       "Rel",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Hus",
//     "duplicates": true,
//     "name": {
//       "firstName": "Andreas",
//       "surname": "Huser-Jamil"
//     },
//     "subjects": [
//       "Geo",
//       "Ges",
//       "Phi",
//       "Wir"
//     ]
//   },
//   {
//     "short": "Hut",
//     "name": {
//       "firstName": "Jana",
//       "surname": "Hutschenreiter"
//     },
//     "subjects": [
//       "Spo",
//       "Bio",
//       "NuT"
//     ]
//   },
//   {
//     "short": "Jä",
//     "name": {
//       "firstName": "Maren",
//       "surname": "Jäckle"
//     },
//     "subjects": [
//       "Spo",
//       "Bio",
//       "NuT",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Jp",
//     "name": {
//       "firstName": "Philippa",
//       "surname": "Jasper"
//     },
//     "subjects": [
//       "Eng",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Js",
//     "duplicates": true,
//     "name": {
//       "firstName": "Gesche",
//       "surname": "Jacobs"
//     },
//     "subjects": [
//       "Deu",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Kn",
//     "name": {
//       "firstName": "Conny",
//       "surname": "Kerner"
//     },
//     "subjects": [
//       "Kun",
//       "Bio",
//       "NuT"
//     ]
//   },
//   {
//     "short": "Kle",
//     "name": {
//       "firstName": "Hannes",
//       "surname": "Klein"
//     },
//     "subjects": [
//       "Eng",
//       "Mus"
//     ]
//   },
//   {
//     "short": "Kly",
//     "name": {
//       "firstName": "Dorothee",
//       "surname": "Kley"
//     },
//     "subjects": [
//       "Eng",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Kö",
//     "name": {
//       "firstName": "Annette",
//       "surname": "Köster"
//     },
//     "subjects": [
//       "Deu",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Kr",
//     "duplicates": true,
//     "name": {
//       "firstName": "Lars",
//       "surname": "Kruse"
//     },
//     "subjects": [
//       "Rel",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Ky",
//     "name": {
//       "firstName": "Nina",
//       "surname": "Kubny"
//     },
//     "subjects": [
//       "Che",
//       "Bio"
//     ]
//   },
//   {
//     "short": "La",
//     "name": {
//       "firstName": "Susanne",
//       "surname": "Lange"
//     },
//     "subjects": [
//       "Deu",
//       "Ges",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Lh",
//     "name": {
//       "firstName": "Joanna",
//       "surname": "Langhoff"
//     },
//     "subjects": [
//       "Spa",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Lo",
//     "duplicates": true,
//     "name": {
//       "firstName": "Andre",
//       "surname": "Lohmann"
//     },
//     "subjects": [
//       "Deu",
//       "Lat"
//     ]
//   },
//   {
//     "short": "Mh",
//     "name": {
//       "firstName": "Frederik",
//       "surname": "Marhenke"
//     },
//     "subjects": [
//       "Mus",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Mn",
//     "duplicates": true,
//     "name": {
//       "firstName": "Birka",
//       "surname": "Marien"
//     },
//     "subjects": [
//       "Mat",
//       "Bio"
//     ]
//   },
//   {
//     "short": "Mas",
//     "name": {
//       "firstName": "Nadja",
//       "surname": "Massing"
//     },
//     "subjects": [
//       "Eng",
//       "Deu",
//       "Mat"
//     ]
//   },
//   {
//     "short": "Me",
//     "name": {
//       "firstName": "Björn",
//       "surname": "Mertins"
//     },
//     "subjects": [
//       "Eng",
//       "Mus",
//       "Spo"
//     ]
//   },
//   {
//     "short": "My",
//     "name": {
//       "firstName": "Sebastian",
//       "surname": "Meyer"
//     },
//     "subjects": [
//       "Mat"
//     ]
//   },
//   {
//     "short": "Mz",
//     "duplicates": true,
//     "name": {
//       "firstName": "Gesine",
//       "surname": "Mielitz"
//     },
//     "subjects": [
//       "Mus",
//       "Deu",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Na",
//     "name": {
//       "firstName": "Ahmad Abdoul",
//       "surname": "Nabi"
//     },
//     "subjects": [
//       "Deu",
//       "Phi"
//     ]
//   },
//   {
//     "short": "Ot",
//     "name": {
//       "firstName": "Christian",
//       "surname": "Ott"
//     },
//     "subjects": [
//       "Lat",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Px",
//     "name": {
//       "firstName": "Kathrin",
//       "surname": "Pax"
//     },
//     "subjects": [
//       "Frz",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Pou",
//     "name": {
//       "firstName": "Isabel",
//       "surname": "Pouwels"
//     },
//     "subjects": [
//       "Mat"
//     ]
//   },
//   {
//     "short": "Re",
//     "name": {
//       "firstName": "Mareike",
//       "surname": "Reffi"
//     },
//     "subjects": [
//       "Spa",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Rk",
//     "name": {
//       "firstName": "Thomas",
//       "surname": "Rieken"
//     },
//     "subjects": [
//       "Mat",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Ri",
//     "name": {
//       "firstName": "Amelie",
//       "surname": "Riemann"
//     },
//     "subjects": [
//       "Mat",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Sas",
//     "name": {
//       "firstName": "Dr. Imke",
//       "surname": "Sassen"
//     },
//     "subjects": [
//       "Deu",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Smi",
//     "name": {
//       "firstName": "Constanze",
//       "surname": "Schmidt"
//     },
//     "subjects": [
//       "Kun",
//       "The",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Sne",
//     "name": {
//       "firstName": "Damaris",
//       "surname": "Schneider"
//     },
//     "subjects": [
//       "Lat",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Sr",
//     "name": {
//       "firstName": "Frank",
//       "surname": "Schröder"
//     },
//     "subjects": [
//       "Mat",
//       "Phy",
//       "Inf",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Shö",
//     "name": {
//       "firstName": "Gunnar",
//       "surname": "Schöttke"
//     },
//     "subjects": [
//       "Bio",
//       "Spo",
//       "NuT"
//     ]
//   },
//   {
//     "short": "Sd",
//     "name": {
//       "firstName": "Christoph",
//       "surname": "Scholder"
//     },
//     "subjects": [
//       "Eng",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Sch",
//     "duplicates": true,
//     "name": {
//       "firstName": "Jan",
//       "surname": "Schulz"
//     },
//     "subjects": [
//       "Bio",
//       "Phi",
//       "Lat",
//       "NuT"
//     ]
//   },
//   {
//     "short": "Slz",
//     "name": {
//       "firstName": "Regina",
//       "surname": "Schulz"
//     },
//     "subjects": [
//       "Ges",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Sz",
//     "name": {
//       "firstName": "Tatjana",
//       "surname": "Schulz"
//     },
//     "subjects": [
//       "Eng",
//       "Spa"
//     ]
//   },
//   {
//     "short": "So",
//     "duplicates": true,
//     "name": {
//       "firstName": "Andreas",
//       "surname": "Sohr"
//     },
//     "subjects": [
//       "Che",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Sol",
//     "name": {
//       "firstName": "Annika",
//       "surname": "Soltau"
//     },
//     "subjects": [
//       "Bio",
//       "Che"
//     ]
//   },
//   {
//     "short": "Sg",
//     "name": {
//       "firstName": "Christian",
//       "surname": "Sonntag"
//     },
//     "subjects": [
//       "Geo",
//       "Mu"
//     ]
//   },
//   {
//     "short": "Stk",
//     "name": {
//       "firstName": "Mark",
//       "surname": "Sternke"
//     },
//     "subjects": [
//       "Deu",
//       "PGW",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Sto",
//     "name": {
//       "firstName": "Felix",
//       "surname": "Stobinsky"
//     },
//     "subjects": [
//       "Eng",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Str",
//     "name": {
//       "firstName": "Tilman",
//       "surname": "Streng"
//     },
//     "subjects": [
//       "Phi",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Swa",
//     "name": {
//       "firstName": "Katrin",
//       "surname": "Swawola"
//     },
//     "subjects": [
//       "Spa",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Te",
//     "name": {
//       "firstName": "Stephanie",
//       "surname": "Tegen"
//     },
//     "subjects": [
//       "Spo",
//       "Che"
//     ]
//   },
//   {
//     "short": "Tha",
//     "name": {
//       "firstName": "Marco",
//       "surname": "Thal"
//     },
//     "subjects": [
//       "Eng",
//       "Ges",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Tln",
//     "name": {
//       "firstName": "Luisa",
//       "surname": "Thelen"
//     },
//     "subjects": [
//       "Fra",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Tho",
//     "name": {
//       "firstName": "Frau Thomas"
//     },
//     "subjects": [
//       "Mat",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Tu",
//     "name": {
//       "firstName": "Sebastian",
//       "surname": "Thurau"
//     },
//     "subjects": [
//       "Mat",
//       "Phy",
//       "Inf"
//     ]
//   },
//   {
//     "short": "Ti",
//     "name": {
//       "firstName": "Jan",
//       "surname": "Tielemanns"
//     },
//     "subjects": [
//       "Phy",
//       "Spo"
//     ]
//   },
//   {
//     "short": "TH",
//     "name": {
//       "firstName": "Philipp",
//       "surname": "Tran-Huynh"
//     },
//     "subjects": [
//       "Eng",
//       "Ges",
//       "The",
//       "Wir",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Vw",
//     "name": {
//       "firstName": "Dagmar",
//       "surname": "Vowinckel"
//     },
//     "subjects": [
//       "Frz",
//       "Mus",
//       "Deu"
//     ]
//   },
//   {
//     "short": "WÖ",
//     "name": {
//       "firstName": "Dr. Nadine",
//       "surname": "Walter-Öhding"
//     },
//     "subjects": [
//       "Bio",
//       "Che"
//     ]
//   },
//   {
//     "short": "Wk",
//     "name": {
//       "firstName": "Jan-Philipp",
//       "surname": "Wecker"
//     },
//     "subjects": [
//       "Mat",
//       "PGW"
//     ]
//   },
//   {
//     "short": "We",
//     "duplicates": true,
//     "name": {
//       "firstName": "Dr. Dagny",
//       "surname": "Wegner"
//     },
//     "subjects": [
//       "Mat",
//       "Mus"
//     ]
//   },
//   {
//     "short": "Wg",
//     "name": {
//       "firstName": "Dr. Dagmar",
//       "surname": "Wegner"
//     },
//     "subjects": [
//       "Eng",
//       "Rel"
//     ]
//   },
//   {
//     "short": "Wei",
//     "name": {
//       "firstName": "Lukas",
//       "surname": "Weihe"
//     },
//     "subjects": [
//       "Mat",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Wh",
//     "name": {
//       "firstName": "Dr. Christine",
//       "surname": "Wesselhöft"
//     },
//     "subjects": [
//       "Deu",
//       "Frz"
//     ]
//   },
//   {
//     "short": "Ws",
//     "duplicates": true,
//     "name": {
//       "firstName": "Lena",
//       "surname": "Wilms"
//     },
//     "subjects": [
//       "Ma",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Wi",
//     "name": {
//       "firstName": "Maximilian",
//       "surname": "Wittwer"
//     },
//     "subjects": [
//       "Deu",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Wf",
//     "name": {
//       "firstName": "Catherina",
//       "surname": "Wolf"
//     },
//     "subjects": [
//       "Eng",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Wo",
//     "name": {
//       "firstName": "Susanne",
//       "surname": "Wolfinger"
//     },
//     "subjects": [
//       "Che",
//       "Eng",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Wu",
//     "name": {
//       "firstName": "Tim",
//       "surname": "Wuttig"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Wy",
//     "name": {
//       "firstName": "Dr. Vivien",
//       "surname": "Wysujack"
//     },
//     "subjects": [
//       "Deu",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Zi",
//     "duplicates": true,
//     "name": {
//       "firstName": "Lara",
//       "surname": "Zimmermann"
//     },
//     "subjects": [
//       "Spa",
//       "Frz",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Hm",
//     "name": {
//       "firstName": "Arne",
//       "surname": "Heinemann"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   }
// ];

// export const TEACHER_DATABASE_MEIENDORF: TeacherDatabase = [
//   {
//     "short": "Ah",
//     "name": {
//       "firstName": "Alm‑Hanke",
//       "surname": "Susanne"
//     },
//     "subjects": [
//       "Kun",
//       "Journalismus"
//     ]
//   },
//   {
//     "short": "Bak",
//     "name": {
//       "firstName": "Baker",
//       "surname": "Martina"
//     },
//     "subjects": [
//       "Eng",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Beh",
//     "name": {
//       "firstName": "Behncke",
//       "surname": "Maja"
//     },
//     "subjects": [
//       "Ges",
//       "PGW",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Bif",
//     "name": {
//       "firstName": "Bischoff",
//       "surname": "Annika"
//     },
//     "subjects": [
//       "Bio",
//       "Fra",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "Bm",
//     "duplicates": true,
//     "name": {
//       "firstName": "Bollmann",
//       "surname": "Klaus"
//     },
//     "subjects": [
//       "Ma",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Bor",
//     "name": {
//       "firstName": "Borchers",
//       "surname": "Isabell"
//     },
//     "subjects": [
//       "Kun",
//       "Deu",
//       "Film"
//     ]
//   },
//   {
//     "short": "Bt",
//     "name": {
//       "firstName": "Breckwoldt",
//       "surname": "Inge"
//     },
//     "subjects": [
//       "Eng",
//       "The",
//       "Ges",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Br",
//     "name": {
//       "firstName": "Brüchert",
//       "surname": "Gerd"
//     },
//     "subjects": [
//       "Ma",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Bru",
//     "name": {
//       "firstName": "Brune",
//       "surname": "Björn"
//     },
//     "subjects": [
//       "Ma",
//       "Phy"
//     ]
//   },
//   {
//     "short": "By",
//     "name": {
//       "firstName": "Bystryk",
//       "surname": "Ilona"
//     },
//     "subjects": [
//       "Deu",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Cb",
//     "name": {
//       "firstName": "Charbetge",
//       "surname": "Faten"
//     },
//     "subjects": [
//     ]
//   },
//   {
//     "short": "Chn",
//     "name": {
//       "firstName": "Christian",
//       "surname": "Timo"
//     },
//     "subjects": [
//       "Deu",
//       "Mu"
//     ]
//   },
//   {
//     "short": "Dam",
//     "name": {
//       "firstName": "Damrau‑Boy",
//       "surname": "Nils"
//     },
//     "subjects": [
//       "Ma",
//       "Bio"
//     ]
//   },
//   {
//     "short": "Ell",
//     "name": {
//       "firstName": "Ellenbürger",
//       "surname": "Thomas"
//     },
//     "subjects": [
//       "Eng",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Fk",
//     "name": {
//       "firstName": "Fernkorn",
//       "surname": "Lars"
//     },
//     "subjects": [
//       "Kun",
//       "Deu",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Fl",
//     "name": {
//       "firstName": "Flindt",
//       "surname": "Nina"
//     },
//     "subjects": [
//       "Eng",
//       "Ges",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Fß",
//     "name": {
//       "firstName": "Fliß",
//       "surname": "Jane"
//     },
//     "subjects": [
//       "Mu"
//     ]
//   },
//   {
//     "short": "Gc",
//     "name": {
//       "firstName": "Giczewski",
//       "surname": "Karol"
//     },
//     "subjects": [
//       "Eng",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Gtr",
//     "name": {
//       "firstName": "Günther",
//       "surname": "Lisa"
//     },
//     "subjects": [
//       "Deu",
//       "Ges",
//       "Psy",
//       "The"
//     ]
//   },
//   {
//     "short": "Gü",
//     "name": {
//       "firstName": "Günzel",
//       "surname": "Deborah"
//     },
//     "subjects": [
//       "Ma",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Gy",
//     "name": {
//       "firstName": "Gürsoy",
//       "surname": "Kudret"
//     },
//     "subjects": [
//       "Deu",
//       "Ges",
//       "Rel",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Hb",
//     "duplicates": true,
//     "name": {
//       "firstName": "Habib",
//       "surname": "Hosna"
//     },
//     "subjects": [
//       "Che",
//       "Kun",
//       "Phi"
//     ]
//   },
//   {
//     "short": "Ha",
//     "duplicates": true,
//     "name": {
//       "firstName": "Haut",
//       "surname": "Carolin"
//     },
//     "subjects": []
//   },
//   {
//     "short": "Hei",
//     "name": {
//       "firstName": "Heinemann",
//       "surname": "Arne"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Hü",
//     "name": {
//       "firstName": "Hübner",
//       "surname": "Manuel"
//     },
//     "subjects": [
//       "Eng",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Hus",
//     "duplicates": true,
//     "name": {
//       "firstName": "Hustedt",
//       "surname": "Ilka"
//     },
//     "subjects": [
//       "Eng",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Ht",
//     "name": {
//       "firstName": "Hutschenreiter",
//       "surname": "Claas"
//     },
//     "subjects": [
//       "Bio",
//       "Spo",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "Ja",
//     "name": {
//       "firstName": "Jabusch‑Herb",
//       "surname": "Verena"
//     },
//     "subjects": [
//       "Spo",
//       "Geo",
//       "The"
//     ]
//   },
//   {
//     "short": "Jar",
//     "name": {
//       "firstName": "Jander",
//       "surname": "Stefanie"
//     },
//     "subjects": [
//       "Ma",
//       "Bio",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "Juh",
//     "name": {
//       "firstName": "Juhl",
//       "surname": "Maja"
//     },
//     "subjects": [
//       "Deu",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Js",
//     "duplicates": true,
//     "name": {
//       "firstName": "Junghans",
//       "surname": "Mareike"
//     },
//     "subjects": [
//       "Spo",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Jt",
//     "name": {
//       "firstName": "Jütte",
//       "surname": "Vivian"
//     },
//     "subjects": [
//       "Eng",
//       "Deu"
//     ]
//   },
//   {
//     "short": "Kal",
//     "name": {
//       "firstName": "Kalbitz",
//       "surname": "Kirsten"
//     },
//     "subjects": [
//       "Ma",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Kl",
//     "name": {
//       "firstName": "Klein",
//       "surname": "Marie‑Anne"
//     },
//     "subjects": [
//       "Fra",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Ko",
//     "name": {
//       "firstName": "Koch",
//       "surname": "Florian"
//     },
//     "subjects": [
//       "Che",
//       "Inf",
//       "Bio",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "Kb",
//     "name": {
//       "firstName": "Kozlowski",
//       "surname": "Claudia"
//     },
//     "subjects": [
//       "Deu",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Krä",
//     "name": {
//       "firstName": "Krätzschmar",
//       "surname": "Anne‑Kristin"
//     },
//     "subjects": [
//       "Deu",
//       "Bio"
//     ]
//   },
//   {
//     "short": "Kr",
//     "duplicates": true,
//     "name": {
//       "firstName": "Krause",
//       "surname": "Tilman"
//     },
//     "subjects": [
//       "Bio",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Kg",
//     "name": {
//       "firstName": "Krüger",
//       "surname": "Heather"
//     },
//     "subjects": [
//       "Eng",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Kul",
//     "name": {
//       "firstName": "Kuhlmann",
//       "surname": "Christian"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Lk",
//     "name": {
//       "firstName": "Laake",
//       "surname": "Marie"
//     },
//     "subjects": [
//       "Rel",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Lae",
//     "name": {
//       "firstName": "Lammel",
//       "surname": "Amadea"
//     },
//     "subjects": [
//       "Deu",
//       "Ges",
//       "Italienisch"
//     ]
//   },
//   {
//     "short": "Lm",
//     "name": {
//       "firstName": "Lammers",
//       "surname": "Fabian"
//     },
//     "subjects": [
//       "Rel",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Lo",
//     "duplicates": true,
//     "name": {
//       "firstName": "Lohmann",
//       "surname": "Birgit"
//     },
//     "subjects": [
//       "Ges",
//       "Geo",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Lön",
//     "name": {
//       "firstName": "Lönnecker",
//       "surname": "Miriam"
//     },
//     "subjects": [
//       "Eng",
//       "PGW"
//     ]
//   },
//   {
//     "short": "Lük",
//     "name": {
//       "firstName": "Lücke",
//       "surname": "Armin"
//     },
//     "subjects": [
//       "Kun",
//       "PGW",
//       "The"
//     ]
//   },
//   {
//     "short": "Mai",
//     "name": {
//       "firstName": "Thao",
//       "surname": "Thanh"
//     },
//     "subjects": [
//       "Eng",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Mn",
//     "duplicates": true,
//     "name": {
//       "firstName": "Mansson",
//       "surname": "Lara"
//     },
//     "subjects": [
//       "Bio",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Man",
//     "name": {
//       "firstName": "Manteuffel",
//       "surname": "Mareike"
//     },
//     "subjects": [
//       "Deu",
//       "Phi"
//     ]
//   },
//   {
//     "short": "Mk",
//     "name": {
//       "firstName": "Marik",
//       "surname": "Miriam"
//     },
//     "subjects": [
//       "Mu",
//       "Rel"
//     ]
//   },
//   {
//     "short": "Mx",
//     "name": {
//       "firstName": "Marx",
//       "surname": "Wilfried"
//     },
//     "subjects": [
//       "Ma",
//       "Phy",
//       "The",
//       "Psy",
//       "Rel"
//     ]
//   },
//   {
//     "short": "Mr",
//     "name": {
//       "firstName": "Meixner‑Arango",
//       "surname": "Maria"
//     },
//     "subjects": [
//       "Eng",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Mz",
//     "duplicates": true,
//     "name": {
//       "firstName": "Menzel",
//       "surname": "Niels"
//     },
//     "subjects": [
//       "Deu",
//       "Phi"
//     ]
//   },
//   {
//     "short": "Mey",
//     "name": {
//       "firstName": "Meyer",
//       "surname": "Tilman"
//     },
//     "subjects": [
//       "Deu",
//       "Phi",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Mis",
//     "name": {
//       "firstName": "Mish",
//       "surname": "Carsten"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Mo",
//     "name": {
//       "firstName": "Morisse",
//       "surname": "Hauke"
//     },
//     "subjects": [
//       "Ma",
//       "Inf",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Mü",
//     "name": {
//       "firstName": "Mühleck",
//       "surname": "Johanna"
//     },
//     "subjects": [
//       "Bio",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Nä",
//     "name": {
//       "firstName": "Nädler",
//       "surname": "Ulrich"
//     },
//     "subjects": [
//       "Spa",
//       "Fra"
//     ]
//   },
//   {
//     "short": "Ng",
//     "name": {
//       "firstName": "Nagel",
//       "surname": "Philipp"
//     },
//     "subjects": [
//       "Geo",
//       "Spo"
//     ]
//   },
//   {
//     "short": "Nh",
//     "name": {
//       "firstName": "Nennhaus",
//       "surname": "Anne"
//     },
//     "subjects": [
//       "Eng",
//       "Ges",
//       "PGW",
//       "Psy"
//     ]
//   },
//   {
//     "short": "Pat",
//     "name": {
//       "firstName": "Patiño",
//       "surname": "Inés"
//     },
//     "subjects": [
//       "Spa",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Pf",
//     "name": {
//       "firstName": "Pfützenreuter",
//       "surname": "Torben"
//     },
//     "subjects": [
//       "Eng",
//       "Geo"
//     ]
//   },
//   {
//     "short": "Ph",
//     "name": {
//       "firstName": "Pham",
//       "surname": "James"
//     },
//     "subjects": [
//       "Eng",
//       "Mu"
//     ]
//   },
//   {
//     "short": "Plo",
//     "name": {
//       "firstName": "Plorin",
//       "surname": "Steffen"
//     },
//     "subjects": [
//       "Deu",
//       "Kun",
//       "Film"
//     ]
//   },
//   {
//     "short": "Rt",
//     "name": {
//       "firstName": "Zia",
//       "surname": "Ahmad"
//     },
//     "subjects": [
//       "Deu",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Ram",
//     "name": {
//       "firstName": "Rammé",
//       "surname": "Christian"
//     },
//     "subjects": [
//       "Phy",
//       "PGW",
//       "Inf"
//     ]
//   },
//   {
//     "short": "Rs",
//     "name": {
//       "firstName": "Rasi",
//       "surname": "Simona"
//     },
//     "subjects": [
//       "Eng",
//       "Italienisch"
//     ]
//   },
//   {
//     "short": "Rp",
//     "name": {
//       "firstName": "Ripp",
//       "surname": "Antje"
//     },
//     "subjects": [
//       "Ma",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Rm",
//     "name": {
//       "firstName": "Romppanen",
//       "surname": "Judith"
//     },
//     "subjects": [
//       "Deu",
//       "Phi",
//       "Psy"
//     ]
//   },
//   {
//     "short": "Ru",
//     "name": {
//       "firstName": "Runge",
//       "surname": "Tanja"
//     },
//     "subjects": [
//       "Deu",
//       "Eng"
//     ]
//   },
//   {
//     "short": "Sä",
//     "name": {
//       "firstName": "Sägert",
//       "surname": "Anja"
//     },
//     "subjects": [
//       "Ma",
//       "Bio",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "Sch",
//     "duplicates": true,
//     "name": {
//       "firstName": "Schatte",
//       "surname": "Cornelia"
//     },
//     "subjects": [
//       "Kun",
//       "Phy"
//     ]
//   },
//   {
//     "short": "Sc",
//     "name": {
//       "firstName": "Schleicher",
//       "surname": "Nadine"
//     },
//     "subjects": [
//       "Deu",
//       "Rel"
//     ]
//   },
//   {
//     "short": "Sh",
//     "name": {
//       "firstName": "Schmidt",
//       "surname": "Corinna"
//     },
//     "subjects": [
//       "Eng",
//       "Che"
//     ]
//   },
//   {
//     "short": "Sb",
//     "name": {
//       "firstName": "Schulenberg",
//       "surname": "Frauke"
//     },
//     "subjects": [
//       "Eng",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Sim",
//     "name": {
//       "firstName": "Siemering",
//       "surname": "Marc"
//     },
//     "subjects": [
//       "Ma",
//       "Inf"
//     ]
//   },
//   {
//     "short": "Spe",
//     "name": {
//       "firstName": "Specowius",
//       "surname": "Bernd"
//     },
//     "subjects": [
//       "Deu",
//       "Spo",
//       "The"
//     ]
//   },
//   {
//     "short": "So",
//     "duplicates": true,
//     "name": {
//       "firstName": "Stoia",
//       "surname": "Bianca‑Maria"
//     },
//     "subjects": [
//       "Spa"
//     ]
//   },
//   {
//     "short": "Sw",
//     "name": {
//       "firstName": "Swysen",
//       "surname": "Lennart"
//     },
//     "subjects": [
//       "Ma",
//       "Phy"
//     ]
//   },
//   {
//     "short": "The",
//     "name": {
//       "firstName": "Thobaben",
//       "surname": "Christian"
//     },
//     "subjects": [
//       "Deu",
//       "Mu"
//     ]
//   },
//   {
//     "short": "To",
//     "name": {
//       "firstName": "Thoene",
//       "surname": "Katharina"
//     },
//     "subjects": [
//       "Bio",
//       "Che",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "Tö",
//     "name": {
//       "firstName": "Töller",
//       "surname": "Sarah"
//     },
//     "subjects": [
//       "Deu",
//       "Mu"
//     ]
//   },
//   {
//     "short": "Tsc",
//     "name": {
//       "firstName": "Tschersich",
//       "surname": "Nicola"
//     },
//     "subjects": [
//       "Che",
//       "PGW",
//       "NaWi",
//       "Ges"
//     ]
//   },
//   {
//     "short": "Up",
//     "name": {
//       "firstName": "Urlapova",
//       "surname": "Marina"
//     },
//     "subjects": [
//       "Deu"
//     ]
//   },
//   {
//     "short": "Tro",
//     "name": {
//       "firstName": "von",
//       "surname": "Elisabeth"
//     },
//     "subjects": [
//       "Geo",
//       "Mu"
//     ]
//   },
//   {
//     "short": "Wb",
//     "name": {
//       "firstName": "Weber",
//       "surname": "Jürgen"
//     },
//     "subjects": [
//       "Ma",
//       "Spo",
//       "NaWi"
//     ]
//   },
//   {
//     "short": "We",
//     "duplicates": true,
//     "name": {
//       "firstName": "Weniger",
//       "surname": "Tanja"
//     },
//     "subjects": [
//       "Mu",
//       "Spa"
//     ]
//   },
//   {
//     "short": "Ws",
//     "duplicates": true,
//     "name": {
//       "firstName": "Westphal",
//       "surname": "Marina"
//     },
//     "subjects": [
//       "Bio",
//       "Che"
//     ]
//   },
//   {
//     "short": "Ze",
//     "name": {
//       "firstName": "Zepter",
//       "surname": "Simone"
//     },
//     "subjects": [
//       "Eng",
//       "Kun"
//     ]
//   },
//   {
//     "short": "Zi",
//     "duplicates": true,
//     "name": {
//       "firstName": "Zienowicz",
//       "surname": "Paul"
//     },
//     "subjects": [
//       "Ma",
//       "Phy",
//       "NaWi"
//     ]
//   }
// ];

// export const TEACHER_DATABASE_ARRAY: TeacherDatabase = [...TEACHER_DATABASE_GROOTMOOR, ...TEACHER_DATABASE_MEIENDORF];

// export const TEACHER_DATABASE: {
//   [key in School]: TeacherDatabase
// } = {
//   "Grootmoor": TEACHER_DATABASE_GROOTMOOR,
//   "Meiendorf": TEACHER_DATABASE_MEIENDORF
// }

// export const SCHOOL_COUNT = 2;

export function getColumnForSchool(school: School): number {
  return UserManagement.ALL_DATA!.schools.indexOf(school);
}

export function UNKNOWN_TEACHER(short: string): Teacher {
  return {
    short: short,
    name: {
      firstName: "Unknown",
      surname: "Teacher",
      fullName: "Unknown Teacher"
    },
    subjects: [],
    isUnknownTeacher: true,
    uuid: "0000000000000000000000000"
  };
}