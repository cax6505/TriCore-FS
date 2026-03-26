/**
 * Visual File System Simulator - Core Logic
 * 
 * This module implements the core file system operations.
 * Each function is designed to mimic how real operating systems
 * manage files at the kernel level.
 */

import {
    AllocationStrategy,
    BLOCK_SIZE,
    Directory,
    Disk,
    DiskBlock,
    FileSystemState,
    Inode,
    MAX_DIRECT_POINTERS,
    PermissionSet,
    POINTERS_PER_BLOCK,
    ROOT_INODE_ID,
    SerializableFileSystemState,
    TOTAL_BLOCKS
} from '@/types/filesystem';

/**
 * Initialize a fresh file system
 * 
 * This is like formatting a new disk. We:
 * 1. Create all disk blocks (initially free)
 * 2. Set up the free block bitmap
 * 3. Create the root directory with inode 0
 */
export function initializeFileSystem(): FileSystemState {
  // Create disk blocks
  const blocks: DiskBlock[] = [];
  const freeBlockBitmap: boolean[] = [];
  // FAT table: -2 = free, -1 = end-of-chain, N >= 0 = next cluster
  const fatTable: number[] = [];
  
  for (let i = 0; i < TOTAL_BLOCKS; i++) {
    blocks.push({
      id: i,
      used: false,
      inodeId: null,
    });
    freeBlockBitmap.push(false); // false = free
    fatTable.push(-2);           // -2 = free cluster
  }
  
  const disk: Disk = {
    totalBlocks: TOTAL_BLOCKS,
    blockSize: BLOCK_SIZE,
    blocks,
    freeBlockBitmap,
    fatTable,
  };
  
  // Create root directory inode
  const rootInode: Inode = {
    id: ROOT_INODE_ID,
    type: 'directory',
    size: 0,
    createdAt: new Date().toISOString(),
    permissions: { read: true, write: true, execute: true },
    blockPointers: [],
  };
  
  // Create root directory
  const rootDir: Directory = {
    inodeId: ROOT_INODE_ID,
    parentInodeId: null, // Root has no parent
    entries: [],
  };
  
  const inodes = new Map<number, Inode>();
  inodes.set(ROOT_INODE_ID, rootInode);
  
  const directories = new Map<number, Directory>();
  directories.set(ROOT_INODE_ID, rootDir);
  
  return {
    inodes,
    directories,
    disk,
    nextInodeId: 1, // 0 is taken by root
    rootInodeId: ROOT_INODE_ID,
    currentAllocationStrategy: 'contiguous', // Default to contiguous for educational purposes
  };
}

/**
 * Find contiguous free blocks
 */
function findContiguousBlocks(disk: Disk, blocksNeeded: number): number[] {
  let currentRun: number[] = [];
  
  for (let i = 0; i < disk.blocks.length; i++) {
    if (!disk.freeBlockBitmap[i]) {
      currentRun.push(i);
      if (currentRun.length === blocksNeeded) {
        return currentRun;
      }
    } else {
      currentRun = [];
    }
  }
  
  return [];
}

/**
 * Find any free blocks (for linked/indexed)
 */
function findAnyFreeBlocks(disk: Disk, blocksNeeded: number): number[] {
  const blocks: number[] = [];
  
  for (let i = 0; i < disk.blocks.length && blocks.length < blocksNeeded; i++) {
    if (!disk.freeBlockBitmap[i]) {
      blocks.push(i);
    }
  }
  
  return blocks;
}

/**
 * Allocate disk blocks based on the current strategy
 */
