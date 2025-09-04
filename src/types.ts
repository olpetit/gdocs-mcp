/**
 * Shared types and interfaces for the Google Docs MCP Server
 */

import { docs_v1, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// OAuth2.0 scopes for Google APIs
export const SCOPES = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.readonly"
];

// API Client types
export interface ApiClients {
  docsClient: docs_v1.Docs;
  driveClient: drive_v3.Drive;
}

// Authentication configuration
export interface AuthConfig {
  tokenPath: string;
  credentialsPath: string;
  scopes: string[];
}

// Document operation types
export interface DocumentRange {
  startIndex: number;
  endIndex: number;
}

export interface HeadingInfo {
  text: string;
  level: number;
  startIndex: number;
}

// List style types
export type ListType = 'BULLET' | 'NUMBERED' | 'ALPHA' | 'ROMAN';
export type AlignmentType = 'LEFT' | 'CENTER' | 'RIGHT';
export type PageNumberFormat = '1' | 'i' | 'I' | 'a' | 'A';
export type QualityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// Export configuration
export interface ExportConfig {
  quality: QualityLevel;
  includeComments: boolean;
  includeSuggestions: boolean;
}

// Image insertion configuration
export interface ImageConfig {
  width?: number;
  height?: number;
  alignment: AlignmentType;
  title?: string;
}

// Table of contents configuration
export interface TOCConfig {
  title: string;
  includePageNumbers: boolean;
  maxDepth: number;
}

// Header/Footer configuration
export interface HeaderFooterConfig {
  headerText?: string;
  footerText?: string;
  includePageNumbers: boolean;
  pageNumberFormat: PageNumberFormat;
  alignment: AlignmentType;
}

// List style configuration
export interface ListStyleConfig {
  listType: ListType;
  indentLevel: number;
  startNumber: number;
}

// Error response type
export interface ErrorResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError: true;
}

// Success response type
export interface SuccessResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: false;
}

export type ToolResponse = SuccessResponse | ErrorResponse;
