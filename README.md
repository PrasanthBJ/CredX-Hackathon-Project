# Job ATS Analyzer

A powerful, entirely local Applicant Tracking System (ATS) parser and interactive chatbot. This tool evaluates a candidate's resume (PDF) against a provided Job Description (text file), scores it on a 1-100 scale, and provides an interactive terminal UI to dive deeper into the results without relying on any external APIs.

## Project Structure

```
job-ats/
├── README.md               - Project documentation
├── requirements.txt        - Python dependencies
├── src/                    - Core source code
│   ├── __init__.py
│   ├── parser.py           - Extracts structured data from the PDF resume
│   ├── jd_analyzer.py      - Calculates cosine similarity and skill matching
│   ├── ats_analyzer.py     - Generates basic ATS metadata scores
│   └── chat_analyzer.py    - Interactive Terminal Chat Interface
└── tests/                  - Unit tests
```

## Setup & Installation

1. Install Python 3.9+
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Place your resume (`sanju.pdf`) and job description (`jd.txt`) in the root directory.

### Interactive Chat Analyzer (Recommended)
This runs the full analysis and launches a dynamic, nested menu system in your terminal to explore why you were or were not selected.
```bash
python src/chat_analyzer.py
```

### Standalone JD Analyzer
To just print the full ATS report without the chat menu:
```bash
python src/jd_analyzer.py
```

## Technologies Used
- `PyMuPDF` (fitz) - For robust PDF parsing.
- `scikit-learn` - `TfidfVectorizer` and `cosine_similarity` for calculating the contextual text match between the resume and job description.
- Vanilla Python - Core logic, interactive menus, and file handling.
