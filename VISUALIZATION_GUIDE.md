# TriCoreFS Visualization Guide

Welcome to the TriCoreFS Visualization tool! This route provides an interactive, visual way to understand how different file system allocation strategies manage disk space and inodes under the hood.

This guide will walk you through how to use the interface, what each allocation strategy does, and provide step-by-step test scenarios so you can see the strengths and weaknesses of each approach in real-time.

---

## The Interface Overview

The Visualization route is divided into four main panels:

1. **Directory Tree (Left):** Shows the hierarchical structure of your folders.
2. **File Explorer (Center):** Displays the files in the currently selected directory. You can toggle between List and Grid views. From here, you can right-click to create, rename, or delete files.
3. **Inspector (Right):** Shows detailed metadata about the currently selected file, including its Inode number, size, creation date, permissions, path resolution steps, and an exact list of the disk blocks allocated to it.
4. **Disk Block Visualizer (Bottom):** A real-time heatmap of your entire disk. Each tiny square represents one 4KB disk block. 
   - **Empty squares:** Free blocks
   - **Filled squares:** Allocated blocks
   - **Highlighted squares:** Blocks belonging to the currently selected file.

---

## Testing File Operations
*Before diving into strategies, let's learn how to trigger the visualization.*

1. Select the **Root** (`/`) directory in the left Tree panel.
2. In the central File Explorer, right-click and select **New Folder** or click the **New File** icon in the header.
3. When creating a file, you are asked for a **Size (KB)**. The system uses a **4KB block size**. 
   - A `4KB` file takes 1 block.
   - A `12KB` file takes 3 blocks.
   - A `20KB` file takes 5 blocks.

---

## Allocation Strategies: Explanations & Test Scenarios

To change the current strategy, click the **"Strategy"** dropdown in the top toolbar. Remember that changing the strategy will re-allocate existing files based on the new rules.

### 1. Contiguous Allocation
**How it works:** Files must be stored in a single, unbroken line of contiguous blocks on the disk. 
**Pros:** Extremely fast sequential read performance (the disk head just reads straight across).
**Cons:** Suffers terribly from **External Fragmentation**. Over time, as files are created and deleted, gaps appear between files. Even if there are enough free blocks in total, if they aren't contiguous, a new large file cannot be saved.

