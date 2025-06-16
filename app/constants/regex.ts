// Regular Expression Patterns

export const REGEX_PATTERNS = {
  GOOGLE_DRIVE_URL: /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  FILE_NAME_SANITIZE: /[^a-zA-Z0-9]/g,
} as const;

export const URL_TEMPLATES = {
  GOOGLE_DRIVE_DOWNLOAD: (fileId: string) =>
    `https://drive.google.com/uc?export=download&id=${fileId}`,
} as const;