export function allocateBlocks(
  state: FileSystemState,
  sizeInBytes: number,
  inodeId: number
): { 
  blocks: number[]; 
  indexBlockId?: number;
  unixStructure?: {
    direct: number[];
    singleIndirect: number | null;
    doubleIndirect: number | null;
  }
} {
  const blocksNeeded = Math.max(1, Math.ceil(sizeInBytes / BLOCK_SIZE));
  const strategy = state.currentAllocationStrategy;
  
  if (strategy === 'contiguous') {
    const blocks = findContiguousBlocks(state.disk, blocksNeeded);
    
    if (blocks.length < blocksNeeded) {
      throw new Error(`Not enough contiguous space. Need ${blocksNeeded} blocks. Try defragmenting or switching to Linked allocation.`);
    }
    
    // Allocate the blocks
    for (const blockId of blocks) {
      state.disk.freeBlockBitmap[blockId] = true;
      state.disk.blocks[blockId].used = true;
      state.disk.blocks[blockId].inodeId = inodeId;
      state.disk.blocks[blockId].blockType = 'data';
    }
    
    return { blocks };
  } 
  else if (strategy === 'linked') {
    const blocks = findAnyFreeBlocks(state.disk, blocksNeeded);
    
    if (blocks.length < blocksNeeded) {
      throw new Error(`Not enough disk space. Need ${blocksNeeded} blocks.`);
    }
    
    // Allocate and link blocks
    for (let i = 0; i < blocks.length; i++) {
      const blockId = blocks[i];
      const nextBlockId = i < blocks.length - 1 ? blocks[i + 1] : null;
      
      state.disk.freeBlockBitmap[blockId] = true;
      state.disk.blocks[blockId].used = true;
      state.disk.blocks[blockId].inodeId = inodeId;
      state.disk.blocks[blockId].nextBlockPointer = nextBlockId;
      state.disk.blocks[blockId].blockType = 'data';
    }
    
    return { blocks };
  } 
  else if (strategy === 'indexed') {
    // Need 1 extra block for the index
    const totalNeeded = blocksNeeded + 1;
    const blocks = findAnyFreeBlocks(state.disk, totalNeeded);
    
    if (blocks.length < totalNeeded) {
      throw new Error(`Not enough disk space. Need ${totalNeeded} blocks (including 1 index block).`);
    }
    
    const indexBlockId = blocks[0]; // First block is index block
    const dataBlocks = blocks.slice(1);
    
    // Setup Index Block
    state.disk.freeBlockBitmap[indexBlockId] = true;
    state.disk.blocks[indexBlockId].used = true;
    state.disk.blocks[indexBlockId].inodeId = inodeId;
    state.disk.blocks[indexBlockId].blockType = 'index';
    
    // Setup Data Blocks
    for (const blockId of dataBlocks) {
      state.disk.freeBlockBitmap[blockId] = true;
      state.disk.blocks[blockId].used = true;
      state.disk.blocks[blockId].inodeId = inodeId;
      state.disk.blocks[blockId].blockType = 'data';
    }
    
    return { blocks: dataBlocks, indexBlockId };
  }
  else if (strategy === 'unix') {
    // Unix FFS Style Allocation
    let metaBlocksNeeded = 0;
    const directCount = Math.min(blocksNeeded, MAX_DIRECT_POINTERS);
    let remData = blocksNeeded - directCount;
    
    // Single Indirect
    const singleDataCount = Math.min(remData, POINTERS_PER_BLOCK);
    if (remData > 0) metaBlocksNeeded++; // Single indirect block
    remData -= singleDataCount;
    
    // Double Indirect
    const doubleDataCount = remData; // Assuming we don't exceed max file size for now (12 + 16 + 256 blocks)
    let doubleIndexBlocks = 0;
    if (remData > 0) {
       metaBlocksNeeded++; // Double indirect block
       doubleIndexBlocks = Math.ceil(remData / POINTERS_PER_BLOCK);
       metaBlocksNeeded += doubleIndexBlocks;
    }
    
    const totalNeeded = blocksNeeded + metaBlocksNeeded;
    const allBlocks = findAnyFreeBlocks(state.disk, totalNeeded);
    
    if (allBlocks.length < totalNeeded) {
      throw new Error(`Not enough disk space. Need ${totalNeeded} blocks.`);
    }
    
    // Distribute blocks
    let cursor = 0;
    
    // 1. Direct Blocks
    const direct: number[] = [];
    for (let i = 0; i < directCount; i++) {
        direct.push(allBlocks[cursor++]);
    }
    
    // 2. Single Indirect
    let singleIndirect: number | null = null;
    if (singleDataCount > 0) {
        singleIndirect = allBlocks[cursor++];
        state.disk.blocks[singleIndirect].blockType = 'index';
        // The data blocks it points to
        for(let i=0; i<singleDataCount; i++) {
             cursor++; // Consume data block
        }
    }
    
    // 3. Double Indirect
    let doubleIndirect: number | null = null;
    if (doubleDataCount > 0) {
        doubleIndirect = allBlocks[cursor++];
        state.disk.blocks[doubleIndirect].blockType = 'index';
        
        // Consume intermediate index blocks
        for(let i=0; i<doubleIndexBlocks; i++) {
            const midIndex = allBlocks[cursor++];
            state.disk.blocks[midIndex].blockType = 'index';
            // Consume data blocks for this segment
            // (Simulated consumption as we just return list of all blocks used for now)
        }
        cursor += doubleDataCount; // Skip data blocks
    }

    // Mark all as used
    for (const blockId of allBlocks) {
      state.disk.freeBlockBitmap[blockId] = true;
      state.disk.blocks[blockId].used = true;
      state.disk.blocks[blockId].inodeId = inodeId;
      if (!state.disk.blocks[blockId].blockType) {
          state.disk.blocks[blockId].blockType = 'data';
      }
    }
    
    return {
        blocks: allBlocks,
        unixStructure: {
            direct,
            singleIndirect,
            doubleIndirect
        }
    };
  }
  
  else if (strategy === 'fat') {
    // File Allocation Table (FAT) allocation
    // Similar to linked allocation, but the chain lives in a global FAT table
    // rather than in the blocks themselves. Each directory entry only stores
    // the *first* cluster number; the rest are retrieved by walking the FAT.
    const blocks = findAnyFreeBlocks(state.disk, blocksNeeded);

    if (blocks.length < blocksNeeded) {
      throw new Error(`Not enough disk space. Need ${blocksNeeded} blocks.`);
    }

    // Ensure fatTable exists (backward compat with saved states)
    if (!state.disk.fatTable) {
      state.disk.fatTable = new Array(state.disk.totalBlocks).fill(-2);
    }

    // Wire up the FAT chain
    for (let i = 0; i < blocks.length; i++) {
      const blockId = blocks[i];
      const nextBlockId = i < blocks.length - 1 ? blocks[i + 1] : -1; // -1 = EOF

      state.disk.freeBlockBitmap[blockId] = true;
      state.disk.blocks[blockId].used = true;
      state.disk.blocks[blockId].inodeId = inodeId;
      state.disk.blocks[blockId].blockType = 'data';
      state.disk.blocks[blockId].fatNextBlock = nextBlockId;
      state.disk.fatTable[blockId] = nextBlockId;
    }

    return { blocks };
  }

  throw new Error(`Unknown allocation strategy: ${strategy}`);
}

