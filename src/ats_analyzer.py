import sys
from parser import get_resume_data

def calculate_ats_score(resume_data, required_skills):
    if "error" in resume_data:
        print(f"Error: {resume_data['error']}")
        return
    
    score = 0
    
    # 1. Base requirements (40 points total, 10 each)
    missing_fields = []
    
    if resume_data.get("email"):
        score += 10
    else:
        missing_fields.append("Email")
        
    if resume_data.get("phone"):
        score += 10
    else:
        missing_fields.append("Phone Number")
        
    if resume_data.get("education"):
        score += 10
    else:
        missing_fields.append("Education")
        
    if resume_data.get("experience"):
        score += 10
    else:
        missing_fields.append("Experience")
        
    # 2. Skills matching (60 points total)
    resume_skills_lower = [s.lower() for s in resume_data.get("skills", [])]
    required_skills_lower = [s.strip().lower() for s in required_skills if s.strip()]
    
    matched_skills = []
    missing_skills = []
    
    for req_skill in required_skills_lower:
        if req_skill in resume_skills_lower:
            matched_skills.append(req_skill)
        else:
            missing_skills.append(req_skill)
            
    if required_skills_lower:
        match_ratio = len(matched_skills) / len(required_skills_lower)
        skills_score = int(match_ratio * 60)
        score += skills_score
    else:
        # If no skills were required, give full points for skills
        score += 60
        
    print("\n" + "="*45)
    print("             ATS ANALYZER REPORT")
    print("="*45)
    print(f"Candidate Name : {resume_data.get('name', 'Unknown')}")
    print(f"ATS Score      : {score} / 100")
    print("-" * 45)
    
    print("\n--- Match Details ---")
    print(f"Matched Skills : {', '.join(matched_skills).title() if matched_skills else 'None'}")
    
    print("\n--- Missing Information ---")
    if missing_fields:
        print(f"Missing Fields : {', '.join(missing_fields)}")
    else:
        print("Missing Fields : None (All basic info present!)")
        
    if missing_skills:
        print(f"Missing Skills : {', '.join(missing_skills).title()}")
    else:
        print("Missing Skills : None (All required skills met!)")
        
    print("="*45 + "\n")


if __name__ == "__main__":
    print("--- Welcome to the ATS Analyzer ---")
    
    resume_path = input("Enter the path to the resume PDF (default: sanju.pdf): ").strip()
    if not resume_path:
        resume_path = "sanju.pdf"
        
    skills_input = input("Enter required skills separated by commas (e.g. Python, SQL, AWS): ").strip()
    required_skills = skills_input.split(",") if skills_input else []
    
    print("\nAnalyzing resume...")
    data = get_resume_data(resume_path)
    calculate_ats_score(data, required_skills)
