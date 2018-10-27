
export interface ApartmentRequirements {
  county?: string,
  city?: string,
  districts?: Array<string>,
  minRoomsCount?: number,
  maxRoomsCount?: number,
  minSquare?: number,
  maxSquare?: number,
  minPrice?: number,
  maxPrice?: number,
}
