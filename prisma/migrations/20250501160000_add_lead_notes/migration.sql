-- Migration: Add notes column to Lead table
ALTER TABLE "Lead" ADD COLUMN "notes" TEXT;
