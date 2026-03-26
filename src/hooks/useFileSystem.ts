/**
 * useFileSystem Hook
 * 
 * React hook that manages the file system state and provides
 * methods for all file operations. Handles persistence automatically.
 */

import {
    calculateFragmentation,
    createDirectory as fsCreateDirectory,
    createFile as fsCreateFile,
    deleteFile as fsDeleteFile,
    renameEntry as fsRenameEntry,
    updateFilePermissions as fsUpdateFilePermissions,
    getDiskStats,
    getPath,
    initializeFileSystem,
    loadFromStorage,
    resetFileSystem,
    saveToStorage,
    switchAllocationStrategy,
} from '@/lib/filesystem';
import {
    AllocationStrategy,
    BLOCK_SIZE,
    FileSystemState,
    PermissionSet
} from '@/types/filesystem';
import { useCallback, useEffect, useState } from 'react';

export function useFileSystem(storageKey: string = 'visual-fs-state') {
  const [state, setState] = useState<FileSystemState | null>(null);
  const [selectedDirId, setSelectedDirId] = useState<number>(0);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    const loaded = loadFromStorage(storageKey);
    if (loaded) {
      setState(loaded);
    } else {
      setState(initializeFileSystem());
    }
  }, [storageKey]);

  // Save to storage whenever state changes
  useEffect(() => {
    if (state) {
      saveToStorage(state, storageKey);
    }
  }, [state, storageKey]);

  const clearError = useCallback(() => setError(null), []);

  const createFile = useCallback((name: string, sizeInKB: number) => {
    if (!state) return;
    
    try {
      const newState = { ...state };
      // We need to clone the maps to trigger React updates
      newState.inodes = new Map(state.inodes);
      newState.directories = new Map(state.directories);
      newState.disk = {
        ...state.disk,
        blocks: [...state.disk.blocks],
        freeBlockBitmap: [...state.disk.freeBlockBitmap],
      };
      
      fsCreateFile(newState, selectedDirId, name, sizeInKB);
      setState(newState);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [state, selectedDirId]);

  const createDirectory = useCallback((name: string) => {
    if (!state) return;
    
    try {
      const newState = { ...state };
      newState.inodes = new Map(state.inodes);
      newState.directories = new Map(state.directories);
      
      fsCreateDirectory(newState, selectedDirId, name);
      setState(newState);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [state, selectedDirId]);

  const renameEntry = useCallback((oldName: string, newName: string) => {
    if (!state) return;
    
    try {
      const newState = { ...state };
      newState.directories = new Map(state.directories);
      
      fsRenameEntry(newState, selectedDirId, oldName, newName);
      setState(newState);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [state, selectedDirId]);

  const deleteEntry = useCallback((name: string) => {
    if (!state) return;
    
    try {
      const newState = { ...state };
      newState.inodes = new Map(state.inodes);
      newState.directories = new Map(state.directories);
      newState.disk = {
        ...state.disk,
        blocks: [...state.disk.blocks],
        freeBlockBitmap: [...state.disk.freeBlockBitmap],
      };
      
      // Find the entry to check if it's the selected file
      const dir = newState.directories.get(selectedDirId);
      const entry = dir?.entries.find(e => e.name === name);
      if (entry && entry.inodeId === selectedFileId) {
        setSelectedFileId(null);
      }
      
      fsDeleteFile(newState, selectedDirId, name);
      setState(newState);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [state, selectedDirId, selectedFileId]);

  const selectDirectory = useCallback((inodeId: number) => {
    setSelectedDirId(inodeId);
    setSelectedFileId(null);
  }, []);

  const selectFile = useCallback((inodeId: number) => {
    setSelectedFileId(inodeId);
  }, []);

  const reset = useCallback(() => {
    const newState = resetFileSystem(storageKey);
    setState(newState);
    setSelectedDirId(0);
    setSelectedFileId(null);
    setError(null);
  }, [storageKey]);

  const setAllocationStrategy = useCallback((strategy: AllocationStrategy) => {
    if (!state) return;
    
    const newState = { ...state };
    // Create shallow copies of maps if needed, but for simple property change
    // a shallow copy of state object is enough to trigger re-render
    // provided we don't mutate deeply nested objects that purely depend on reference identity
    
    switchAllocationStrategy(newState, strategy);
    setState(newState);
  }, [state]);

  const updatePermissions = useCallback((inodeId: number, permissions: PermissionSet) => {
    if (!state) return;
    try {
      const newState = { ...state };
      newState.inodes = new Map(state.inodes);
      fsUpdateFilePermissions(newState, inodeId, permissions);
      setState(newState);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [state]);

  // Computed values
  const currentDirectory = state?.directories.get(selectedDirId) ?? null;
  const selectedFile = selectedFileId ? state?.inodes.get(selectedFileId) ?? null : null;
  const diskStats = state ? getDiskStats(state) : null;
  
  // Get file name for selected file
  const selectedFileName = selectedFileId && currentDirectory
    ? currentDirectory.entries.find(e => e.inodeId === selectedFileId)?.name ?? null
    : null;
  
  // Get current path
  const currentPath = state ? getPath(state, selectedDirId) : '/';
  
  // Calculate fragmentation
  const fragmentation = state ? calculateFragmentation(state.disk) : 0;

  return {
    state,
    selectedDirId,
    selectedFileId,
    currentDirectory,
    selectedFile,
    selectedFileName,
    currentPath,
    diskStats,
    error,
    clearError,
    createFile,
    createDirectory,
    renameEntry,
    deleteEntry,
    selectDirectory,
    selectFile,
    updatePermissions,
    reset,
    setAllocationStrategy,
    fragmentation,
    BLOCK_SIZE,
  };
}