/**
 * Free disk blocks
 * 
 * When a file is deleted, we must return its blocks to the free pool.
 * This is done by updating the bitmap and block metadata.
 */
export function freeBlocks(state: FileSystemState, blockIds: number[]): void {
  for (const blockId of blockIds) {
    state.disk.freeBlockBitmap[blockId] = false;
    state.disk.blocks[blockId].used = false;
    state.disk.blocks[blockId].inodeId = null;
    state.disk.blocks[blockId].fatNextBlock = undefined;
    // Reset FAT entry to free (-2)
    if (state.disk.fatTable) {
      state.disk.fatTable[blockId] = -2;
    }
  }
}

/**
 * Create a new file
 * 
 * Steps:
 * 1. Allocate a new inode
 * 2. Allocate disk blocks based on file size
 * 3. Add entry to parent directory
 * 
 * Note: The filename is stored in the directory entry, NOT in the inode.
 */
export function createFile(
  state: FileSystemState,
  parentDirInodeId: number,
  name: string,
  sizeInKB: number
): Inode {
  const parentDir = state.directories.get(parentDirInodeId);
  if (!parentDir) {
    throw new Error('Parent directory not found');
  }
  
  // Check for duplicate name
  if (parentDir.entries.some(e => e.name === name)) {
    throw new Error(`A file or folder named "${name}" already exists`);
  }
  
  const sizeInBytes = sizeInKB * 1024;
  const inodeId = state.nextInodeId++;
  
  // Allocate blocks first (may throw if not enough space)
  const { blocks: blockPointers, indexBlockId, unixStructure } = allocateBlocks(state, sizeInBytes, inodeId);
  
  // Create the inode
  const inode: Inode = {
    id: inodeId,
    type: 'file',
    size: sizeInBytes,
    createdAt: new Date().toISOString(),
    permissions: { read: true, write: true, execute: false },
    blockPointers,
    allocationStrategy: state.currentAllocationStrategy,
    indexBlockId,
    directPointers: unixStructure?.direct,
    singleIndirectPointer: unixStructure?.singleIndirect,
    doubleIndirectPointer: unixStructure?.doubleIndirect,
  };
  
  state.inodes.set(inodeId, inode);
  
  // Add to parent directory
  parentDir.entries.push({ name, inodeId });
  
  return inode;
}

/**
 * Create a new directory
 * 
 * Similar to createFile, but:
 * - Type is 'directory'
 * - Size is 0 (or number of entries)
 * - No disk blocks needed (in our simplified model)
 */
