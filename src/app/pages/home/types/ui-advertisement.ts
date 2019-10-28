import { Advertisement } from 'src/app/shared/third-party-apis/native';

export interface UIAdvertisement {
  id: string;
  advertisement: Advertisement;
  isFavourite: boolean;
}
