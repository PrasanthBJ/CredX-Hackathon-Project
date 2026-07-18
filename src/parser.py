import fitz  # PyMuPDF
import re
import sys
import os
import json

def get_resume_data(pdf_path):
    if not os.path.exists(pdf_path):
        return {"error": f"File '{pdf_path}' not found."}

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        return {"error": f"Error opening PDF: {e}"}

    text = ""
    for page in doc:
        text += page.get_text()
    
    # 1. Email Extraction
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    email = emails[0] if emails else ""
    
    # 2. Phone Extraction
    phone_pattern = r'\+?\d{0,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    phone = phones[0] if phones else ""
    
    # 3. Name Extraction
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    name = lines[0] if lines else ""

    # 4. Skills Extraction
    skill_keywords = [
        "Python", "Java", "React", "Spring Boot", "C++", "C", "JavaScript", 
        "HTML", "CSS", "SQL", "Node.js", "Docker", "Kubernetes", "AWS", 
        "Machine Learning", "Data Structures", "Algorithms", "Agile", "OOP"
    ]
    skills = []
    for skill in skill_keywords:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            skills.append(skill)
            
    # 5. Education Extraction
    education_keywords = [
        "B.Tech", "M.Tech", "B.E", "B.Sc", "M.Sc", "BCA", "MCA", 
        "Bachelors", "Bachelor", "Masters", "Master", "PhD"
    ]
    education = ""
    for edu in education_keywords:
        if re.search(r'\b' + re.escape(edu) + r'\b', text, re.IGNORECASE):
            education = edu
            break
            
    # 6. Experience Extraction
    experience_pattern = r'(\d+)\+?\s*years?(?:\s+of)?\s+experience|\b(\d+)\s*years?\b'
    exp_matches = re.findall(experience_pattern, text, re.IGNORECASE)
    experience = ""
    if exp_matches:
        match = exp_matches[0]
        exp_years = match[0] if match[0] else match[1]
        experience = f"{exp_years} years"
    else:
        if re.search(r'\bfresher\b', text, re.IGNORECASE):
            experience = "Fresher"

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "education": education,
        "experience": experience
    }

def parse_resume(pdf_path):
    data = get_resume_data(pdf_path)
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    pdf_file = sys.argv[1] if len(sys.argv) > 1 else "sanju.pdf"
    parse_resume(pdf_file)