**Test Scenario (See External Fragmentation in action):**
1. Set strategy to **Contiguous**.
2. Create `File A` with a size of **20KB** (5 blocks).
3. Create `File B` with a size of **12KB** (3 blocks).
4. Create `File C` with a size of **40KB** (10 blocks).
5. Look at the disk visualizer at the bottom. You will see three distinct blocks of data right next to each other.
6. Now, **Delete `File B`**.
7. Look at the disk visualizer. You will see a 3-block "gap" surrounded by `File A` and `File C`.
8. Try to create `File D` with a size of **16KB** (4 blocks).
9. You will notice `File D` does *not* go into the gap left by `File B` (because it's only 3 blocks wide and `File D` needs 4). `File D` is appended at the very end. The gap left by `File B` is largely wasted space (external fragmentation). 

---

### 2. Linked Allocation
**How it works:** Files are stored as a linked list. Each block contains the user data *and* a pointer to the next block in the file.
**Pros:** No external fragmentation. A file can grow perfectly into any available free blocks scattered across the disk.
**Cons:** Poor random access performance (to read block 10, you must read blocks 1 through 9 to follow the pointers). Also wastes a tiny bit of space in each block for the pointer itself.

**Test Scenario (See Scattered Allocation):**
1. Ensure your disk has the gap created in the previous test (or randomly create/delete files).
2. Set strategy to **Linked**.
3. Create `File E` with a size of **40KB** (10 blocks).
4. Look at the disk visualizer. You will see the blocks for `File E` instantly fill any tiny scattered gaps available on the disk before appending the rest to the end.
5. Click on `File E` and look at the **Inspector**. Notice the "Allocated Blocks" section lists non-sequential block numbers (e.g., `5, 6, 7, 21, 22...`).

---

### 3. Indexed Allocation
**How it works:** Instead of blocks pointing to each other, an "Index Block" is maintained for each file. This special block contains an array of direct pointers to all the data blocks for that file.
**Pros:** Excellent random access. No external fragmentation.
**Cons:** Wasted space for small files (an entire index block must be allocated even for a 1-byte file). Also has a maximum file size limit based on how many pointers can fit in a single index block.

**Test Scenario (See Index Block Overhead):**
1. Switch strategy to **Indexed**.
2. Create `File X` with a tiny size of **1KB**.
3. Look at the disk visualizer and the **Inspector** panel. 
4. Notice that even though the file is tiny, it actually takes up **2 blocks**: 1 for the actual data, and 1 dedicated completely to being the "Index Block" which holds pointers.
5. Create `File Y` with a size of **40KB** (10 blocks).
6. The Inspector will show the same overhead: 1 Index Block + 10 Data Blocks. This visually demonstrates how Indexed allocation avoids external fragmentation (blocks can be scattered) but suffers from high internal metadata overhead for very small files.

---

### 4. FAT (File Allocation Table)
**How it works:** A variant of linked allocation. Instead of pointers being inside the data blocks alongside your actual files, all pointers are pulled out and placed into a single, global table at the beginning of the disk (the FAT).
**Pros:** Because the FAT is heavily cached in RAM, finding the chain of blocks is incredibly fast without requiring disk reads, solving the random-access issue of standard Linked Allocation.
**Cons:** The FAT takes up space permanently, and if the FAT gets corrupted, the entire file system is lost.

**Test Scenario (See Global Table Efficiency):**
1. Switch strategy to **FAT**.
2. Create `File M` (12KB), `File N` (16KB), and `File O` (24KB).
3. Now delete `File N` to leave a 4-block gap.
4. Create `File P` (32KB). Like Linked and Indexed, it will intelligently fragment into the gap and append the rest.
5. Look at the **Inspector** under the "OS Concept" note. Unlike standard Linked Allocation (where each scattered block must be sequentially physically read from disk to find the address of the next), here the directory entry *only* tracks the very first cluster. To find the rest of `File P`, the OS instantly reads a single global FAT table kept in memory, bypassing expensive disk jumps.

---

### 5. UNIX / Ext (Multi-level Indexed)
**How it works:** A hybrid structure. The inode contains a mix of Direct Pointers (for small files), a Single Indirect Pointer (for medium files), a Double Indirect Pointer (for large files), and a Triple Indirect Pointer (for massive files).
**Pros:** Supremely efficient. Small files have zero overhead (direct pointers in the inode). Massive files can still be addressed easily. 
**Cons:** Highly complex to implement.

**Test Scenario (See Hybrid Efficiency):**
1. Switch strategy to **UNIX**.
2. Create a small file: `Small_File` with a size of **4KB** (1 block).
3. Look at the disk and Inspector. Unlike basic Indexed allocation, there is **0 overhead** for an index block! The pointer to this single data block fits directly right inside the Inode itself.
4. Now, create a massive file: `Large_File` with a size of **64KB** (16 blocks).
5. At this size, the file exceeds the typical 12 direct pointers that fit natively in a UNIX Inode. The OS dynamically allocates a "Single Indirect Block" to hold the remaining pointers. You'll see an extra block of overhead suddenly allocated just to hold these extended pointers. This hybrid approach keeps tiny files perfectly efficient (like Contiguous) while still supporting large ones (like Indexed).

---

## Exploring the Inspector (Path Resolution)
TriCoreFS simulates how classical OS path resolution works.
1. Create a `New Folder` named `projects`.
2. Inside `projects`, create another folder named `src`.
3. Inside `src`, create a file `main.ts`.
4. Click on `main.ts` and focus on the **Path Resolution** card in the Inspector on the right.
5. You will see exactly how the OS resolves `/projects/src/main.ts` starting from Inode 0 (`/`), looking up the block for `projects`, scanning its entries to find the inode for `src`, jumping to `src`'s block, and finally finding the inode for `main.ts`.
