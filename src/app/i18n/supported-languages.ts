export interface LanguageDescription {
  id: string,
  label: string,
  default?: boolean,
}

export const supportedLanguages: {
  languages: LanguageDescription[]
} = {
  languages: [
    {
      id: 'en',
      label: 'English',
      default: true,
    },
    {
      id: 'de',
      label: 'Deutsch',
    },
    {
      id: 'ru',
      label: 'Русский',
    },
    {
      id: 'ua',
      label: 'Українська',
    },
  ]
};
