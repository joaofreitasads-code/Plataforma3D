export interface STLFile {
  name: string;
  url: string;
  size: string;
}

export interface Model3D {
  id: string;
  title: string;
  category: string;
  sectionId?: string;
  badge?: string;
  isHot?: boolean;
  driveUrl: string;
  downloadUrl?: string;
  imageUrl: string;
  thumbnailUrl: string;
  images?: string[];
  fileSize?: string;
  weightGrams?: number;
  filamentGrams?: number;
  printTimeHours?: number;
  suggestedPrice?: number;
  scale?: string;
  dimensions?: string;
  infill?: string;
  walls?: number;
  supports?: string;
  amsSupport?: boolean;
  colorTheme?: string;
  description?: string;
  commercialPermitted?: boolean;
  stlFiles?: STLFile[];
}
