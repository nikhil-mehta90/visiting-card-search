# visiting-card-search
Simple workflow to Search and Filter on visiting cards in Google Sheets using appscript functions for Image OCR, Fields Extraction (using Regex/ GPT), Classification & Analysis

## Problem
Sales and customer-facing teams collect hundreds of visiting cards during meetings but lack a scalable way to search and contact these connections at a later point based on business context

## Solution
A lightweight workflow using:
- Google Drive (image storage)
- Google Vision API (OCR)
- Google Apps Script (automation)
- Regex + GPT (entity extraction)
- Google Sheets (analysis-ready output)

## Workflow
1. Scan visiting cards as JPG to Google Drive
2. Google Sheets triggers Apps Script
3. OCR text extracted via Vision API
4. Regex extracts email, phone, website
5. GPT extracts name, title, company, address
6. Structured output usable for pivots & enrichment

## Why this approach?
- Cheap at scale (Vision + nano model)
- Transparent logic (regex first, GPT only where needed)
- Easy for non-engineers to operate

## Sample Output
| Name | Company | Email | Phone | Website | Title | Address |

## Limitations
- OCR accuracy depends on image quality
- Multi-language cards need tuning
- GPT extraction may need prompt iteration

## Future Improvements
- Deduplication logic
- CRM export
- Confidence scoring per field
