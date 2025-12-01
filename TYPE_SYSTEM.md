# Tour Type System - Migration Guide

## Overview

The Tour type system has been unified to eliminate confusion between three competing definitions. This document explains the new type system and how to migrate your code.

## Type Hierarchy

### Core Types

**`Tour`** - The primary unified type
- Located in: `src/types/tour.types.ts`
- Use this for all new components and business logic
- Supports multilingual content
- Normalized structure with proper typing

**`ApiTourResponse`** - API response from NestJS backend
- Raw response format from the current backend
- Use adapters to convert to `Tour` type

**`LaravelTourResponse`** - Legacy API response format
- Raw response from old Laravel backend
- Use adapters to convert to `Tour` type

**`LegacyTour`** - Old UI component type
- Deprecated, use `Tour` instead
- Provided for backward compatibility during migration

## Migration Path

### 1. For Components Using Old Tour Type

**Before:**
```typescript
import { Tour } from '../types';

function TourCard({ tour }: { tour: Tour }) {
  return <div>{tour.title}</div>;
}
```

**After:**
```typescript
import { Tour } from '../types/tour.types';
import { getLocalizedTourTitle } from '../utils/tour-adapters';

function TourCard({ tour }: { tour: Tour }) {
  const title = getLocalizedTourTitle(tour, currentLang);
  return <div>{title}</div>;
}
```

### 2. For API Service Methods

**Before:**
```typescript
async function fetchTours(): Promise<ApiTour[]> {
  const response = await fetch('/api/tours');
  return response.json();
}
```

**After:**
```typescript
import { ApiTourResponse, Tour } from '../types/tour.types';
import { adaptApiTourToTour } from '../utils/tour-adapters';

async function fetchTours(lang: string): Promise<Tour[]> {
  const response = await fetch('/api/tours');
  const apiTours: ApiTourResponse[] = await response.json();
  return apiTours.map(tour => adaptApiTourToTour(tour, lang));
}
```

### 3. For Legacy Components

If you need to support legacy components during migration:

```typescript
import { Tour, LegacyTour } from '../types/tour.types';
import { adaptTourToLegacy } from '../utils/tour-adapters';

function legacyComponentWrapper(tour: Tour, lang: string): LegacyTour {
  return adaptTourToLegacy(tour, lang);
}
```

## Adapter Functions

Located in `src/utils/tour-adapters.ts`:

### Conversion Functions

- `adaptApiTourToTour(apiTour, lang)` - Convert API response to Tour
- `adaptLaravelTourToTour(laravelTour, lang)` - Convert Laravel API to Tour
- `adaptTourToLegacy(tour, lang)` - Convert Tour to legacy format

### Utility Functions

- `getLocalizedTourTitle(tour, lang)` - Get tour title in specific language
- `getLocalizedTourDescription(tour, lang)` - Get tour description in specific language
- `getTourPrimaryImage(tour)` - Get primary tour image URL
- `formatTourPrice(price, locale)` - Format price with currency
- `isTourAvailable(tour)` - Check if tour is available for booking
- `getTourAvailableSpots(tour)` - Get remaining available spots

## Type Features

### Multilingual Support

```typescript
interface Tour {
  title: MultilingualText & { default?: string };
  description: MultilingualText & { default?: string };
  // ...
}

interface MultilingualText {
  uz?: string;
  ru?: string;
  eng?: string;
  de?: string;
}
```

### Price Handling

```typescript
interface TourPrice {
  amount: number;
  currency: string;
}

// Usage
const priceText = formatTourPrice(tour.price, 'en-US');
// Output: "UZS 350,000" or "$350"
```

### Image Management

```typescript
interface TourImage {
  id?: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

// Usage
const mainImage = getTourPrimaryImage(tour);
```

## Migration Checklist

- [ ] Update imports from `../types` to `../types/tour.types`
- [ ] Use adapter functions when receiving API data
- [ ] Use utility functions for localization
- [ ] Replace direct property access with helper functions
- [ ] Update TypeScript types in function signatures
- [ ] Test with different languages
- [ ] Verify price display formatting
- [ ] Check image rendering

## Common Patterns

### Displaying Tour in Component

```typescript
import { Tour } from '../types/tour.types';
import {
  getLocalizedTourTitle,
  getTourPrimaryImage,
  formatTourPrice
} from '../utils/tour-adapters';

function TourCard({ tour, lang }: { tour: Tour; lang: string }) {
  const title = getLocalizedTourTitle(tour, lang);
  const image = getTourPrimaryImage(tour);
  const price = formatTourPrice(tour.price, 'en-US');

  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  );
}
```

### Fetching and Adapting API Data

```typescript
import { useTours } from '../hooks/useTours';
import { useLanguage } from '../contexts/LanguageContext';

function TourList() {
  const { currentLang } = useLanguage();
  const { tours, loading, error } = useTours(currentLang);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {tours.map(tour => (
        <TourCard key={tour.id} tour={tour} lang={currentLang} />
      ))}
    </div>
  );
}
```

## Benefits of New Type System

✅ **Type Safety** - No more `any` types, proper TypeScript checking
✅ **Consistency** - Single source of truth for Tour data structure
✅ **Multilingual** - Built-in support for 4 languages
✅ **Maintainability** - Centralized types and adapters
✅ **Testability** - Clear adapter functions for testing
✅ **Documentation** - Self-documenting with TypeScript interfaces

## Troubleshooting

### Type Errors After Migration

If you see errors like `Property 'title' does not exist on type 'Tour'`:
- Tour.title is now multilingual: use `getLocalizedTourTitle(tour, lang)`
- Tour.price is now an object: use `tour.price.amount`
- Tour.images is now array of objects: use `getTourPrimaryImage(tour)`

### Missing Properties

Old properties that no longer exist:
- `tour.location` → `tour.destination`
- `tour.max_participants` → `tour.maxParticipants`
- `tour.reviews_count` → `tour.reviewCount`

### Language Not Showing

Make sure to pass the current language to all adapter functions:
```typescript
const { currentLang } = useLanguage();
const title = getLocalizedTourTitle(tour, currentLang);
```

## Questions?

See `/Users/tenxengineer/2_Projects/2. Qalb Tech/12_Booking_System_DJIDALI/travel-erp/djidali-front/src/types/tour.types.ts` for complete type definitions.
