import type { ImageRole, ProductConfig, SpecFigure } from '../content/types';
import { isClaimLive, liveOnly } from './claims';

export function displayName(p: ProductConfig) {
  return p.qualifiedName && isClaimLive(p.qualifiedName.claimId) ? p.qualifiedName.name : p.name;
}

export function imageRole(p: ProductConfig, key: string | undefined): ImageRole | null {
  if (!key) return null;
  const role = p.images[key];
  return role && role.asset ? role : null;
}

/** Specs requested by id, filtered to verified claims only. */
export function liveSpecs(p: ProductConfig, ids: string[]): SpecFigure[] {
  const byId = new Map(p.specs.map((s) => [s.id, s]));
  return liveOnly(ids.map((id) => byId.get(id)).filter((s): s is SpecFigure => !!s));
}
