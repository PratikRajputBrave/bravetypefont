export interface GlyphCategory {
  title: string;
  characters: string[];
}

export function getCharacterSets(): GlyphCategory[] {
  return [
    {
      title: 'Uppercase',
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    },
    {
      title: 'Lowercase',
      characters: 'abcdefghijklmnopqrstuvwxyz'.split('')
    },
    {
      title: 'Numbers',
      characters: '0123456789'.split('')
    },
    {
      title: 'Symbols & Punctuation',
      characters: '! @ # $ % ^ & * ( ) - _ = + [ ] { } | \\ ; : \' " , . < > / ? ~ ` € £ ¥ ₹ © ® ™ § ¶ † ‡ • … – —'.split(' ')
    }
  ];
}
