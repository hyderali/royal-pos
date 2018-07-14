/* eslint camelcase: "off" */
import { equal } from '@ember/object/computed';

import Service from '@ember/service';
export default Service.extend({
  isLoggedIn: false,
  user: null,
  itemslist: null,
  organization_id: null,
  customer_id: null,
  vendors: [],
  inventory_account_id: null,
  cogs_id: null,
  isAdmin: equal('user.is_admin', true),
  isSale: equal('user.is_sale', true),
  groups: ['BOYS COTTON JEANS', 'BOYS COTTON PANT', 'BOYS FANCY', 'BOYS INNER WEAR', 'BOYS JEANS', 'BOYS SET', 'BOYS SHIRT', 'BOYS TROUSERS', 'BOYS TSHIRT', 'COTTON JEANS', 'COTTON PANT', 'DHOTHY', 'GIRLS INNER', 'GIRLS SET', 'GIRLS WEAR', 'INNER WEAR', 'JEANS', 'LEGGINS', 'LUNGI', 'METERIALS', 'NIGHT WEAR', 'PANT CLOTH BIT', 'SAREE', 'SHI CLO BIT', 'SHI PAN CLO', 'SHIRT', 'SHIRT WASH', 'T SHIRT', 'TERIWELL PANT', 'TOWEL'],
  sizes: ['0', '0.4', '1', '1.2', '1.3', '1.5', '1.6', '1.7', '1.8', '2', '2.1', '2.25', '3', '3.6', '3.65', '4', '5', '6', '6.3', '7', '8', '9', '10', '11', '12', '13', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '45', '48', '50', '55', '60', '65', '70', '73', '75', '80', '85', '90', '95', '100', '280', '0 1', '0-1', '0/1', '1 3', '1+1', '16-20', '18-22', '2 4', '2-3', '2-4', '20 24', '20 26', '20 30', '20-22', '20-24', '20-26', '22 26', '22-24', '22-26', '22=26', '24-26', '24-28', '26 28', '26 30', '26--30', '26-30', '26-32', '28 30', '28 32', '28-30', '28-32', '3/4', '30-32', '30-60', '30-L', '30*60', '32 34', '32 36', '32-34', '32-36', '32-L', '34 36', '34-36', '34-XL', '36-40', '4 6', '4-5', '4XL', '5 7', '5-7', '55-60', '6-7', '60-65', '60-70', '65-70', '65-73', '70 75', '70-73', '75-100', '75-80', '75-90', '8 10', '8 PAT', '80 85', '80-90', '85 90', '85-90', '90 95', '90-100', '95-100', 'BABY', 'H/S', 'l', 'L', 'L 40', 'L XL', 'L-30', 'L.', 'LL', 'M', 'M 38', 'M-26', 'MIX', 'PANT', 'S', 'S 36', 'S M', 'S-22', 'SET', 'SHORT', 'SML', 'X 42', 'XL', 'XL 42', 'XL-32', 'XXL', 'XXXL'],
  designs: ['7', '1011', '1045', '1517', '1518', '2022', '6523', '8030', '10 PAT', '10000 KAL', '2/4', '3/4', '3/4 PRINT', '5000 KAL', '8 PART', 'A 1', 'ADMK', 'ALISHA', 'ANAR', 'ANGEL', 'ANJANI', 'ANSI', 'ANU', 'APP CIFF', 'ARCHIE', 'ARPITA', 'B BABY', 'B/C', 'BABA SUIT', 'BABY', 'BAGUL PURI', 'BALOON', 'BANIYAN', 'BIT', 'BL BEAU', 'BLOCK', 'BOBBY', 'BOOTCUT', 'BORDER', 'BOYS', 'BOYS TRACK', 'BROSA', 'BROTHERS', 'BURQA', 'BUTTERFLY', 'C R N', 'C/COT', 'CAFREE', 'CAMF', 'CAP 3/4', 'CAP F/S', 'CAP H/S', 'CARGO', 'CHADAR', 'CHECK', 'CHEK', 'CIBI', 'CLASSIC', 'COAT', 'COL F/S', 'COL H/S', 'COL R/N', 'COL THI', 'COLAR', 'COLF/S', 'COLOR', 'COLOUR', 'COLOUR ROSE', 'COMF', 'COT SILK', 'COT TRA', 'COTTON', 'CR WIR', 'CRN', 'CRO SIL', 'CUB', 'DHAMAKA', 'DHOOM2', 'DHOTY', 'DILKOSH', 'DIVYA', 'DOPPY', 'DOTHI', 'DRAWYER', 'EERAL', 'ELASTIC', 'EMBR', 'F COAT', 'F/S', 'F/S C', 'F/S KURTA', 'F/S R', 'F/S V', 'FANCY', 'FLIT', 'FLORA', 'FLOWER', 'FROG', 'FS', 'FULL', 'G-3', 'GAGAN', 'GAMINI', 'GAPPAR', 'GARIMA', 'GIFT BOX', 'GIFT SET', 'GIRLS', 'GIRLS S', 'GOWN', 'GRAPE', 'GYM', 'H/R R', 'H/S', 'H/S  R', 'H/S 3/4', 'H/S C', 'H/S R', 'H/S V', 'H/S.', 'HA HA', 'HAJ', 'HALF', 'HAPPY', 'HS', 'IE', 'IE C', 'IE P', 'IE PL', 'IE PR', 'IEPR', 'JAINAM', 'JARI', 'JAYAM', 'JEANS', 'JERCY', 'JETTY', 'JILLA', 'JIM', 'JOGER', 'JULIE', 'KAMINI', 'KARACHI', 'KKO', 'KRISH', 'KUDAL', 'KURTI', 'KUTRALAM', 'LADLI', 'LAHARI', 'LEGGINS', 'LILLY', 'LINAN', 'LINGA', 'LINON', 'LO FROG', 'LOTUS', 'LYCRA', 'MAA BHALI', 'MADE IND', 'MALA', 'MANAM', 'MASAKALI', 'MASTANI', 'MEENA', 'MEGNA', 'MIDI SET', 'MILITRY', 'MIX', 'MODEL', 'MODI', 'MOTHI', 'MUGUN', 'N/PANT', 'NA R', 'NARROW', 'NAXI', 'NET', 'NET JAQ', 'NEW', 'NICE', 'NICKER', 'NIGHTY', 'NIRMA', 'O E', 'OE', 'OE P', 'OE PL', 'OE PR', 'OK', 'P P', 'PAKDAMAN', 'PANT', 'PATIALA', 'PATTA', 'PATTU', 'PCT', 'PENCIL', 'PINKY', 'PKT', 'PLAIN', 'PO CO', 'POC', 'POLO', 'POOL', 'POONAM', 'POW CRA', 'PRINT', 'PULI', 'QUEEN', 'R MICRO', 'R N', 'R N COL', 'R N WHI', 'R R', 'R/ N C', 'R/ N F/S', 'R/ N S', 'R/N', 'R/N C', 'R/N H/S', 'R/N V/N', 'R/N V/N H/S', 'RAJGURU', 'RANGOLI', 'RE CALL', 'REGULAR', 'RIM ZIM', 'RN', 'RN C', 'RN F/S', 'RN H/S', 'RN RR', 'RNS', 'ROJA', 'ROPE', 'ROSE', 'ROWDY', 'S L', 'S L 3/4', 'S/L', 'SALMA', 'SARMLI', 'SD', 'SEJAL', 'SET', 'SHARWANI', 'SHAWL', 'SHIFFON', 'SHINE', 'SID', 'SIFFON', 'SILK', 'SLEEVLES', 'SOFT', 'SOLI', 'SPECIAL', 'SPL', 'STRIPE', 'SUDI', 'SUDITHAR', 'SUDTHAR', 'SUNDRI', 'SUPREME', 'SURYA', 'TANISQ', 'TOP', 'TOPS', 'TRACK', 'TRIVANI', 'TROWSER', 'TRUNKS', 'TURKY', 'TYEES', 'V/N F/S', 'V/N H/S', 'VEDALAM', 'VEL', 'VODA', 'WESTERN', 'WHI EM', 'WHI R/N', 'WHITE', 'WORK', 'XL', 'XL SHO', 'YUVA'],
  brands: ['144', '166', '2 STEP', '9X', 'A C', 'A PLAY', 'AAA', 'AARIS', 'AARNAV', 'ABI', 'ABU', 'ABUL', 'ACURA', 'AF', 'AFSANA', 'AFSAR', 'AFTAB', 'AGARAM', 'AHMD', 'AKR', 'AKRAM', 'ALPHA 1', 'ALPHA 2',
    'AM', 'AMAR', 'AMIR', 'AMIRTHA', 'ANAZ', 'ANG', 'ANGEL', 'ANISHA', 'ANSAR', 'APPLE', 'AR', 'ARGENA', 'ARM', 'ARTHI', 'ARVIND', 'ASSORTED', 'ATTACH', 'BALAJ', 'BALAJI',
    'BAPI', 'BARCLONA', 'BAVNA', 'BAWNA', 'BDD', 'BEST BABY', 'BISMI', 'BJI', 'BLE', 'BLING', 'BLNG', 'BLUE JEAN', 'BOMBAY', 'BRANDED', 'BUT', 'C CARE', 'CAL', 'CHECK', 'CHI COL', 'CIBI', 'CITY', 'CLASSIC',
    'COLOR 5', 'COOL BOY', 'COOL COTTON', 'COOL NAVY', 'COOL TECH', 'CZ', 'D STAR', 'DDS', 'DEEPGIRL', 'DEISEL', 'DELHI', 'DEN', 'DESERT HAWKS', 'DESIRE',
    'DEWAN', 'DIAMOND', 'DOOD', 'DORA', 'DUA', 'DUKK', 'DURG', 'EDE', 'ELITE', 'ELIZA', 'ENN ARI', 'EVERY DAY', 'EZHIL', 'F A', 'F G', 'F S', 'FAME', 'FANCY',
    'FANTA', 'FIROZ', 'FIRST', 'FITTO', 'FLO', 'FONI', 'FOX FLEX', 'GCS', 'GENX', 'GOLD FISH', 'GOLDSTA', 'GOOD DAY', 'GUNDAN', 'H S', 'HAJI', 'HARIS',
    'HEENA', 'HI WAY', 'HIMANSU', 'HIPON', 'HONDA', 'HUTCH', 'I CAN', 'ICAN', 'ICN M', 'IDHAYAM', 'IQBAL', 'ISMAIL', 'J C', 'J M', 'J S', 'JACK', 'JAGAN',
    'JAINAM', 'JAMAL', 'JAS', 'JASMIN', 'JAY', 'JAYA', 'JBH', 'JCS', 'JEANS', 'JJ C', 'JOB', 'JOCKY', 'JRS', 'JSC', 'JTS', 'JUL', 'JUNIOR KAMBIT',
    'K 10', 'K D B', 'K K', 'K P S', 'K RIDER', 'K S', 'K T', 'KAKULI', 'KALAM', 'KAMBIT', 'KAVIYA', 'KBB', 'KHUSI', 'KOYTA', 'KPS', 'KT', 'KTN', 'KUNWAR',
    'KUTRALAM', 'LARKY', 'LAXMI', 'LC', 'LEE', 'LEMON', 'LI STAR', 'LIAKAT', 'LIMRA', 'LITTLE', 'LITTLE 1', 'LLIKAT', 'LOC', 'LON BOY', 'LONDON BOY', 'LOTUS',
    'LOVE', 'LOVELY', 'LYCRA', 'M ALI', 'M M', 'M N', 'M S', 'M/S', 'M&S', 'MADHU', 'MAGAGI', 'MAGGAI', 'MAIDUL', 'MANGAI', 'MANOYAR', 'MASUDA', 'MD', 'MDARIF',
    'MDS', 'MEG', 'MEGHNA', 'MELBO', 'MELBOURNE', 'MEN SMART', 'MINHAZ', 'MINI MAX', 'MINKA', 'MISTE', 'MIX', 'MM', 'MONI', 'MOON', 'MOTILAL', 'MOURANI', 'MR WHITE',
    'MSS', 'MUF/USP', 'MUSKAN', 'MUYAL', 'N MIX', 'N.LOVELY', 'NANAYAM', 'NANDAN', 'NANDU', 'NAXI', 'NEK', 'NITTYS', 'NOOR', 'NOORBANU', 'NOORJAHA', 'O K',
    'ODY', 'OK', 'OPM', 'OXIL', 'OXYGEN', 'PAKIJA', 'PAPPU', 'PATTI', 'PIN', 'PLAY STORE', 'PLAYERS CLUB', 'POLO', 'POOMER', 'POOMEX', 'POORNIMA', 'PREETI',
    'PRIYA', 'R ONE', 'R R SANKAVI', 'RAJ DARBAR', 'RAJA BABU', 'RAJIB', 'RAJRANI', 'RAMBA', 'RAMBO', 'RAMRAJ', 'RANG', 'RANIAL', 'RAVI', 'RDKW', 'RED POLO',
    'RED ROSE', 'REEDS', 'RICH DEAR', 'RIDER', 'RITESH', 'RITHIKA', 'ROBO', 'ROSAN', 'ROXY', 'ROYAL', 'ROYAL C', 'ROYAL CHARLIE', 'RUME', 'RUNWAY', 'S B',
    'S G', 'S K', 'S V T', 'S.LAL', 'SAAN TEX', 'SABIR', 'SAF', 'SAKTHI', 'SALMA', 'SAMIMA', 'SARRAH', 'SCS', 'SD', 'SF', 'SHAHA', 'SHAMIM', 'SHEETAL', 'SHINE', 'SINDAN',
    'SKC', 'SKT', 'SMA', 'SMART', 'SNEH', 'SONALI', 'SOUKHIN', 'SPM', 'SRI PRIYA', 'SRT', 'SS', 'SSS', 'STEP 9', 'STILO', 'STYLO', 'SUHAIL', 'SULTANA', 'SUMAIYA',
    'SUN 2 SAT', 'SUNJIRA', 'SURAF', 'SYPPIY', 'T N', 'TAMIM', 'TANJORE', 'TANVIR', 'TARBY SILK', 'TEK GREEN', 'TIM TOM', 'TIRU', 'TOMMY', 'TPR',
    'TRI ACE', 'TRI STAR', 'TRIPLE ACE', 'TRISTAR', 'U S POLO', 'UJALA', 'US POLO', 'USH', 'VANSIKA', 'VARDMAN', 'VARTHAMAN', 'VBOSS', 'VEEMAX',
    'VEL', 'VIKING', 'VMP', 'VOODOO', 'WAVES', 'WEILER', 'WHI FANCY', 'WITTY', 'WYT', 'YASH', 'YES', 'YSN'
  ],
  itemCF: null
});
