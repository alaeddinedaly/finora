declare module "expo-image-picker" {
  export interface ImagePickerResult {
    cancelled: boolean;
    uri?: string;
    width?: number;
    height?: number;
  }
}
