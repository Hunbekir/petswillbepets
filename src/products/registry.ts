import type { ComponentType } from 'react';
import type { ProductConfig, SectionConfig } from '../content/types';
import { CarryMechanism } from './waste-bags/CarryMechanism';

type Custom = Extract<SectionConfig, { type: 'custom' }>;

/**
 * Product-specific storytelling components, referenced from product config
 * sections as { type: 'custom', component: '<key>' }.
 */
export const customSections: Record<string, ComponentType<{ product: ProductConfig; section: Custom }>> = {
  'carry-mechanism': CarryMechanism,
};
