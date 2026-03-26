/**
 * Visual File System Simulator - Type Definitions
 * 
 * This file defines the core data structures that model how a real
 * operating system organizes files on disk. These structures are
 * simplified versions of what you'd find in Unix-like file systems.
 */

/**
 * Inode (Index Node)
 * 
 * In real file systems, an inode stores all metadata about a file
 * EXCEPT its name. The name is stored separately in directory entries.
 * This separation allows features like hard links (multiple names → same inode).
 * 
 * Key insight: The inode number uniquely identifies a file in the system.
 */
export interface PermissionSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface Inode {
  /** Unique identifier for this inode */
  id: number;
  
  /** Type of entry: 'file' or 'directory' */
  type: 'file' | 'directory';
  
  /** Size in bytes (for files) or number of entries (for directories) */
  size: number;
  
  /** Creation timestamp (ISO string) */
  createdAt: string;


  


  /** 
   * Unix-style permissions
   * Simplified to Owner permissions only for this simulation.
   */
  permissions: PermissionSet;
  
  /**
   * Block Pointers
   * 
   * These are indexes into the disk block array where the file's
   * data is stored. A file that needs 3 blocks would have 3 entries.
   * 
   * In real file systems, large files use indirect pointers:
   * - Direct pointers: First ~12 blocks
   * - Indirect pointer: Points to a block containing more pointers
   * - Double indirect: For very large files
   * 
   * We simplify to only direct pointers for educational clarity.
   */
  /**
   * Flattened list of all blocks used by this file.
   * Consolidates direct, indirect, and double-indirect blocks for easy visualization.
   */
  blockPointers: number[];
  
  // Real OS Inode Structure (for Feature 2)
  directPointers?: number[];        // Direct data blocks
  singleIndirectPointer?: number | null; // Pointer to index block
  doubleIndirectPointer?: number | null; // Pointer to block of index blocks
  tripleIndirectPointer?: number | null; // (Optional, usually overkill)
  
  /**
   * Allocation Strategy Used
   * Tracks which allocation method was used for this file
   */
  allocationStrategy?: AllocationStrategy;
  
  /**
   * Index Block ID (for indexed allocation)
   * Points to the block containing the index of data block pointers
   */
  indexBlockId?: number | null;
}

/**
 * Directory Entry
 * 
 * A directory is essentially a special file that contains a mapping
 * of names to inode numbers. This is why renaming a file is fast:
 * we only update this mapping, not the actual file data.
 */
export interface DirectoryEntry {
  /** Human-readable name (what users see) */
  name: string;
  
  /** Reference to the inode (actual file metadata) */
  inodeId: number;
}

/**
 * Directory
 * 
 * Represents a folder in the file system. Contains a list of
 * entries (name → inode mappings) for files and subdirectories.
 */
export interface Directory {
  /** The inode ID of this directory */
  inodeId: number;
  
  /** Parent directory's inode ID (null for root) */
  parentInodeId: number | null;
  
  /** 
   * Directory entries: mapping of names to inode IDs
   * Using a map structure for O(1) lookups
   */
  entries: DirectoryEntry[];
}

/**
 * Disk Block
 * 
 * The smallest unit of storage allocation on a disk.
 * In our simulator, each block is 4KB (4096 bytes).
 * 
 * Real disks are divided into fixed-size blocks because:
 * 1. Easier to track free/used space
 * 2. Simpler allocation algorithms
 * 3. Reduced fragmentation management complexity
 */
export interface DiskBlock {
  /** Block index (0 to NUM_BLOCKS - 1) */
  id: number;
  
  /** Whether this block is currently allocated */
  used: boolean;
  
  /** 
   * Which inode is using this block (null if free)
   * This helps with visualization and debugging
   */
  inodeId: number | null;
  
  /**
   * Next Block Pointer (for linked allocation)
   * Points to the next block in the chain (null if last block or not using linked allocation)
   */
  nextBlockPointer?: number | null;
  
  /**
   * Block Type (for visualization)
   * Helps identify special blocks like index blocks
   */
  blockType?: 'data' | 'index';
  
  /**
   * FAT Next-Cluster value (for FAT allocation)
   * -1 = end of chain (EOF), -2 = free, any other number = next cluster index
   */
  fatNextBlock?: number;
}

/**
 * Disk
 * 
 * Represents the entire disk storage system.
 * Contains the blocks and a bitmap for tracking free space.
 */
export interface Disk {
  /** Total number of blocks on the disk */
  totalBlocks: number;
  
  /** Size of each block in bytes */
  blockSize: number;
  
  /** Array of all disk blocks */
  blocks: DiskBlock[];
  
  /**
   * Free Block Bitmap
   * 
   * A bitmap is an efficient way to track which blocks are free.
   * Each bit represents one block: 0 = free, 1 = used.
   * 
   * For 128 blocks, we only need 128 bits = 16 bytes!
   * This is much more efficient than storing a boolean array.
   * 
   * We use a boolean array here for clarity, but real systems
   * use actual bitmaps for memory efficiency.
   */
  freeBlockBitmap: boolean[];

  /**
   * File Allocation Table (FAT)
   * 
   * A flat array indexed by block number. Each entry stores:
   *   -2  → free cluster
   *   -1  → end-of-chain (last cluster of a file)
   *   N≥0 → index of the next cluster in the chain
   * 
   * This is conceptually identical to FAT12/FAT16/FAT32 on real disks.
   * The directory entry only needs the *first* cluster; following the
   * chain in the FAT gives all remaining clusters for the file.
   */
  fatTable?: number[];
}

/**
 * FileSystemState
 * 
 * The complete state of our simulated file system.
 * This is what gets persisted to localStorage.
 */
export interface FileSystemState {
  /** All inodes in the system */
  inodes: Map<number, Inode>;
  
  /** All directories (inode ID → directory data) */
  directories: Map<number, Directory>;
  
  /** The disk storage */
  disk: Disk;
  
  /** Next available inode ID (auto-increment) */
  nextInodeId: number;
  
  /** Root directory inode ID (always 0) */
  rootInodeId: number;
  
  /** Current allocation strategy */
  currentAllocationStrategy: AllocationStrategy;
}

/**
 * Serializable version of FileSystemState
 * Maps cannot be directly serialized to JSON, so we use arrays
 */
export interface SerializableFileSystemState {
  inodes: [number, Inode][];
  directories: [number, Directory][];
  disk: Disk;
  nextInodeId: number;
  rootInodeId: number;
  currentAllocationStrategy: AllocationStrategy;
}

/**
 * Allocation Strategy
 * 
 * Defines how disk blocks are allocated to files:
 * - contiguous: All blocks must be adjacent (fast access, but causes fragmentation)
 * - linked: Blocks contain pointers to next block (no external fragmentation, slower access)
 * - indexed: Index block contains pointers to all data blocks (good balance)
 * - unix: Hybrid approach (Direct + Indirect pointers) for scalable file sizes
 * - fat: File Allocation Table — chain stored in a global table, not in blocks themselves
 */
export type AllocationStrategy = 'contiguous' | 'linked' | 'indexed' | 'unix' | 'fat';

// Constants
export const BLOCK_SIZE = 4096; // 4KB per block
export const TOTAL_BLOCKS = 512; // Increased to 512 to allow double indirection demo
export const ROOT_INODE_ID = 0;

// Internal Constants for Simulation
export const MAX_DIRECT_POINTERS = 12;
export const POINTERS_PER_BLOCK = 16; // Small number to demonstrate indirection with fewer blocks
