import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useUpdateSearchParams } from './useUpdateSearchParams';

const mockSetSearchParams = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useSearchParams: () => [currentSearchParams, mockSetSearchParams],
  };
});

describe('useUpdateSearchParams', () => {
  beforeEach(() => {
    mockSetSearchParams.mockClear();
  });

  it('should successfully update or set a new parameter value', () => {
    currentSearchParams = new URLSearchParams('?page=2&details=25');
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.setParam('details', '42');
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

    const updateFn = mockSetSearchParams.mock.calls[0][0];
    const nextParams = updateFn(currentSearchParams);

    expect(nextParams.get('details')).toBe('42');
    expect(nextParams.get('page')).toBe('2');
  });

  it('should NOT trigger an update if the new value matches the current value', () => {
    currentSearchParams = new URLSearchParams('?page=2&details=25');
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.setParam('details', '25');
    });

    expect(mockSetSearchParams).not.toHaveBeenCalled();
  });

  it('should successfully delete an existing parameter', () => {
    currentSearchParams = new URLSearchParams('?page=2&details=25');
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.deleteParam('details');
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

    const updateFn = mockSetSearchParams.mock.calls[0][0];
    const nextParams = updateFn(currentSearchParams);

    expect(nextParams.get('details')).toBeNull();
    expect(nextParams.get('page')).toBe('2');
  });

  it('should NOT trigger an update when attempting to delete a non-existent parameter', () => {
    currentSearchParams = new URLSearchParams('?page=2');
    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current.deleteParam('details');
    });

    expect(mockSetSearchParams).not.toHaveBeenCalled();
  });
});
