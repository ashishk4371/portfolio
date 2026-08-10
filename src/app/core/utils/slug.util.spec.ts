import { slugify, uniqueSlug } from './slug.util';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello There World')).toBe('hello-there-world');
  });

  it('strips punctuation without leaving stray hyphens', () => {
    expect(slugify('  What?! Really... yes  ')).toBe('what-really-yes');
  });

  it('folds accents instead of dropping the character', () => {
    expect(slugify('Déjà Vu')).toBe('deja-vu');
  });
});

describe('uniqueSlug', () => {
  it('appends a counter on collision', () => {
    const taken = new Set<string>();

    expect(uniqueSlug('Setup', taken)).toBe('setup');
    expect(uniqueSlug('Setup', taken)).toBe('setup-2');
    expect(uniqueSlug('Setup', taken)).toBe('setup-3');
  });

  it('falls back to a usable slug when the text has no word characters', () => {
    expect(uniqueSlug('!!!', new Set())).toBe('section');
  });
});
