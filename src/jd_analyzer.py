import fitz  # PyMuPDF
import re
import sys
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from parser import get_resume_data

def get_pdf_text(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return ""

def analyze_jd_match(resume_path, jd_text):
    print("\nAnalyzing contextual match...")
    
    # 1. Get raw text of resume
    resume_text = get_pdf_text(resume_path)
    if not resume_text:
        print("Error: Could not read the resume PDF.")
        return
        
    # 2. Get structured data from resume
    resume_data = get_resume_data(resume_path)
    
    # 3. Calculate TF-IDF Cosine Similarity for overall contextual match
    text_list = [resume_text, jd_text]
    cv = TfidfVectorizer(stop_words='english')
    count_matrix = cv.fit_transform(text_list)
    match_percentage = cosine_similarity(count_matrix)[0][1] * 100
    match_percentage = round(match_percentage, 2)
    
    # 4. Extract required skills from JD based on our predefined list
    skill_keywords = [
        "python", "java", "react", "spring boot", "c++", "c", "javascript", 
        "html", "css", "sql", "node.js", "docker", "kubernetes", "aws", 
        "machine learning", "data structures", "algorithms", "agile", "oop",
        "typescript", "go", "ruby", "django", "flask", "git", "linux"
    ]
    
    jd_required_skills = []
    for skill in skill_keywords:
        # Check if skill exists in JD
        if re.search(r'\b' + re.escape(skill) + r'\b', jd_text, re.IGNORECASE):
            jd_required_skills.append(skill)
            
    # 5. Compare with Resume Skills
    resume_skills_lower = [s.lower() for s in resume_data.get("skills", [])]
    
    matched_skills = []
    missing_skills = []
    
    for req_skill in jd_required_skills:
        if req_skill in resume_skills_lower:
            matched_skills.append(req_skill)
        else:
            missing_skills.append(req_skill)
            
    # 6. Calculate Final Score 
    # Combine Contextual similarity (40%) and Skill matching (60%)
    skill_score = 0
    if jd_required_skills:
        skill_score = (len(matched_skills) / len(jd_required_skills)) * 100
    else:
        skill_score = 100 # No specific tech skills found in JD, give full skill points
        
    final_score = int((match_percentage * 0.4) + (skill_score * 0.6))
    
    print("\n" + "="*60)
    print("                 JD VS RESUME ATS REPORT")
    print("="*60)
    print(f"Candidate Name       : {resume_data.get('name', 'Unknown')}")
    print(f"Contextual Match     : {match_percentage}%")
    print(f"Skill Match          : {round(skill_score, 2)}%")
    print(f"FINAL ATS SCORE      : {final_score} / 100")
    print("-" * 60)
    
    print("\n--- Skill Analysis ---")
    if jd_required_skills:
        print(f"JD Required Skills   : {', '.join([s.title() for s in jd_required_skills])}")
        print(f"Matched Skills       : {', '.join([s.title() for s in matched_skills]) if matched_skills else 'None'}")
        
        if missing_skills:
            print(f"Missing Skills       : {', '.join([s.title() for s in missing_skills])}")
        else:
            print("Missing Skills       : None! (You meet all JD skill requirements)")
    else:
        print("No specific technical skills from our list were detected in the JD.")
        
    print("\n--- Basic Requirements ---")
    missing_fields = []
    if not resume_data.get("email"): missing_fields.append("Email")
    if not resume_data.get("phone"): missing_fields.append("Phone")
    if not resume_data.get("education"): missing_fields.append("Education")
    
    if missing_fields:
        print(f"Missing Basic Info   : {', '.join(missing_fields)}")
    else:
        print("Missing Basic Info   : None (Resume has Email, Phone, Education)")
        
    print("="*60 + "\n")

    return {
        "final_score": final_score,
        "contextual_match": match_percentage,
        "skill_match_percentage": round(skill_score, 2),
        "missing_skills": missing_skills,
        "matched_skills": matched_skills,
        "jd_required_skills": jd_required_skills,
        "missing_fields": missing_fields
    }


if __name__ == "__main__":
    print("--- JD ATS Analyzer ---")
    resume_path = input("Enter the path to your resume PDF (default: sanju.pdf): ").strip()
    if not resume_path:
        resume_path = "sanju.pdf"
        
    if not os.path.exists(resume_path):
        print(f"Error: {resume_path} not found.")
        sys.exit(1)
        
    jd_path = input("Enter the path to your JD text file (default: jd.txt): ").strip()
    if not jd_path:
        jd_path = "jd.txt"
        
    if not os.path.exists(jd_path):
        print(f"\nError: '{jd_path}' not found.")
        print(f"To fix this, create a new file named '{jd_path}' in this folder, paste the job description into it, save it, and run the script again.")
        sys.exit(1)
        
    with open(jd_path, 'r', encoding='utf-8', errors='ignore') as f:
        jd_text = f.read()
    
    if not jd_text.strip():
        print(f"Error: {jd_path} is empty. Please paste the Job Description into the file and save it.")
        sys.exit(1)
        
    analyze_jd_match(resume_path, jd_text)
