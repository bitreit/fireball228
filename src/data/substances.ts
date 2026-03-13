import type { Substance } from '../types';

const EUD0 = 44e6;

const s = (
  id: string, name: string, nameEn: string,
  cls: 1 | 2 | 3 | 4, alpha: number, cnkpr?: number, formula?: string, sigma?: number
): Substance => ({
  id, name, nameEn, class: cls,
  alpha, EUD: alpha * EUD0, CNKPR: cnkpr, formula, sigma,
});

export const SUBSTANCES: Substance[] = [
  // Класс 1 — особо чувствительные
  s('acetylene',       'Ацетилен',           'Acetylene',        1, 1.10,  2.5,  'C₂H₂',   8.0),
  s('hydrogen',        'Водород',             'Hydrogen',         1, 2.73,  4.0,  'H₂',      6.9),
  s('ethylene',        'Этилен',              'Ethylene',         1, 1.07,  2.7,  'C₂H₄',   8.2),
  s('ethylene_oxide',  'Окись этилена',       'Ethylene oxide',   1, 0.62,  3.0,  'C₂H₄O',  8.2),
  s('hydrazine',       'Гидразин',            'Hydrazine',        1, 0.44,  4.7,  'N₂H₄',   7.0),
  s('methylacetylene', 'Метилацетилен',       'Methylacetylene',  1, 1.05,  1.7,  'C₃H₄',   8.0),
  s('vinylacetylene',  'Винилацетилен',       'Vinylacetylene',   1, 1.03,  1.5,  'C₄H₄',   8.0),
  s('propylene_oxide', 'Окись пропилена',     'Propylene oxide',  1, 0.70,  2.1,  'C₃H₆O',  7.9),
  s('nitromethane',    'Нитрометан',          'Nitromethane',     1, 0.25,  7.3,  'CH₃NO₂', 7.0),
  s('isopropylnitrate','Изопропилнитрат',     'Isopropylnitrate', 1, 0.41,  2.0,  undefined, 7.0),
  s('ethylnitrate',    'Этилнитрат',          'Ethylnitrate',     1, 0.30,  3.8,  undefined, 7.0),
  s('dimethyl_ether',  'Диметиловый эфир',    'Dimethyl ether',   1, 0.66,  3.4,  'C₂H₆O',  7.6),
  s('divinyl_ether',   'Дивиниловый эфир',    'Divinyl ether',    1, 0.77,  1.7,  undefined, 7.8),
  s('methylbutyl_eth', 'Метилбутиловый эфир', 'Methylbutyl ether',1, 0.77,  1.4,  undefined, 7.9),

  // Класс 2 — чувствительные
  s('propane',         'Пропан',              'Propane',          2, 1.00,  2.1,  'C₃H₈',   8.0),
  s('butane',          'Бутан',               'Butane',           2, 1.00,  1.8,  'C₄H₁₀',  8.0),
  s('ethane',          'Этан',                'Ethane',           2, 1.00,  3.0,  'C₂H₆',   7.9),
  s('propylene',       'Пропилен',            'Propylene',        2, 1.00,  2.0,  'C₃H₆',   8.1),
  s('butylene',        'Бутилен',             'Butylene',         2, 1.00,  1.6,  'C₄H₈',   8.1),
  s('butadiene',       'Бутадиен',            'Butadiene',        2, 1.00,  1.4,  'C₄H₆',   8.0),
  s('pentadiene_13',   '1,3-Пентадиен',       '1,3-Pentadiene',   2, 1.00,  2.0,  undefined, 8.0),
  s('acrylonitrile',   'Акрилонитрил',        'Acrylonitrile',    2, 0.67,  3.0,  'C₃H₃N',  7.5),
  s('acrolein',        'Акролеин',            'Acrolein',         2, 0.62,  2.8,  'C₃H₄O',  7.5),
  s('carbon_disulfide','Сероуглерод',          'Carbon disulfide', 2, 0.32,  1.0,  'CS₂',    6.0),
  s('diethyl_ether',   'Диэтиловый эфир',     'Diethyl ether',    2, 0.77,  1.9,  'C₄H₁₀O', 7.7),
  s('diisopropyl_eth', 'Диизопропиловый эфир','Diisopropyl ether',2, 0.82,  1.4,  undefined, 7.9),
  s('shflu',           'ШФЛУ',                'NGL',              2, 1.00,  1.8,  undefined, 8.0),
  s('dimethyl_ether2', 'Диметилэфир',         'Dimethyl ether',   2, 0.66,  3.4,  undefined, 7.6),

  // Класс 3 — среднечувствительные
  s('acetone',         'Ацетон',              'Acetone',          3, 0.65,  2.6,  'C₃H₆O',  7.9),
  s('hexane',          'Гексан',              'Hexane',           3, 1.00,  1.2,  'C₆H₁₄',  8.0),
  s('isooctane',       'Изооктан',            'Isooctane',        3, 1.00,  1.0,  undefined, 8.0),
  s('gasoline',        'Бензин',              'Gasoline',         3, 1.00,  1.1,  undefined, 8.0),
  s('heptane',         'Гептан',              'Heptane',          3, 1.00,  1.1,  'C₇H₁₆',  8.0),
  s('vinylchloride',   'Винилхлорид',         'Vinyl chloride',   3, 0.42,  3.6,  'C₂H₃Cl', 7.2),
  s('vinylacetate',    'Винилацетат',         'Vinyl acetate',    3, 0.51,  2.6,  undefined, 7.5),
  s('methylamine',     'Метиламин',           'Methylamine',      3, 0.70,  4.9,  'CH₅N',   5.5),
  s('methyl_ethyl_k',  'Метилэтилкетон',      'Methyl ethyl ketone',3,0.65, 1.8,  undefined, 7.9),
  s('octane',          'Октан',               'Octane',           3, 1.00,  1.0,  'C₈H₁₈',  8.0),
  s('pyridine',        'Пиридин',             'Pyridine',         3, 0.77,  1.8,  'C₅H₅N',  7.8),
  s('hydrogen_sulfide','Сероводород',          'Hydrogen sulfide', 3, 0.34,  4.3,  'H₂S',    7.2),
  s('methanol',        'Метанол',             'Methanol',         3, 0.45,  6.7,  'CH₄O',   7.2),
  s('ethanol',         'Этанол',              'Ethanol',          3, 0.61,  3.3,  'C₂H₆O',  7.6),
  s('propanol',        'Пропанол',            'Propanol',         3, 0.69,  2.2,  undefined, 7.8),
  s('cyclohexane',     'Циклогексан',         'Cyclohexane',      3, 1.00,  1.3,  'C₆H₁₂',  8.1),
  s('acetaldehyde',    'Ацетальдегид',        'Acetaldehyde',     3, 0.56,  4.0,  'C₂H₄O',  7.5),
  s('cumene',          'Кумол',               'Cumene',           3, 0.84,  0.9,  'C₉H₁₂',  8.2),

  // Класс 4 — слабочувствительные
  s('methane',         'Метан',               'Methane',          4, 1.14,  5.0,  'CH₄',    7.5),
  s('benzene',         'Бензол',              'Benzene',          4, 1.00,  1.4,  'C₆H₆',   8.3),
  s('decane',          'Декан',               'Decane',           4, 1.00,  0.7,  'C₁₀H₂₂', 8.0),
  s('dodecane',        'Додекан',             'Dodecane',         4, 1.00,  0.6,  undefined, 8.0),
  s('toluene',         'Метилбензол (Толуол)','Toluene',          4, 1.00,  1.2,  'C₇H₈',   8.2),
  s('methylmercaptan', 'Метилмеркаптан',      'Methyl mercaptan', 4, 0.53,  3.9,  'CH₄S',   7.2),
  s('carbon_monoxide', 'Окись углерода',      'Carbon monoxide',  4, 0.23, 12.5,  'CO',      7.5),
  s('dichloroethane',  'Дихлорэтан',          'Dichloroethane',   4, 0.24,  6.2,  'C₂H₄Cl₂',6.5),
  s('dichlorobenzene', 'Дихлорбензол',        'Dichlorobenzene',  4, 0.42,  2.2,  'C₆H₄Cl₂',7.0),
  s('methylchloride',  'Метилхлорид',         'Methyl chloride',  4, 0.12,  7.6,  'CH₃Cl',  6.8),
  s('trichloroethane', 'Трихлорэтан',         'Trichloroethane',  4, 0.14,  8.0,  'C₂H₃Cl₃',6.5),
];

export const getSubstanceById = (id: string) => SUBSTANCES.find(s => s.id === id);

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