export function createDirectory(
  state: FileSystemState,
  parentDirInodeId: number,
  name: string
): { inode: Inode; directory: Directory } {
  const parentDir = state.directories.get(parentDirInodeId);
  if (!parentDir) {
    throw new Error('Parent directory not found');
  }
  
  // Check for duplicate name
  if (parentDir.entries.some(e => e.name === name)) {
    throw new Error(`A file or folder named "${name}" already exists`);
  }
  
  const inodeId = state.nextInodeId++;
  
  // Create the inode
  const inode: Inode = {
    id: inodeId,
    type: 'directory',
    size: 0,
    createdAt: new Date().toISOString(),
    permissions: { read: true, write: true, execute: true },
    blockPointers: [], // Directories don't use blocks in our model
  };
  
  // Create the directory structure
  const directory: Directory = {
    inodeId,
    parentInodeId: parentDirInodeId,
    entries: [],
  };
  
  state.inodes.set(inodeId, inode);
  state.directories.set(inodeId, directory);
  
  // Add to parent directory
  parentDir.entries.push({ name, inodeId });
  
  return { inode, directory };
}

/**
 * Rename a file or directory
 * 
 * Key insight: Renaming is FAST because we only update the directory entry.
 * The inode and disk blocks remain unchanged. This is why:
 * - Moving a file within the same filesystem is instant (just update entry)
 * - Copying is slow (need to copy all blocks)
 */
export function renameEntry(
  state: FileSystemState,
  parentDirInodeId: number,
  oldName: string,
  newName: string
): void {
  const parentInode = state.inodes.get(parentDirInodeId);
  if (parentInode && !checkPermission(parentInode, 'write')) {
    throw new Error('Permission denied: Cannot rename in read-only directory');
  }
  
  const parentDir = state.directories.get(parentDirInodeId);
  if (!parentDir) {
    throw new Error('Parent directory not found');
  }
  
  // Check new name doesn't exist
  if (parentDir.entries.some(e => e.name === newName)) {
    throw new Error(`A file or folder named "${newName}" already exists`);
  }
  
  // Find and update the entry
  const entry = parentDir.entries.find(e => e.name === oldName);
  if (!entry) {
    throw new Error(`"${oldName}" not found`);
  }
  
  entry.name = newName;
}

/**
 * Delete a file
 * 
 * This is a multi-step process:
 * 1. Remove directory entry (unlink the name)
 * 2. Free disk blocks (return storage)
 * 3. Delete inode (remove metadata)
 * 
 * In real systems with hard links, we'd decrement a link count
 * and only delete when it reaches 0.
 */
export function deleteFile(
  state: FileSystemState,
  parentDirInodeId: number,
  name: string
): void {
  const parentDir = state.directories.get(parentDirInodeId);
  if (!parentDir) throw new Error('Parent directory not found');

  const parentInode = state.inodes.get(parentDirInodeId);
  if (parentInode && !checkPermission(parentInode, 'write')) {
    throw new Error('Permission denied: Cannot delete from read-only directory');
  }
  
  const entryIndex = parentDir.entries.findIndex(e => e.name === name);
  if (entryIndex === -1) {
    throw new Error(`"${name}" not found`);
  }
  
  const entry = parentDir.entries[entryIndex];
  const inode = state.inodes.get(entry.inodeId);
  
  if (!inode) {
    throw new Error('Inode not found');
  }
  
  if (inode.type === 'directory') {
    const dir = state.directories.get(entry.inodeId);
    if (dir && dir.entries.length > 0) {
      throw new Error('Cannot delete non-empty directory');
    }
    state.directories.delete(entry.inodeId);
  }
  
  // Free disk blocks
  freeBlocks(state, inode.blockPointers);
  
  // Remove inode
  state.inodes.delete(entry.inodeId);
  
  // Remove directory entry
  parentDir.entries.splice(entryIndex, 1);
}



/**
 * Get the full path to an inode
 */
export function getPath(state: FileSystemState, inodeId: number): string {
  if (inodeId === ROOT_INODE_ID) {
    return '/';
  }
  
  const parts: string[] = [];
  let currentId: number | null = inodeId;
  
  while (currentId !== null && currentId !== ROOT_INODE_ID) {
    const dir = state.directories.get(currentId);
    if (!dir) break;
    
    // Find this directory's name in its parent
    const parentDir = state.directories.get(dir.parentInodeId!);
    if (parentDir) {
      const entry = parentDir.entries.find(e => e.inodeId === currentId);
      if (entry) {
        parts.unshift(entry.name);
      }
    }
    currentId = dir.parentInodeId;
  }
  
  return '/' + parts.join('/');
}

