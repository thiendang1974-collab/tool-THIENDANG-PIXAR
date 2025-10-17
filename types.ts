
export interface ImageFile {
  file: File;
  preview: string;
}

export interface ImageTransform {
  scale: number;
  position: { x: number; y: number };
}

export interface CharacterImage extends ImageFile {
  selected: boolean;
  transform: ImageTransform;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "3:4";
