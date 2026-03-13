import type { Substance } from '../types';

const EUD0 = 44e6; // Дж/кг — базовая удельная теплота сгорания для углеводородов

const s = (
  id: string, name: string, nameEn: string,
  cls: 1 | 2 | 3 | 4, alpha: number, cnkpr?: number, formula?: string
): Substance => ({
  id, name, nameEn, class: cls,
  alpha,
  EUD: alpha * EUD0,
  CNKPR: cnkpr,
  formula,
});

export const SUBSTANCES: Substance[] = [
  // Класс 1 — особо чувствительные
  s('acetylene',       'Ацетилен',           'Acetylene',        1, 1.10,  2.5,  'C₂H₂'),
  s('hydrogen',        'Водород',             'Hydrogen',         1, 2.73,  4.0,  'H₂'),
  s('ethylene',        'Этилен',              'Ethylene',         1, 1.07,  2.7,  'C₂H₄'),
  s('ethylene_oxide',  'Окись этилена',       'Ethylene oxide',   1, 0.62,  3.0,  'C₂H₄O'),
  s('hydrazine',       'Гидразин',            'Hydrazine',        1, 0.44,  4.7,  'N₂H₄'),
  s('methylacetylene', 'Метилацетилен',       'Methylacetylene',  1, 1.05,  1.7,  'C₃H₄'),
  s('vinylacetylene',  'Винилацетилен',       'Vinylacetylene',   1, 1.03,  1.5,  'C₄H₄'),
  s('propylene_oxide', 'Окись пропилена',     'Propylene oxide',  1, 0.70,  2.1,  'C₃H₆O'),
  s('nitromethane',    'Нитрометан',          'Nitromethane',     1, 0.25,  7.3,  'CH₃NO₂'),
  s('isopropylnitrate','Изопропилнитрат',     'Isopropylnitrate', 1, 0.41,  2.0),
  s('ethylnitrate',    'Этилнитрат',          'Ethylnitrate',     1, 0.30,  3.8),
  s('dimethyl_ether',  'Диметиловый эфир',    'Dimethyl ether',   1, 0.66,  3.4,  'C₂H₆O'),
  s('divinyl_ether',   'Дивиниловый эфир',    'Divinyl ether',    1, 0.77,  1.7),
  s('methylbutyl_eth', 'Метилбутиловый эфир', 'Methylbutyl ether',1, 0.77,  1.4),

  // Класс 2 — чувствительные
  s('propane',         'Пропан',              'Propane',          2, 1.00,  2.1,  'C₃H₈'),
  s('butane',          'Бутан',               'Butane',           2, 1.00,  1.8,  'C₄H₁₀'),
  s('ethane',          'Этан',                'Ethane',           2, 1.00,  3.0,  'C₂H₆'),
  s('propylene',       'Пропилен',            'Propylene',        2, 1.00,  2.0,  'C₃H₆'),
  s('butylene',        'Бутилен',             'Butylene',         2, 1.00,  1.6,  'C₄H₈'),
  s('butadiene',       'Бутадиен',            'Butadiene',        2, 1.00,  1.4,  'C₄H₆'),
  s('pentadiene_13',   '1,3-Пентадиен',       '1,3-Pentadiene',   2, 1.00,  2.0),
  s('acrylonitrile',   'Акрилонитрил',        'Acrylonitrile',    2, 0.67,  3.0,  'C₃H₃N'),
  s('acrolein',        'Акролеин',            'Acrolein',         2, 0.62,  2.8,  'C₃H₄O'),
  s('carbon_disulfide','Сероуглерод',          'Carbon disulfide', 2, 0.32,  1.0,  'CS₂'),
  s('diethyl_ether',   'Диэтиловый эфир',     'Diethyl ether',    2, 0.77,  1.9,  'C₄H₁₀O'),
  s('diisopropyl_eth', 'Диизопропиловый эфир','Diisopropyl ether',2, 0.82,  1.4),
  s('shflu',           'ШФЛУ',                'NGL',              2, 1.00,  1.8),
  s('dimethyl_ether2', 'Диметилэфир',         'Dimethyl ether',   2, 0.66,  3.4),

  // Класс 3 — среднечувствительные
  s('acetone',         'Ацетон',              'Acetone',          3, 0.65,  2.6,  'C₃H₆O'),
  s('hexane',          'Гексан',              'Hexane',           3, 1.00,  1.2,  'C₆H₁₄'),
  s('isooctane',       'Изооктан',            'Isooctane',        3, 1.00,  1.0),
  s('gasoline',        'Бензин',              'Gasoline',         3, 1.00,  1.1),
  s('heptane',         'Гептан',              'Heptane',          3, 1.00,  1.1,  'C₇H₁₆'),
  s('vinylchloride',   'Винилхлорид',         'Vinyl chloride',   3, 0.42,  3.6,  'C₂H₃Cl'),
  s('vinylacetate',    'Винилацетат',         'Vinyl acetate',    3, 0.51,  2.6),
  s('methylamine',     'Метиламин',           'Methylamine',      3, 0.70,  4.9,  'CH₅N'),
  s('methyl_ethyl_k',  'Метилэтилкетон',      'Methyl ethyl ketone',3,0.65, 1.8),
  s('octane',          'Октан',               'Octane',           3, 1.00,  1.0,  'C₈H₁₈'),
  s('pyridine',        'Пиридин',             'Pyridine',         3, 0.77,  1.8),
  s('hydrogen_sulfide','Сероводород',          'Hydrogen sulfide', 3, 0.34,  4.3,  'H₂S'),
  s('methanol',        'Метанол',             'Methanol',         3, 0.45,  6.7,  'CH₄O'),
  s('ethanol',         'Этанол',              'Ethanol',          3, 0.61,  3.3,  'C₂H₆O'),
  s('propanol',        'Пропанол',            'Propanol',         3, 0.69,  2.2),
  s('cyclohexane',     'Циклогексан',         'Cyclohexane',      3, 1.00,  1.3,  'C₆H₁₂'),
  s('acetaldehyde',    'Ацетальдегид',        'Acetaldehyde',     3, 0.56,  4.0,  'C₂H₄O'),
  s('cumene',          'Кумол',               'Cumene',           3, 0.84,  0.9),

  // Класс 4 — слабочувствительные
  s('methane',         'Метан',               'Methane',          4, 1.14,  5.0,  'CH₄'),
  s('benzene',         'Бензол',              'Benzene',          4, 1.00,  1.4,  'C₆H₆'),
  s('decane',          'Декан',               'Decane',           4, 1.00,  0.7,  'C₁₀H₂₂'),
  s('dodecane',        'Додекан',             'Dodecane',         4, 1.00,  0.6),
  s('toluene',         'Метилбензол (Толуол)','Toluene',          4, 1.00,  1.2,  'C₇H₈'),
  s('methylmercaptan', 'Метилмеркаптан',      'Methyl mercaptan', 4, 0.53,  3.9),
  s('carbon_monoxide', 'Окись углерода',      'Carbon monoxide',  4, 0.23, 12.5,  'CO'),
  s('dichloroethane',  'Дихлорэтан',          'Dichloroethane',   4, 0.24,  6.2),
  s('dichlorobenzene', 'Дихлорбензол',        'Dichlorobenzene',  4, 0.42,  2.2),
  s('methylchloride',  'Метилхлорид',         'Methyl chloride',  4, 0.12,  7.6,  'CH₃Cl'),
  s('trichloroethane', 'Трихлорэтан',         'Trichloroethane',  4, 0.14,  8.0),
];

export const getSubstanceById = (id: string): Substance | undefined =>
  SUBSTANCES.find(s => s.id === id);

export const SUBSTANCE_CLASS_LABELS: Record<number, string> = {
  1: 'Класс 1 — особо чувствительные',
  2: 'Класс 2 — чувствительные',
  3: 'Класс 3 — среднечувствительные',
  4: 'Класс 4 — слабочувствительные',
};

export const CONGESTION_LABELS: Record<number, { short: string; full: string }> = {
  1: { short: 'Класс I', full: 'Длинные трубы, полости, каверны с горючей смесью' },
  2: { short: 'Класс II', full: 'Сильно загроможденное: полузамкнутые объёмы, высокая плотность оборудования' },
  3: { short: 'Класс III', full: 'Средне загроможденное: отдельно стоящее оборудование, резервуарный парк' },
  4: { short: 'Класс IV', full: 'Слабо загроможденное и свободное пространство' },
};
