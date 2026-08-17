import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('query', ''));

    expect(result.current[0]).toBe('');
  });

  it('should read value from localStorage', () => {
    localStorage.setItem('query', JSON.stringify('pikachu'));

    const { result } = renderHook(() => useLocalStorage('query', ''));

    expect(result.current[0]).toBe('pikachu');
  });

  it('should update state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('query', ''));

    act(() => {
      result.current[1]('charizard');
    });

    expect(result.current[0]).toBe('charizard');
    expect(JSON.parse(localStorage.getItem('query')!)).toBe('charizard');
  });

  it('should remove value from localStorage and reset state', () => {
    localStorage.setItem('query', JSON.stringify('bulbasaur'));

    const { result } = renderHook(() => useLocalStorage('query', ''));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('');
    expect(localStorage.getItem('query')).toBeNull();
  });

  it('should return initial value when localStorage contains invalid JSON', () => {
    localStorage.setItem('query', '{invalid-json');

    const { result } = renderHook(() => useLocalStorage('query', 'default'));

    expect(result.current[0]).toBe('default');
  });
});
