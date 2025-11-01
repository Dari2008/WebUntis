import type { School } from "../@types/School";
import type { TeacherDatabase } from "../@types/Teachers";

export const TEACHERS_PRESETS: {
    [key in School]: TeacherDatabase;
} = {
    "Grootmoor": [
        {
            "name": {
                "firstName": "Frau Adolphi"
            },
            "uuid": "6a96fd00-f3ee-430a-9958-883b6178c03a",
            "short": "Ad",
            "subjects": [
                "Mus",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Adolphs",
                "firstName": "Katharina"
            },
            "uuid": "9772318f-80dc-4953-a342-5e94d9ca220e",
            "short": "Ado",
            "subjects": [
                "Deu",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Baar",
                "firstName": "Rüdiger"
            },
            "uuid": "d34a54e9-2995-4bc0-a412-c15a19e70194",
            "short": "Ba",
            "subjects": [
                "Spo",
                "Ges",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Beck",
                "firstName": "Mareike"
            },
            "uuid": "044583b1-6c10-4ff7-83e4-84ed1de10cac",
            "short": "Bec",
            "subjects": [
                "Bio",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Becker",
                "firstName": "Swantje"
            },
            "uuid": "c0918fbf-f9fa-42be-8156-f1632d22751b",
            "short": "Bk",
            "subjects": [
                "Ma",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Berthold",
                "firstName": "Adrian"
            },
            "uuid": "5008215c-bb4f-4e4f-bfa3-0d567ce8f44b",
            "short": "Ber",
            "subjects": [
                "Bio",
                "NuT",
                "Phy",
                "Mat"
            ]
        },
        {
            "name": {
                "surname": "Blum",
                "firstName": "Svenja"
            },
            "uuid": "e05fcd87-f9b5-4cef-a3ba-ad49088f8d63",
            "short": "Bl",
            "subjects": [
                "Spa",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Breiholdt",
                "firstName": "Julia"
            },
            "uuid": "a46cb9ab-8721-435f-b4ba-29711746330a",
            "short": "Bre",
            "subjects": [
                "Eng",
                "PGW",
                "Wir"
            ]
        },
        {
            "name": {
                "surname": "Bromm",
                "firstName": "Timm"
            },
            "uuid": "2d74b359-72e9-4b1b-8044-9a0018cb0f52",
            "short": "Bm",
            "subjects": [
                "Mat",
                "Spo"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Ceynowa-Paus",
                "firstName": "Carla"
            },
            "uuid": "1047cb9d-e351-4801-b7c7-90eea15fa94f",
            "short": "CP",
            "subjects": [
                "Kun",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Colina",
                "firstName": "Susanne"
            },
            "uuid": "394886f9-19c8-4018-8790-356190afe864",
            "short": "Co",
            "subjects": [
                "Frz",
                "Ges",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Cornils-Dresbach",
                "firstName": "Dörte"
            },
            "uuid": "6fd9cac6-347a-4f45-9ee5-a6d839feeebd",
            "short": "Cor",
            "subjects": [
                "Bio",
                "Deu",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Danowski-Kirsch",
                "firstName": "Nico"
            },
            "uuid": "2cafe7b1-7ff4-4d00-9af3-a7890d26f50c",
            "short": "Dan",
            "subjects": [
                "PGW",
                "Phi"
            ]
        },
        {
            "name": {
                "surname": "Deisel",
                "firstName": "Christel"
            },
            "uuid": "d1c77272-0371-4560-a335-83f4154a11e3",
            "short": "Ds",
            "subjects": [
                "Eng",
                "The"
            ]
        },
        {
            "name": {
                "surname": "Diederich",
                "firstName": "Andrea"
            },
            "uuid": "0a5aaaf6-b9dd-4ec9-994c-f5661873b77d",
            "short": "Dh",
            "subjects": [
                "Deu",
                "Eng",
                "Spa",
                "The"
            ]
        },
        {
            "name": {
                "surname": "Diederich",
                "firstName": "Jens"
            },
            "uuid": "276a6191-a4f7-46e2-878a-a5addf02b83a",
            "short": "Di",
            "subjects": [
                "Mat",
                "Phy",
                "Inf"
            ]
        },
        {
            "name": {
                "firstName": "Herr Drews"
            },
            "uuid": "d4037318-79cc-4d1a-84ee-e578087ef86e",
            "short": "Dr",
            "subjects": [
                "Eng",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Ehlers",
                "firstName": "Clemens"
            },
            "uuid": "83327e96-c1a2-4931-9f72-dc0d750b904c",
            "short": "Es",
            "subjects": [
                "PGW",
                "Phi",
                "Rel",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Ehrenheim",
                "firstName": "Anika"
            },
            "uuid": "4f08d376-eb45-4c8f-8367-67b009a0d2df",
            "short": "Eh",
            "subjects": [
                "Eng",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Emeis",
                "firstName": "Kathrin"
            },
            "uuid": "ee1ca61a-3509-4b3b-8790-65f816950220",
            "short": "Em",
            "subjects": [
                "Deu",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Ernst",
                "firstName": "Hendrike"
            },
            "uuid": "87b6dd01-7adc-432d-abe8-4a03f7e3b9cb",
            "short": "Er",
            "subjects": [
                "Kun",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Fahrenholz",
                "firstName": "Birgit"
            },
            "uuid": "8f92b29d-e441-400a-b37c-3119301521d7",
            "short": "Fa",
            "subjects": [
                "Eng",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Forster",
                "firstName": "Sigrid"
            },
            "uuid": "98f6834a-a8f6-426e-99a3-f8db13520a17",
            "short": "Fo",
            "subjects": [
                "Spo",
                "Deu",
                "Bio"
            ]
        },
        {
            "name": {
                "surname": "García Quispe",
                "firstName": "Celina"
            },
            "uuid": "5c175709-0110-4f3a-b95e-17e0544ba21b",
            "short": "Ga",
            "subjects": [
                "Spa",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Gellermann",
                "firstName": "Dirk"
            },
            "uuid": "69e7175f-b78c-45a2-9240-b731dc7d19e4",
            "short": "Ge",
            "subjects": [
                "Bio",
                "Geo",
                "Inf"
            ]
        },
        {
            "name": {
                "surname": "Giffhorn",
                "firstName": "Lina"
            },
            "uuid": "96aa55a5-681d-4f17-a1cc-a3d4ff4c6906",
            "short": "Gi",
            "subjects": [
                "Deu",
                "Phi"
            ]
        },
        {
            "name": {
                "surname": "Grahlmann",
                "firstName": "Anna"
            },
            "uuid": "75e56550-c65e-4913-aa21-88ca704abfd4",
            "short": "Gm",
            "subjects": [
                "Eng",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Graß",
                "firstName": "Carlotta"
            },
            "uuid": "787ace3e-d93a-4203-8b77-13abbf09a22d",
            "short": "Gra",
            "subjects": [
                "Eng",
                "PGW",
                "Wir",
                "Frz"
            ]
        },
        {
            "name": {
                "surname": "Grauert",
                "firstName": "Wiebke"
            },
            "uuid": "2789eba9-c183-4255-b1a5-6f360137a172",
            "short": "Grt",
            "subjects": [
                "Ges",
                "PGW",
                "Phi",
                "Wir"
            ]
        },
        {
            "name": {
                "surname": "Halbach",
                "firstName": "Marion"
            },
            "uuid": "e9a914a8-e649-4d6e-9f1c-0cbec1d09898",
            "short": "Hlb",
            "subjects": [
                "Deu",
                "Frz"
            ]
        },
        {
            "name": {
                "surname": "Halenza",
                "firstName": "Heidi"
            },
            "uuid": "8eded481-4f4f-4a1a-b161-198a0aae788c",
            "short": "Hl",
            "subjects": [
                "Eng",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Harders",
                "firstName": "Jesko"
            },
            "uuid": "6e453565-eaa6-4726-9bae-1b90e83af75f",
            "short": "Hd",
            "subjects": [
                "Spo",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Hatten",
                "firstName": "Kerstin"
            },
            "uuid": "f18a640a-cab5-4685-9e3e-d6bfec397775",
            "short": "Ha",
            "subjects": [
                "Mat",
                "Phy"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Haubold",
                "firstName": "Annette"
            },
            "uuid": "ae40f2e0-819b-4547-8307-5917b3554f5b",
            "short": "Hau",
            "subjects": [
                "Ges",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Heidkamp",
                "firstName": "Dr. Marvin"
            },
            "uuid": "4a753080-c895-430d-ab3f-438d79891e37",
            "short": "Hk",
            "subjects": [
                "Mat",
                "Phy",
                "Inf",
                "NuT"
            ]
        },
        {
            "name": {
                "surname": "Herzog",
                "firstName": "Betina"
            },
            "uuid": "2f44b9b3-8701-4b75-983d-f1c4a0e3a968",
            "short": "Hzg",
            "subjects": [
                "Mat",
                "Spo",
                "Rel"
            ]
        },
        {
            "name": {
                "surname": "Hielscher",
                "firstName": "Jennifer"
            },
            "uuid": "ddf36e38-6a99-4c9d-9c6a-0a15091aac9d",
            "short": "Hi",
            "subjects": [
                "Deu",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Hillebrand",
                "firstName": "Dr. Almut"
            },
            "uuid": "d832943e-eca1-4009-b7b2-b18b4590f941",
            "short": "Hb",
            "subjects": [
                "Ges",
                "Rel"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Höger",
                "firstName": "Ralph"
            },
            "uuid": "2172f6ef-666d-4755-a9cc-56957a4fefcf",
            "short": "Hgr",
            "subjects": [
                "Eng",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Hölkemann",
                "firstName": "Dr. Barbara"
            },
            "uuid": "827ce981-be51-4f6a-9b3b-392093119734",
            "short": "Hö",
            "subjects": [
                "Mat",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Holmes",
                "firstName": "Sarah"
            },
            "uuid": "5fab1bcc-442d-498d-b559-1985ccfa4586",
            "short": "Hs",
            "subjects": [
                "Rel",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Huser-Jamil",
                "firstName": "Andreas"
            },
            "uuid": "87685dc7-d223-41ff-9f0b-c16d120ce562",
            "short": "Hus",
            "subjects": [
                "Geo",
                "Ges",
                "Phi",
                "Wir"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Hutschenreiter",
                "firstName": "Jana"
            },
            "uuid": "a85db302-c079-44de-bb02-07f3789ccbc3",
            "short": "Hut",
            "subjects": [
                "Spo",
                "Bio",
                "NuT"
            ]
        },
        {
            "name": {
                "surname": "Jäckle",
                "firstName": "Maren"
            },
            "uuid": "ed9c9c9b-3dd0-4a86-b145-4585288a61ed",
            "short": "Jä",
            "subjects": [
                "Spo",
                "Bio",
                "NuT",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Jasper",
                "firstName": "Philippa"
            },
            "uuid": "62762068-7bf2-43bd-b41f-253b682a805f",
            "short": "Jp",
            "subjects": [
                "Eng",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Jacobs",
                "firstName": "Gesche"
            },
            "uuid": "4e116737-9b1a-4838-bd60-c1b9aab40db0",
            "short": "Js",
            "subjects": [
                "Deu",
                "Ges"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Kerner",
                "firstName": "Conny"
            },
            "uuid": "60551a2e-ca09-484d-ba01-1ebf0b0d1e55",
            "short": "Kn",
            "subjects": [
                "Kun",
                "Bio",
                "NuT"
            ]
        },
        {
            "name": {
                "surname": "Klein",
                "firstName": "Hannes"
            },
            "uuid": "611376d1-1370-4bbc-bcee-7c7f5153841f",
            "short": "Kle",
            "subjects": [
                "Eng",
                "Mus"
            ]
        },
        {
            "name": {
                "surname": "Kley",
                "firstName": "Dorothee"
            },
            "uuid": "73b3ada5-53ed-4664-98ea-934a6ebde803",
            "short": "Kly",
            "subjects": [
                "Eng",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Köster",
                "firstName": "Annette"
            },
            "uuid": "3976a3c9-60cc-4d29-9ebe-4c17da20bded",
            "short": "Kö",
            "subjects": [
                "Deu",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Kruse",
                "firstName": "Lars"
            },
            "uuid": "5ddecad6-eac6-4f88-84fe-e08608c0a138",
            "short": "Kr",
            "subjects": [
                "Rel",
                "Deu"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Kubny",
                "firstName": "Nina"
            },
            "uuid": "33810a4e-791f-449f-aaba-f87752f85cec",
            "short": "Ky",
            "subjects": [
                "Che",
                "Bio"
            ]
        },
        {
            "name": {
                "surname": "Lange",
                "firstName": "Susanne"
            },
            "uuid": "80cbeb3e-12a1-4288-a816-6685fc1aa055",
            "short": "La",
            "subjects": [
                "Deu",
                "Ges",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Langhoff",
                "firstName": "Joanna"
            },
            "uuid": "372f7df7-06e9-4336-af43-5754248bfd9b",
            "short": "Lh",
            "subjects": [
                "Spa",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Lohmann",
                "firstName": "Andre"
            },
            "uuid": "3dd2c651-6a21-4869-8de6-fa38bf1417b3",
            "short": "Lo",
            "subjects": [
                "Deu",
                "Lat"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Marhenke",
                "firstName": "Frederik"
            },
            "uuid": "cafdc05e-2e63-4b49-8146-b05be918bca4",
            "short": "Mh",
            "subjects": [
                "Mus",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Marien",
                "firstName": "Birka"
            },
            "uuid": "9326f90a-bc13-42dd-96f6-64c0d14a3f68",
            "short": "Mn",
            "subjects": [
                "Mat",
                "Bio"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Massing",
                "firstName": "Nadja"
            },
            "uuid": "85d909f0-9332-4056-9471-1959a7a8472f",
            "short": "Mas",
            "subjects": [
                "Eng",
                "Deu",
                "Mat"
            ]
        },
        {
            "name": {
                "surname": "Mertins",
                "firstName": "Björn"
            },
            "uuid": "9693810d-c06f-4bad-9401-7dd9a432924a",
            "short": "Me",
            "subjects": [
                "Eng",
                "Mus",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Meyer",
                "firstName": "Sebastian"
            },
            "uuid": "2956d282-799c-4cc0-80f8-dc61655d9aa4",
            "short": "My",
            "subjects": [
                "Mat"
            ]
        },
        {
            "name": {
                "surname": "Mielitz",
                "firstName": "Gesine"
            },
            "uuid": "71a9806b-b23d-4fc9-b0b1-fe72c8a84d55",
            "short": "Mz",
            "subjects": [
                "Mus",
                "Deu",
                "Kun"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Nabi",
                "firstName": "Ahmad Abdoul"
            },
            "uuid": "ed8820d2-c00d-4acb-bee6-3693cf3e3e8f",
            "short": "Na",
            "subjects": [
                "Deu",
                "Phi"
            ]
        },
        {
            "name": {
                "surname": "Ott",
                "firstName": "Christian"
            },
            "uuid": "d67c7731-8b11-4730-898a-5eff40120bf1",
            "short": "Ot",
            "subjects": [
                "Lat",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Pax",
                "firstName": "Kathrin"
            },
            "uuid": "927ad902-c808-4cb1-b24c-6ca287609f94",
            "short": "Px",
            "subjects": [
                "Frz",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Pouwels",
                "firstName": "Isabel"
            },
            "uuid": "c04335e2-a9d0-432a-94db-b794b5e6eedf",
            "short": "Pou",
            "subjects": [
                "Mat"
            ]
        },
        {
            "name": {
                "surname": "Reffi",
                "firstName": "Mareike"
            },
            "uuid": "b91fea1e-23e1-42c4-86c8-1116a0b6e6ce",
            "short": "Re",
            "subjects": [
                "Spa",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Rieken",
                "firstName": "Thomas"
            },
            "uuid": "3150c867-672e-41f7-9b37-0d7b37a9d612",
            "short": "Rk",
            "subjects": [
                "Mat",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Riemann",
                "firstName": "Amelie"
            },
            "uuid": "2dc62998-38aa-4e96-ab22-82b03a508933",
            "short": "Ri",
            "subjects": [
                "Mat",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Sassen",
                "firstName": "Dr. Imke"
            },
            "uuid": "33059146-8c8a-48fd-a8cb-b766d6909db3",
            "short": "Sas",
            "subjects": [
                "Deu",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Schmidt",
                "firstName": "Constanze"
            },
            "uuid": "db9f1b47-a54b-4295-a419-c3d65b80320a",
            "short": "Smi",
            "subjects": [
                "Kun",
                "The",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Schneider",
                "firstName": "Damaris"
            },
            "uuid": "2d09f8f0-3db3-40d9-a457-7983563d3763",
            "short": "Sne",
            "subjects": [
                "Lat",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Schröder",
                "firstName": "Frank"
            },
            "uuid": "3d38836a-2613-4c43-9b0e-4390aa5de56d",
            "short": "Sr",
            "subjects": [
                "Mat",
                "Phy",
                "Inf",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Schöttke",
                "firstName": "Gunnar"
            },
            "uuid": "505c04b8-d65f-4001-aa55-119f9efcf032",
            "short": "Shö",
            "subjects": [
                "Bio",
                "Spo",
                "NuT"
            ]
        },
        {
            "name": {
                "surname": "Scholder",
                "firstName": "Christoph"
            },
            "uuid": "592003db-ba34-4797-85a7-991502de8656",
            "short": "Sd",
            "subjects": [
                "Eng",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Schulz",
                "firstName": "Jan"
            },
            "uuid": "b17062c7-6f7e-4296-9526-498ef03e6f06",
            "short": "Sch",
            "subjects": [
                "Bio",
                "Phi",
                "Lat",
                "NuT"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Schulz",
                "firstName": "Regina"
            },
            "uuid": "e6d88ccd-cf70-423a-ab8e-e7d4325dca9e",
            "short": "Slz",
            "subjects": [
                "Ges",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Schulz",
                "firstName": "Tatjana"
            },
            "uuid": "fbf61e4e-0259-4c7e-8115-3775f14a6b81",
            "short": "Sz",
            "subjects": [
                "Eng",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Sohr",
                "firstName": "Andreas"
            },
            "uuid": "4e3be0f7-fa6d-476f-963e-923af5a3e939",
            "short": "So",
            "subjects": [
                "Che",
                "Eng"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Soltau",
                "firstName": "Annika"
            },
            "uuid": "a97f8b18-e6b1-4977-9a91-f35f4f85df3b",
            "short": "Sol",
            "subjects": [
                "Bio",
                "Che"
            ]
        },
        {
            "name": {
                "surname": "Sonntag",
                "firstName": "Christian"
            },
            "uuid": "31eb9698-200f-47d7-b770-930e661cb3e9",
            "short": "Sg",
            "subjects": [
                "Geo",
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Sternke",
                "firstName": "Mark"
            },
            "uuid": "2a868ce3-8205-4fe1-9a8f-acce8b916dc5",
            "short": "Stk",
            "subjects": [
                "Deu",
                "PGW",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Stobinsky",
                "firstName": "Felix"
            },
            "uuid": "a0118d3c-5e25-4132-a651-e0f7d29376c2",
            "short": "Sto",
            "subjects": [
                "Eng",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Streng",
                "firstName": "Tilman"
            },
            "uuid": "656a2bf8-c67e-40dd-888b-71b494fb2936",
            "short": "Str",
            "subjects": [
                "Phi",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Swawola",
                "firstName": "Katrin"
            },
            "uuid": "0c9cf610-e7e6-470d-9ab1-adc50e2d51ad",
            "short": "Swa",
            "subjects": [
                "Spa",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Tegen",
                "firstName": "Stephanie"
            },
            "uuid": "ccdad686-b33c-4a9f-8806-9daef2e1d19d",
            "short": "Te",
            "subjects": [
                "Spo",
                "Che"
            ]
        },
        {
            "name": {
                "surname": "Thal",
                "firstName": "Marco"
            },
            "uuid": "dfc24536-6a53-4121-b982-7fba964a72db",
            "short": "Tha",
            "subjects": [
                "Eng",
                "Ges",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Thelen",
                "firstName": "Luisa"
            },
            "uuid": "544211b9-bfd9-41a9-a1e5-2f654e66cf7f",
            "short": "Tln",
            "subjects": [
                "Fra",
                "Ges"
            ]
        },
        {
            "name": {
                "firstName": "Frau Thomas"
            },
            "uuid": "a38f9bb9-5b71-4b92-936a-71d954b7f105",
            "short": "Tho",
            "subjects": [
                "Mat",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Thurau",
                "firstName": "Sebastian"
            },
            "uuid": "efba3a4c-4689-4ff6-a088-5cd7af27dd12",
            "short": "Tu",
            "subjects": [
                "Mat",
                "Phy",
                "Inf"
            ]
        },
        {
            "name": {
                "surname": "Tielemanns",
                "firstName": "Jan"
            },
            "uuid": "222996d3-1aa9-46bd-aff0-64ffecb1fa9c",
            "short": "Ti",
            "subjects": [
                "Phy",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Tran-Huynh",
                "firstName": "Philipp"
            },
            "uuid": "30f392bf-d422-4690-bcd5-682b1fb2ce33",
            "short": "TH",
            "subjects": [
                "Eng",
                "Ges",
                "The",
                "Wir",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Vowinckel",
                "firstName": "Dagmar"
            },
            "uuid": "8789f897-a885-479d-b442-126b1eadb1aa",
            "short": "Vw",
            "subjects": [
                "Frz",
                "Mus",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Walter-Öhding",
                "firstName": "Dr. Nadine"
            },
            "uuid": "78a3e013-1651-4b96-a738-d721ba915f6d",
            "short": "WÖ",
            "subjects": [
                "Bio",
                "Che"
            ]
        },
        {
            "name": {
                "surname": "Wecker",
                "firstName": "Jan-Philipp"
            },
            "uuid": "95526184-5f80-4345-acd1-4fc1cf517f00",
            "short": "Wk",
            "subjects": [
                "Mat",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Wegner",
                "firstName": "Dr. Dagny"
            },
            "uuid": "b2d078cc-d9c5-4f32-b857-7b2319b95f81",
            "short": "We",
            "subjects": [
                "Mat",
                "Mus"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Wegner",
                "firstName": "Dr. Dagmar"
            },
            "uuid": "1d358c57-4503-4caf-8b81-0cd1b5ecc773",
            "short": "Wg",
            "subjects": [
                "Eng",
                "Rel"
            ]
        },
        {
            "name": {
                "surname": "Weihe",
                "firstName": "Lukas"
            },
            "uuid": "8e84c05b-38fc-4994-9cdb-1460cb0690e0",
            "short": "Wei",
            "subjects": [
                "Mat",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Wesselhöft",
                "firstName": "Dr. Christine"
            },
            "uuid": "47f0543e-9bc4-407b-9059-b76cf1b2150a",
            "short": "Wh",
            "subjects": [
                "Deu",
                "Frz"
            ]
        },
        {
            "name": {
                "surname": "Wilms",
                "firstName": "Lena"
            },
            "uuid": "840c623f-9248-40c9-b070-055a929bd7a7",
            "short": "Ws",
            "subjects": [
                "Ma",
                "Phy"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Wittwer",
                "firstName": "Maximilian"
            },
            "uuid": "77cf9307-d94b-44a8-8fef-8a987c166844",
            "short": "Wi",
            "subjects": [
                "Deu",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Wolf",
                "firstName": "Catherina"
            },
            "uuid": "74b25633-b534-40f0-aa31-b4424caffecd",
            "short": "Wf",
            "subjects": [
                "Eng",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Wolfinger",
                "firstName": "Susanne"
            },
            "uuid": "d06c7b7b-41ab-4168-85a6-adec4d1d44ff",
            "short": "Wo",
            "subjects": [
                "Che",
                "Eng",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Wuttig",
                "firstName": "Tim"
            },
            "uuid": "2e7e1177-e5e0-49c6-b3e5-01365683dcca",
            "short": "Wu",
            "subjects": [
                "Eng",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Wysujack",
                "firstName": "Dr. Vivien"
            },
            "uuid": "58e14f58-32ba-410b-98fe-b32a13489b3f",
            "short": "Wy",
            "subjects": [
                "Deu",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Zimmermann",
                "firstName": "Lara"
            },
            "uuid": "30cecc95-0076-4ef1-baf9-657750474d8a",
            "short": "Zi",
            "subjects": [
                "Spa",
                "Frz",
                "Spo"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Heinemann",
                "firstName": "Arne"
            },
            "uuid": "e66e2bb0-ab72-48a8-a453-c45d7ec02dfe",
            "short": "Hm",
            "subjects": [
                "Eng",
                "Ges"
            ]
        }
    ],
    "Meiendorf": [
        {
            "name": {
                "surname": "Susanne",
                "firstName": "Alm‑Hanke"
            },
            "uuid": "b4e4f423-2097-4c38-991a-0d734c6dcf4e",
            "short": "Ah",
            "subjects": [
                "Kun",
                "Journalismus"
            ]
        },
        {
            "name": {
                "surname": "Martina",
                "firstName": "Baker"
            },
            "uuid": "8fbe55f0-0eb7-45e7-8531-95393596b7f7",
            "short": "Bak",
            "subjects": [
                "Eng",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Maja",
                "firstName": "Behncke"
            },
            "uuid": "8e1c9223-91b7-4795-b86d-99dd1bb64472",
            "short": "Beh",
            "subjects": [
                "Ges",
                "PGW",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Annika",
                "firstName": "Bischoff"
            },
            "uuid": "45362397-352a-47d4-89d3-31d6bab19ebb",
            "short": "Bif",
            "subjects": [
                "Bio",
                "Fra",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Klaus",
                "firstName": "Bollmann"
            },
            "uuid": "0285ced7-34e3-44c0-9c13-17e3b1f37dda",
            "short": "Bm",
            "subjects": [
                "Ma",
                "Eng"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Isabell",
                "firstName": "Borchers"
            },
            "uuid": "4298b043-6313-43f7-9112-564f4318df62",
            "short": "Bor",
            "subjects": [
                "Kun",
                "Deu",
                "Film"
            ]
        },
        {
            "name": {
                "surname": "Inge",
                "firstName": "Breckwoldt"
            },
            "uuid": "719b852b-747c-497e-9b4d-1836e2aa3a19",
            "short": "Bt",
            "subjects": [
                "Eng",
                "The",
                "Ges",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Gerd",
                "firstName": "Brüchert"
            },
            "uuid": "149ec879-a567-460b-b94c-cb007121a998",
            "short": "Br",
            "subjects": [
                "Ma",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Björn",
                "firstName": "Brune"
            },
            "uuid": "e31fbb06-fe01-4823-abf7-561e551466e0",
            "short": "Bru",
            "subjects": [
                "Ma",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Ilona",
                "firstName": "Bystryk"
            },
            "uuid": "1d09550e-f267-4f07-9530-317c841f91e7",
            "short": "By",
            "subjects": [
                "Deu",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Faten",
                "firstName": "Charbetge"
            },
            "uuid": "03e813bf-e260-425b-8dfc-44c8e65a223b",
            "short": "Cb",
            "subjects": []
        },
        {
            "name": {
                "surname": "Timo",
                "firstName": "Christian"
            },
            "uuid": "3082ad83-ce07-4bd3-8e71-b3714906117d",
            "short": "Chn",
            "subjects": [
                "Deu",
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Nils",
                "firstName": "Damrau‑Boy"
            },
            "uuid": "c8dcf7b3-5f24-4011-b7a6-1185d29cf26f",
            "short": "Dam",
            "subjects": [
                "Ma",
                "Bio"
            ]
        },
        {
            "name": {
                "surname": "Thomas",
                "firstName": "Ellenbürger"
            },
            "uuid": "03be506f-2087-477e-a7e2-5d093efd1ff6",
            "short": "Ell",
            "subjects": [
                "Eng",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Lars",
                "firstName": "Fernkorn"
            },
            "uuid": "4a1325cb-cd48-4296-bdc8-97a3145430b4",
            "short": "Fk",
            "subjects": [
                "Kun",
                "Deu",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Nina",
                "firstName": "Flindt"
            },
            "uuid": "3042e008-83bc-45de-a922-37e46a97f76e",
            "short": "Fl",
            "subjects": [
                "Eng",
                "Ges",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Jane",
                "firstName": "Fliß"
            },
            "uuid": "41a5015d-1de3-47d9-b2d1-4b70a022cac0",
            "short": "Fß",
            "subjects": [
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Karol",
                "firstName": "Giczewski"
            },
            "uuid": "17d137d5-094e-4dd6-9b32-0291d3365137",
            "short": "Gc",
            "subjects": [
                "Eng",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Lisa",
                "firstName": "Günther"
            },
            "uuid": "ef28d92d-1cc3-43f6-b453-ba92462f5130",
            "short": "Gtr",
            "subjects": [
                "Deu",
                "Ges",
                "Psy",
                "The"
            ]
        },
        {
            "name": {
                "surname": "Deborah",
                "firstName": "Günzel"
            },
            "uuid": "adfca865-d983-4436-8462-8a6f2cdc6bd7",
            "short": "Gü",
            "subjects": [
                "Ma",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Kudret",
                "firstName": "Gürsoy"
            },
            "uuid": "115dbcc2-ec01-4615-baa9-27d70dec7788",
            "short": "Gy",
            "subjects": [
                "Deu",
                "Ges",
                "Rel",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Hosna",
                "firstName": "Habib"
            },
            "uuid": "daedff15-a95d-46ea-93c1-331a3db7c331",
            "short": "Hb",
            "subjects": [
                "Che",
                "Kun",
                "Phi"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Carolin",
                "firstName": "Haut"
            },
            "uuid": "497ce7b6-952b-4bca-b6b9-cd2919a58c1a",
            "short": "Ha",
            "subjects": [],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Arne",
                "firstName": "Heinemann"
            },
            "uuid": "2ef7eb86-5879-4ea3-a455-685e9c7e77ec",
            "short": "Hei",
            "subjects": [
                "Eng",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Manuel",
                "firstName": "Hübner"
            },
            "uuid": "97a29822-c0fa-487b-8960-cf41c3db6d72",
            "short": "Hü",
            "subjects": [
                "Eng",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Ilka",
                "firstName": "Hustedt"
            },
            "uuid": "ab931247-5701-47f9-bc8d-f8f04a3c850d",
            "short": "Hus",
            "subjects": [
                "Eng",
                "Spa"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Claas",
                "firstName": "Hutschenreiter"
            },
            "uuid": "f3c37afd-6c08-4e49-b8e0-e853fe36da6f",
            "short": "Ht",
            "subjects": [
                "Bio",
                "Spo",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Verena",
                "firstName": "Jabusch‑Herb"
            },
            "uuid": "dd187103-f25a-4371-917c-cd75a8f7a886",
            "short": "Ja",
            "subjects": [
                "Spo",
                "Geo",
                "The"
            ]
        },
        {
            "name": {
                "surname": "Stefanie",
                "firstName": "Jander"
            },
            "uuid": "422b02dc-6a71-41e7-adac-7178f5d75d99",
            "short": "Jar",
            "subjects": [
                "Ma",
                "Bio",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Maja",
                "firstName": "Juhl"
            },
            "uuid": "87afd5d4-7627-4ac1-b85a-7d3a8121dd47",
            "short": "Juh",
            "subjects": [
                "Deu",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Mareike",
                "firstName": "Junghans"
            },
            "uuid": "0992e956-5a74-4514-b974-9dfdf53ddc30",
            "short": "Js",
            "subjects": [
                "Spo",
                "Spa"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Vivian",
                "firstName": "Jütte"
            },
            "uuid": "78526b2b-f0cd-43ef-a914-4b8e3739f22f",
            "short": "Jt",
            "subjects": [
                "Eng",
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Kirsten",
                "firstName": "Kalbitz"
            },
            "uuid": "a03e6056-90fa-4ad3-904f-f5a0e22b974d",
            "short": "Kal",
            "subjects": [
                "Ma",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Marie‑Anne",
                "firstName": "Klein"
            },
            "uuid": "387d4564-29a9-4283-bea0-6d87c0ad0b63",
            "short": "Kl",
            "subjects": [
                "Fra",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Florian",
                "firstName": "Koch"
            },
            "uuid": "7509d9be-9cd4-4675-ae20-749b7a5ce622",
            "short": "Ko",
            "subjects": [
                "Che",
                "Inf",
                "Bio",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Claudia",
                "firstName": "Kozlowski"
            },
            "uuid": "8ac852a3-b450-4e44-95df-b7457e1f9226",
            "short": "Kb",
            "subjects": [
                "Deu",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Anne‑Kristin",
                "firstName": "Krätzschmar"
            },
            "uuid": "1e3247cb-6f17-4c8a-9d1a-d1b16528032c",
            "short": "Krä",
            "subjects": [
                "Deu",
                "Bio"
            ]
        },
        {
            "name": {
                "surname": "Tilman",
                "firstName": "Krause"
            },
            "uuid": "6a578e2a-0266-47e5-a7bd-e7c678f2400a",
            "short": "Kr",
            "subjects": [
                "Bio",
                "Geo"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Heather",
                "firstName": "Krüger"
            },
            "uuid": "4a9ac8f0-dd14-417b-ba6c-abf1b67e8e2a",
            "short": "Kg",
            "subjects": [
                "Eng",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Christian",
                "firstName": "Kuhlmann"
            },
            "uuid": "a44f32ba-9f5f-4c13-bf59-114cdc1c0733",
            "short": "Kul",
            "subjects": [
                "Eng",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Marie",
                "firstName": "Laake"
            },
            "uuid": "acc63817-3616-4b9d-8e26-accf536d17f1",
            "short": "Lk",
            "subjects": [
                "Rel",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Amadea",
                "firstName": "Lammel"
            },
            "uuid": "0b0cfac2-a833-4651-8aea-8c4973573223",
            "short": "Lae",
            "subjects": [
                "Deu",
                "Ges",
                "Italienisch"
            ]
        },
        {
            "name": {
                "surname": "Fabian",
                "firstName": "Lammers"
            },
            "uuid": "ec9209e2-0292-486a-92b9-ac79526cf42e",
            "short": "Lm",
            "subjects": [
                "Rel",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Birgit",
                "firstName": "Lohmann"
            },
            "uuid": "aeb7c43c-a02b-4945-a16b-668cb2da4618",
            "short": "Lo",
            "subjects": [
                "Ges",
                "Geo",
                "PGW"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Miriam",
                "firstName": "Lönnecker"
            },
            "uuid": "f6573010-d1c7-4d1d-b83b-4ea30e2fcf43",
            "short": "Lön",
            "subjects": [
                "Eng",
                "PGW"
            ]
        },
        {
            "name": {
                "surname": "Armin",
                "firstName": "Lücke"
            },
            "uuid": "b3a2a570-5109-402a-b680-1cfa0d17031a",
            "short": "Lük",
            "subjects": [
                "Kun",
                "PGW",
                "The"
            ]
        },
        {
            "name": {
                "surname": "Thanh",
                "firstName": "Thao"
            },
            "uuid": "94a375d0-c61a-46f0-929a-249808da43ed",
            "short": "Mai",
            "subjects": [
                "Eng",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Lara",
                "firstName": "Mansson"
            },
            "uuid": "ab5f32b5-3c17-4128-9e71-41e99b18bc82",
            "short": "Mn",
            "subjects": [
                "Bio",
                "Eng"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Mareike",
                "firstName": "Manteuffel"
            },
            "uuid": "cc9dbb10-edeb-4c68-8669-15f1f3738785",
            "short": "Man",
            "subjects": [
                "Deu",
                "Phi"
            ]
        },
        {
            "name": {
                "surname": "Miriam",
                "firstName": "Marik"
            },
            "uuid": "17ee26c7-7374-4afc-91b9-3e95fb0bcf5d",
            "short": "Mk",
            "subjects": [
                "Mu",
                "Rel"
            ]
        },
        {
            "name": {
                "surname": "Wilfried",
                "firstName": "Marx"
            },
            "uuid": "839772c7-ebc8-48f6-9521-98d366690a2d",
            "short": "Mx",
            "subjects": [
                "Ma",
                "Phy",
                "The",
                "Psy",
                "Rel"
            ]
        },
        {
            "name": {
                "surname": "Maria",
                "firstName": "Meixner‑Arango"
            },
            "uuid": "b3bec15f-736e-4749-838f-6ac511959d3b",
            "short": "Mr",
            "subjects": [
                "Eng",
                "Spa"
            ]
        },
        {
            "name": {
                "surname": "Niels",
                "firstName": "Menzel"
            },
            "uuid": "68be62a4-72a0-4f2b-9659-fe30410f53f4",
            "short": "Mz",
            "subjects": [
                "Deu",
                "Phi"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Tilman",
                "firstName": "Meyer"
            },
            "uuid": "6456d4f7-cd62-41ad-903e-9fd33c4bb839",
            "short": "Mey",
            "subjects": [
                "Deu",
                "Phi",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Carsten",
                "firstName": "Mish"
            },
            "uuid": "352f65b3-0e66-4c7c-b4d8-943eb37e03c7",
            "short": "Mis",
            "subjects": [
                "Eng",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Hauke",
                "firstName": "Morisse"
            },
            "uuid": "894fa19d-78df-490f-a793-5024d01c6abe",
            "short": "Mo",
            "subjects": [
                "Ma",
                "Inf",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Johanna",
                "firstName": "Mühleck"
            },
            "uuid": "a310710f-9141-4304-a721-2cd36d35a8de",
            "short": "Mü",
            "subjects": [
                "Bio",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "Ulrich",
                "firstName": "Nädler"
            },
            "uuid": "8d0117b2-164c-4687-b711-ec34a1d0242d",
            "short": "Nä",
            "subjects": [
                "Spa",
                "Fra"
            ]
        },
        {
            "name": {
                "surname": "Philipp",
                "firstName": "Nagel"
            },
            "uuid": "8154c0bc-65e6-4985-b05b-517eaa3526ef",
            "short": "Ng",
            "subjects": [
                "Geo",
                "Spo"
            ]
        },
        {
            "name": {
                "surname": "Anne",
                "firstName": "Nennhaus"
            },
            "uuid": "d8cd7fec-5c62-4ed4-83e9-693e256ea81c",
            "short": "Nh",
            "subjects": [
                "Eng",
                "Ges",
                "PGW",
                "Psy"
            ]
        },
        {
            "name": {
                "surname": "Inés",
                "firstName": "Patiño"
            },
            "uuid": "da9bead3-9055-41e8-861d-3fa2505e0039",
            "short": "Pat",
            "subjects": [
                "Spa",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Torben",
                "firstName": "Pfützenreuter"
            },
            "uuid": "207ad6a4-9f95-4ae4-8611-65b5a1c5257c",
            "short": "Pf",
            "subjects": [
                "Eng",
                "Geo"
            ]
        },
        {
            "name": {
                "surname": "James",
                "firstName": "Pham"
            },
            "uuid": "79413db5-29d7-4174-ab42-856cf3ae192c",
            "short": "Ph",
            "subjects": [
                "Eng",
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Steffen",
                "firstName": "Plorin"
            },
            "uuid": "6abcdc66-c73b-4b60-8274-bff0c11c0e6a",
            "short": "Plo",
            "subjects": [
                "Deu",
                "Kun",
                "Film"
            ]
        },
        {
            "name": {
                "surname": "Ahmad",
                "firstName": "Zia"
            },
            "uuid": "6c47fc94-6ad3-4908-aecd-5bcff94ceeb2",
            "short": "Rt",
            "subjects": [
                "Deu",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Christian",
                "firstName": "Rammé"
            },
            "uuid": "866c8cc5-cfab-46bb-8150-54e79a63494e",
            "short": "Ram",
            "subjects": [
                "Phy",
                "PGW",
                "Inf"
            ]
        },
        {
            "name": {
                "surname": "Simona",
                "firstName": "Rasi"
            },
            "uuid": "58f8fb06-caca-4ac7-b882-c3e2c2423d7f",
            "short": "Rs",
            "subjects": [
                "Eng",
                "Italienisch"
            ]
        },
        {
            "name": {
                "surname": "Antje",
                "firstName": "Ripp"
            },
            "uuid": "5a3a8c8f-cca2-4f77-90f6-8334d4df9ddc",
            "short": "Rp",
            "subjects": [
                "Ma",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Judith",
                "firstName": "Romppanen"
            },
            "uuid": "e63ba79d-4f63-4560-95ab-7ab812833921",
            "short": "Rm",
            "subjects": [
                "Deu",
                "Phi",
                "Psy"
            ]
        },
        {
            "name": {
                "surname": "Tanja",
                "firstName": "Runge"
            },
            "uuid": "02423745-c825-42ed-9074-21902de19258",
            "short": "Ru",
            "subjects": [
                "Deu",
                "Eng"
            ]
        },
        {
            "name": {
                "surname": "Anja",
                "firstName": "Sägert"
            },
            "uuid": "6cc0fd49-7788-40ac-8505-2f054cb938c2",
            "short": "Sä",
            "subjects": [
                "Ma",
                "Bio",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Cornelia",
                "firstName": "Schatte"
            },
            "uuid": "bffcdc81-5e45-40bf-a586-c7803eef0330",
            "short": "Sch",
            "subjects": [
                "Kun",
                "Phy"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Nadine",
                "firstName": "Schleicher"
            },
            "uuid": "2ae92927-df5e-42e3-a66c-e5aaea97e240",
            "short": "Sc",
            "subjects": [
                "Deu",
                "Rel"
            ]
        },
        {
            "name": {
                "surname": "Corinna",
                "firstName": "Schmidt"
            },
            "uuid": "792558f1-c6bc-4466-9651-f743380bf8d8",
            "short": "Sh",
            "subjects": [
                "Eng",
                "Che"
            ]
        },
        {
            "name": {
                "surname": "Frauke",
                "firstName": "Schulenberg"
            },
            "uuid": "3ebdc0a2-8b0a-4349-96ca-1cac1084c778",
            "short": "Sb",
            "subjects": [
                "Eng",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Marc",
                "firstName": "Siemering"
            },
            "uuid": "dd8d4c48-e674-485e-86d6-98dbc7d4b67b",
            "short": "Sim",
            "subjects": [
                "Ma",
                "Inf"
            ]
        },
        {
            "name": {
                "surname": "Bernd",
                "firstName": "Specowius"
            },
            "uuid": "4925cd28-60f0-49d4-b7cd-e4688190e718",
            "short": "Spe",
            "subjects": [
                "Deu",
                "Spo",
                "The"
            ]
        },
        {
            "name": {
                "surname": "Bianca‑Maria",
                "firstName": "Stoia"
            },
            "uuid": "b46fc88a-0a40-4942-b31c-6fdc666ede0b",
            "short": "So",
            "subjects": [
                "Spa"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Lennart",
                "firstName": "Swysen"
            },
            "uuid": "9984d902-c61a-49fa-bfa9-900b632fb4f8",
            "short": "Sw",
            "subjects": [
                "Ma",
                "Phy"
            ]
        },
        {
            "name": {
                "surname": "Christian",
                "firstName": "Thobaben"
            },
            "uuid": "ba5a9c4c-4e82-4ae1-b5e7-a3cbfc16d0f2",
            "short": "The",
            "subjects": [
                "Deu",
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Katharina",
                "firstName": "Thoene"
            },
            "uuid": "af46f3fc-236b-4d6a-ad08-4592ee90898c",
            "short": "To",
            "subjects": [
                "Bio",
                "Che",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Sarah",
                "firstName": "Töller"
            },
            "uuid": "4c730a27-b5df-4355-8902-9755a5855295",
            "short": "Tö",
            "subjects": [
                "Deu",
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Nicola",
                "firstName": "Tschersich"
            },
            "uuid": "4d050e8d-910b-4886-8376-e8f1dc934bfa",
            "short": "Tsc",
            "subjects": [
                "Che",
                "PGW",
                "NaWi",
                "Ges"
            ]
        },
        {
            "name": {
                "surname": "Marina",
                "firstName": "Urlapova"
            },
            "uuid": "6bad1f15-ab22-4db0-98cb-e7297cbcc09d",
            "short": "Up",
            "subjects": [
                "Deu"
            ]
        },
        {
            "name": {
                "surname": "Elisabeth",
                "firstName": "von"
            },
            "uuid": "7987a3e3-43f1-48a8-9bd4-57edcb516ce3",
            "short": "Tro",
            "subjects": [
                "Geo",
                "Mu"
            ]
        },
        {
            "name": {
                "surname": "Jürgen",
                "firstName": "Weber"
            },
            "uuid": "b1f06fe2-b08e-475d-a309-c9e85ab116fb",
            "short": "Wb",
            "subjects": [
                "Ma",
                "Spo",
                "NaWi"
            ]
        },
        {
            "name": {
                "surname": "Tanja",
                "firstName": "Weniger"
            },
            "uuid": "98340c67-5287-4e09-8ce8-2130f1c89116",
            "short": "We",
            "subjects": [
                "Mu",
                "Spa"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Marina",
                "firstName": "Westphal"
            },
            "uuid": "de43a988-b890-4eaf-abf1-ea3fc9479696",
            "short": "Ws",
            "subjects": [
                "Bio",
                "Che"
            ],
            "duplicates": true
        },
        {
            "name": {
                "surname": "Simone",
                "firstName": "Zepter"
            },
            "uuid": "d8d46b22-2782-4883-a3b6-c1af4e85add4",
            "short": "Ze",
            "subjects": [
                "Eng",
                "Kun"
            ]
        },
        {
            "name": {
                "surname": "Paul",
                "firstName": "Zienowicz"
            },
            "uuid": "9b33774a-8658-4000-b52e-ad99d7ad70c6",
            "short": "Zi",
            "subjects": [
                "Ma",
                "Phy",
                "NaWi"
            ],
            "duplicates": true
        }
    ]
};