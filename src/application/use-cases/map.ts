import type {Coordinates} from '@/domain/entities/Reservation';
import type {IMapService, RouteEstimation, SearchAddressResult} from '@/domain/services/IMapService';

export class SearchAddressUseCase {
  constructor(private readonly mapService: IMapService) {}

  execute(query: string): Promise<SearchAddressResult[]> {
    return this.mapService.searchAddress(query);
  }
}

export class EstimateRouteUseCase {
  constructor(private readonly mapService: IMapService) {}

  execute(stops: Coordinates[]): Promise<RouteEstimation> {
    return this.mapService.estimateRoute(stops);
  }
}
