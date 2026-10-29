# Resume design and maintenance

The current resume follows the user's Naukri reference: a navy name banner, blue left sidebar, white main column, bold section headings and horizontal rules. It uses embedded Arial fonts and selectable PDF text. Contact details, education and technical skills occupy the sidebar; the summary, projects and certifications occupy the main column. No sample identities, work experience, awards or references were copied.

Visual reference supplied by the user and inspected on 26 October 2026:
https://www.naukri.com/campus/career-guidance/wp-content/uploads/2024/07/Data-Analyst-Resume-for-Freshers.jpg

The user-selected two-column design replaces the earlier Harvard-inspired single-column layout. It is not ATS-certified; some parsers may handle columns differently. PDF text extraction and embedded fonts are verified locally, not through an employer's ATS.

Content comes from the previous resume, existing portfolio, and user-confirmed BillSahi details. No employers, dates, performance metrics or URLs were invented. BillSahi desktop is marked under development. Cafe Flex roadmap features are not presented as implemented.

Regenerate on Windows with `python scripts/build_resume.py` after installing reportlab, pypdf and pymupdf. Arial is loaded from Windows Fonts. The script creates `output/pdf/Shaik_Mohammad_Nowman_Resume.pdf`, checks page count and extracted content, renders `tmp/pdfs/resume-preview.png`, and copies the final PDF to `public/resume.pdf`. Existing website links already use `/resume.pdf`.

Validation: one page, embedded fonts, selectable text, expected content present, no replacement glyphs, visual review of the rendered page, and matching published/output PDF files.
