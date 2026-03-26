# Smart File Organiser Guide

Welcome to the **Smart File Organiser**! This guide will explain how to use the `/organiser` route, what it does, and how it works under the hood.

## Overview

The Smart File Organiser is a browser-based, Finder-inspired tool designed to help you analyze and categorize local folders effortlessly. It reads a folder from your computer, visualizes its contents in a clean UI, and allows you to virtually "organise" the files entirely within the browser—without making any permanent or destructive changes to your actual hard drive.

---

## How to Use It

1. **Access the Organiser**
   Navigate to `/organiser` in your browser, or click the **Organiser** link in the navigation bar.

2. **Upload a Folder**
   You have two ways to load a folder into the application:
   - **Drag and Drop**: Simply drag a single folder from your computer and drop it into the main dashed-border area.
   - **Manual Selection**: Click the **"Browse Folder"** button to open your system's folder selection dialog.

3. **Explore Your Files**
   Once uploaded, the interface will transform into a macOS-style file browser.
   - **Locations Sidebar**: You'll see your uploaded folder listed under "Local Disk".
   - **Main Window**: Browse through your nested folders by clicking on them. 
   - **Navigation**: Use the breadcrumbs at the top or the Back button to navigate up the folder tree.
   - **Views**: Toggle between List and Grid views using the icons in the toolbar.

4. **Organise Your Files**
   Click the **Organise** button in the top right. 
   - You'll see a brief analyzing animation.
   - Once complete, a new virtual folder called **"Organised"** will appear in the left sidebar.
   - Clicking on this folder reveals your files automatically categorized into sub-folders like `images`, `pdfs`, `videos`, `documents`, and `others` based on their file extensions.

5. **Resetting**
   If you want to analyze a different folder, click the **Reset** button in the toolbar to clear the current analysis and return to the upload screen.

---

## How It Works Internally

The Organiser is built using modern Web APIs and React, prioritizing performance and user experience while guaranteeing safety by remaining entirely virtual.

### 1. Folder Uploading & Parsing

When you upload a folder, whether through Drag & Drop or the File Input:
- **Drag & Drop (`handleDrop`)**: Uses the `DataTransferItem.webkitGetAsEntry()` API to access the `FileSystemDirectoryEntry`. It then recursively traverses the entire folder structure using `FileSystemDirectoryReader`.
- **File Input (`handleFileInput`)**: Uses `<input type="file" webkitdirectory directory multiple />`. This returns a flat list of all nested files with their relative paths (`webkitRelativePath`). The app manually reconstructs the hierarchical folder tree from these paths.

Both methods yield a unified `FileNode` data structure stored in React state:
```typescript
export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number;
  extension?: string;
  children?: FileNode[]; // Present if type is 'folder'
};
```

### 2. State Management & Navigation

- **`fileTree`**: Stores the complete recursive layout of the initially uploaded folder.
- **`currentFolderList`**: Stores the array of `FileNode`s that are actively being viewed on the screen.
- **`navigationPath`**: Maintains breadcrumb history. When you click a folder, the app appends that folder to the `navigationPath` and sets its `children` to the `currentFolderList`.

### 3. Pure Virtual Organization Logic

The "Organise" feature is fundamentally a pure state mapping function. It guarantees **Zero Mutability** of the user's actual local file system.

When you click **Organise**:
1. A recursive `collectFiles` function walks through the massive `fileTree` state.
2. It grabs every single node of type `'file'`.
3. It extracts the `extension` of each file.
4. It bins the files into predefined categories (`images`, `pdfs`, etc.) according to extension whitelists (e.g., `jpg`, `png`, `gif` go to `images`).
5. It generates a brand-new top-level `FileNode` labeled `organised`, with children representing the categories.
6. This new tree is saved to the `organisedFolder` state, making it available in the sidebar for browsing.

Because the app generates entirely new UUIDs for these categorized nodes and stores them in isolated React State, it achieves safe, non-destructive file analysis!
