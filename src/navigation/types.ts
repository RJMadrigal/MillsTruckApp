import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../features/catalog/types/catalog.types';

export type MainTabParamList = {
  CatalogTab: { selectedCategoryId?: number } | undefined;
  CategoryTab: undefined;
  CartTab: undefined;
  ServicesTab?: undefined;
  InfoTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductDetail: { product: Product };
  Checkout: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