/**
 * Get disk usage statistics
 */
export function getDiskStats(state: FileSystemState): {
  totalBlocks: number;
  usedBlocks: number;
  freeBlocks: number;
  totalSizeKB: number;
  usedSizeKB: number;
  freeSizeKB: number;
} {
  const usedBlocks = state.disk.freeBlockBitmap.filter(used => used).length;
  const freeBlocks = state.disk.totalBlocks - usedBlocks;
  
  return {
    totalBlocks: state.disk.totalBlocks,
    usedBlocks,
    freeBlocks,
    totalSizeKB: (state.disk.totalBlocks * BLOCK_SIZE) / 1024,
    usedSizeKB: (usedBlocks * BLOCK_SIZE) / 1024,
    freeSizeKB: (freeBlocks * BLOCK_SIZE) / 1024,
  };
}

// ============ Persistence ============

/**
 * Save state to localStorage
 * 
 * Maps cannot be directly serialized, so we convert to arrays
 */
export function saveToStorage(state: FileSystemState, storageKey: string = 'visual-fs-state'): void {
  const serializable: SerializableFileSystemState = {
    inodes: Array.from(state.inodes.entries()),
    directories: Array.from(state.directories.entries()),
    disk: state.disk,
    nextInodeId: state.nextInodeId,
    rootInodeId: state.rootInodeId,
    currentAllocationStrategy: state.currentAllocationStrategy,
  };
  
  localStorage.setItem(storageKey, JSON.stringify(serializable));
}

/**
 * Load state from localStorage
 */
export function loadFromStorage(storageKey: string = 'visual-fs-state'): FileSystemState | null {
  const data = localStorage.getItem(storageKey);
  if (!data) {
    return null;
  }
  
  try {
    const serializable: SerializableFileSystemState = JSON.parse(data);
    
    // Migration: Convert string permissions to PermissionSet
    const inodes = new Map(serializable.inodes);
    for (const inode of inodes.values()) {
        if (typeof inode.permissions === 'string') {
            const p = inode.permissions as unknown as string;
            inode.permissions = {
                read: p.includes('r'),
                write: p.includes('w'),
                execute: p.includes('x') || inode.type === 'directory',
            };
        }
    }

    return {
      inodes,
      directories: new Map(serializable.directories),
      disk: serializable.disk,
      nextInodeId: serializable.nextInodeId,
      rootInodeId: serializable.rootInodeId,
      currentAllocationStrategy: serializable.currentAllocationStrategy || 'contiguous', // Backward compatibility
    };
  } catch {
    console.error('Failed to parse file system state');
    return null;
  }
}

/**
 * Clear storage and reinitialize
 */
export function resetFileSystem(storageKey: string = 'visual-fs-state'): FileSystemState {
  localStorage.removeItem(storageKey);
  return initializeFileSystem();
}

/**
 * Switch the allocation strategy
 */
export function switchAllocationStrategy(
  state: FileSystemState,
  newStrategy: AllocationStrategy
): void {
  state.currentAllocationStrategy = newStrategy;
}

/**
 * Calculate fragmentation percentage (for contiguous allocation)
 */
export function calculateFragmentation(disk: Disk): number {
  // Simple external fragmentation metric:
  // 1 - (Largest Contiguous Block / Total Free Blocks)
  
  let maxContiguous = 0;
  let currentContiguous = 0;
  let totalFree = 0;
  
  for (let i = 0; i < disk.totalBlocks; i++) {
    if (!disk.freeBlockBitmap[i]) {
      // Block is free
      totalFree++;
      currentContiguous++;
    } else {
      // Block is used
      maxContiguous = Math.max(maxContiguous, currentContiguous);
      currentContiguous = 0;
    }
  }
  maxContiguous = Math.max(maxContiguous, currentContiguous);
  
  if (totalFree === 0) return 0;
  
  return Math.round((1 - (maxContiguous / totalFree)) * 100);
}

export function checkPermission(inode: Inode, operation: 'read' | 'write' | 'execute'): boolean {
  if (!inode.permissions) return true; // Safety
  return inode.permissions[operation];
}

export function updateFilePermissions(
  state: FileSystemState,
  inodeId: number,
  permissions: PermissionSet
): void {
  const inode = state.inodes.get(inodeId);
  if (!inode) {
    throw new Error('Inode not found');
  }
  inode.permissions = permissions;
}
