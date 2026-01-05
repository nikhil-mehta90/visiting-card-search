# OCR Contact Extraction (Google Sheets)

Extract **Mobile**, **Email**, and **Website** from unstructured OCR text
(e.g. Google Vision API output) using separate columns.

---

## Setup

- **Input:** `input!B2` → full OCR text  
- **Helper:** `F1` → `mob`  
- **Output columns:**  
  - `C` → Mobile  
  - `D` → Email  
  - `E` → Website  

---

## Formulas

# Mobile (C2)
=IF(
  LEN(PHONE(input!B2, F$1)) < 2,
  REGEXEXTRACT(input!B2, "\+?\d[\d\s\-]{8,}"),
  PHONE(input!B2, F$1)
)

# Email (D2)
=REGEXEXTRACT(
  input!B2,
  "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
)

# Website (E2)
=IFERROR(
  REGEXEXTRACT(input!B2, "(www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,})"),
  "www." & REGEXEXTRACT(input!B2, "@([A-Za-z0-9.-]+\.[A-Za-z]{2,})")
)
