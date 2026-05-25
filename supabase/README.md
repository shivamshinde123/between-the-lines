# Supabase

This folder holds the database and storage foundation for Between the Lines.

## Purpose

- schema migrations
- row-level security policies
- storage bucket setup conventions
- future local Supabase configuration

## Current Structure

- `migrations/`: SQL migrations that define the application schema and policies

## Notes

- The Stage 2 migration creates the core tables for profiles, books, thought entries, and generated insights.
- It also creates the private `book-covers` storage bucket metadata and the matching storage policies.
- Newer Supabase projects may require explicit grants for authenticated access in addition to RLS, so the migration includes those grants intentionally.
