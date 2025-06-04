/**
 * Represents a single pain entry in the tracker
 */
export interface PainEntry {
  /** Unique identifier for the entry */
  id: string;
  
  /** The body part affected by pain */
  bodyPart: string;
  
  /** Pain level on a scale from 0-10 */
  painLevel: number;
  
  /** Timestamp when the entry was created (in milliseconds) */
  timestamp: number;
}