export const pastelTheme = {
  background: '#fff7f3',
  surface: '#fffdfb',
  surfaceAlt: '#fff1ed',
  surfaceMint: '#eef9f4',
  surfaceLavender: '#f2efff',
  border: '#f0d7dc',
  borderStrong: '#e6bcc8',
  text: '#6d5b6e',
  heading: '#4e435b',
  accent: '#f4a7bb',
  accentDeep: '#ce6c8a',
  accentSoft: '#ffe2ea',
  mint: '#ccecdf',
  mintDeep: '#5a8f80',
  peach: '#ffd9cb',
  peachDeep: '#b86f60',
  lavender: '#ddd8ff',
  lavenderDeep: '#7a71a9',
  sunshine: '#ffe9b7',
  sunshineDeep: '#a17c1b',
  muted: '#9f8b9c',
  white: '#ffffff',
};

export const softShadow = {
  shadowColor: '#d99eb0',
  shadowOpacity: 0.14,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 4,
};

const retailerThemes = [
  {
    matchers: ['walmart'],
    colors: {
      tint: '#e8f2ff',
      border: '#b9d1fb',
      text: '#3d67ab',
      buttonTone: 'lavender',
    },
  },
  {
    matchers: ['best buy', 'bestbuy'],
    colors: {
      tint: '#fff4c7',
      border: '#efd87e',
      text: '#8f6c00',
      buttonTone: 'warm',
    },
  },
];

const defaultRetailerTheme = {
  tint: pastelTheme.accentSoft,
  border: pastelTheme.borderStrong,
  text: pastelTheme.accentDeep,
  buttonTone: 'primary',
};

export const getRetailerAccent = (retailer = '') => {
  const normalizedRetailer = String(retailer).toLowerCase();
  const matchedRetailer = retailerThemes.find(({ matchers }) =>
    matchers.some((matcher) => normalizedRetailer.includes(matcher)),
  );

  return matchedRetailer?.colors ?? defaultRetailerTheme;
};

export const buttonTones = {
  primary: {
    background: pastelTheme.accent,
    border: pastelTheme.accentDeep,
    text: pastelTheme.white,
  },
  mint: {
    background: pastelTheme.mint,
    border: '#95cfbb',
    text: pastelTheme.mintDeep,
  },
  lavender: {
    background: pastelTheme.lavender,
    border: '#b9b1ef',
    text: pastelTheme.lavenderDeep,
  },
  warm: {
    background: pastelTheme.peach,
    border: '#f0bda9',
    text: pastelTheme.peachDeep,
  },
  neutral: {
    background: pastelTheme.surface,
    border: pastelTheme.border,
    text: pastelTheme.heading,
  },
};
