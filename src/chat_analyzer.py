import sys
import os
from jd_analyzer import analyze_jd_match

def generate_response(intent, analysis_results):
    if intent == "rejection":
        score = analysis_results["final_score"]
        missing_skills = analysis_results["missing_skills"]
        missing_fields = analysis_results["missing_fields"]
        
        if score > 80:
            return f"Actually, your ATS score is very strong ({score}/100)! From an automated perspective, you are a great fit. If you weren't selected, it might be due to intense competition or specific domain experience not strictly captured by technical skills."
            
        reason = f"Based on the JD analysis, your overall ATS score is {score}/100. "
        if missing_skills:
            reason += f"You were likely not selected because you are missing several key skills explicitly required by this job description."
        if missing_fields:
            reason += f" Additionally, your resume appears to be missing basic information like: {', '.join(missing_fields)}."
            
        if not missing_skills and not missing_fields:
            reason += "While you have the technical skills, the contextual match of your experience compared to the JD was a bit low."
            
        return reason

    elif intent == "missing_skills":
        missing_skills = analysis_results["missing_skills"]
        if missing_skills:
            return f"To improve your chances, you should focus on learning and adding these missing skills to your resume: {', '.join([s.title() for s in missing_skills])}."
        else:
            return "You are not missing any of the core technical skills listed in the JD!"

    elif intent == "matched_skills":
        matched_skills = analysis_results["matched_skills"]
        if matched_skills:
            return f"Great job! You successfully matched these required skills: {', '.join([s.title() for s in matched_skills])}."
        else:
            return "Unfortunately, we didn't detect any of the JD's core technical skills in your resume."

    elif intent == "score":
        score = analysis_results["final_score"]
        context = analysis_results["contextual_match"]
        skills = analysis_results["skill_match_percentage"]
        return f"Your Final ATS Score is {score}/100.\nThis is a combination of your Contextual Text Match ({context}%) and your Technical Skill Match ({skills}%)."

    elif intent == "fit":
        score = analysis_results["final_score"]
        if score > 75:
            return "Yes, you look like a very strong fit for this role! Make sure to apply."
        elif score > 50:
            return "You are a moderate fit. You have many of the required skills, but might want to brush up on the ones you are missing."
        else:
            return "You are currently a low fit for this role based on the required skills. You may want to look for roles that better match your current stack, or upskill before applying."
            
    else:
        return "I'm not sure how to answer that."

def run_interactive_menu(menu_list, analysis_results, is_submenu=False):
    """
    Runs the menu loop. 
    Returns True if the menu is now completely empty (all questions answered).
    Returns False if the user chose to exit/go back before emptying the menu.
    """
    while True:
        if len(menu_list) == 0:
            print("\nAI: All questions in this section have been answered!")
            return True 
            
        print("\nAvailable Options:")
        for i, item in enumerate(menu_list):
            print(f"  {i+1}. {item['text']}")
            
        exit_idx = len(menu_list) + 1
        if is_submenu:
            print(f"  {exit_idx}. Go Back")
        else:
            print(f"  {exit_idx}. Exit chat")
            
        try:
            choice_str = input(f"\nEnter your choice (1-{exit_idx}): ").strip()
            if not choice_str.isdigit():
                print("Invalid input. Please enter a number.")
                continue
                
            choice = int(choice_str)
            
            if choice == exit_idx:
                if not is_submenu:
                    print("\nExiting chat. Best of luck with your applications!")
                    sys.exit(0)
                return False 
                
            if choice < 1 or choice > len(menu_list):
                print("Invalid choice.")
                continue
                
            selected_item = menu_list[choice-1]
            
            if selected_item["type"] == "question":
                response = generate_response(selected_item["intent"], analysis_results)
                print(f"\nAI: {response}")
                print("\n" + "-" * 65)
                
                # Dynamic Menu: Remove the answered question so it disappears!
                del menu_list[choice-1]
                
            elif selected_item["type"] == "submenu":
                # Recursively enter the submenu
                submenu_empty = run_interactive_menu(selected_item["options"], analysis_results, is_submenu=True)
                
                if submenu_empty:
                    # Dynamic Menu: If the submenu has no questions left, remove the submenu itself!
                    del menu_list[choice-1]
                    
        except KeyboardInterrupt:
            if not is_submenu:
                print("\nExiting chat.")
                sys.exit(0)
            return False
        except Exception as e:
            print(f"\nAn error occurred: {e}")

def start_local_chat(resume_path, jd_path):
    print("\nRunning JD Analysis in the background to build context...")
    
    if not os.path.exists(resume_path):
        print(f"Error: {resume_path} not found.")
        return
    if not os.path.exists(jd_path):
        print(f"Error: {jd_path} not found.")
        return
        
    with open(jd_path, 'r', encoding='utf-8', errors='ignore') as f:
        jd_text = f.read()
        
    # Suppress the verbose output from jd_analyzer
    old_stdout = sys.stdout
    sys.stdout = open(os.devnull, 'w')
    try:
        analysis_results = analyze_jd_match(resume_path, jd_text)
    finally:
        sys.stdout = old_stdout
        
    score = analysis_results["final_score"]
    
    print("\n" + "="*65)
    print("             LOCAL INTENT-BASED ATS ASSISTANT READY")
    print("="*65)
    print(f"Your ATS Score : {score} / 100")
    
    if score > 75:
        print("Assessment     : Good (You are an excellent match for this role!)")
    elif score > 50:
        print("Assessment     : Moderate (You have a solid foundation but missing a few skills.)")
    else:
        print("Assessment     : Critical (Unfortunately, this might not be the best fit for your current skill set.)")
        
    print("-" * 65)
    print("Please choose a question from the menu below to get started.")
    
    # Define our hierarchical menu structure
    main_menu = [
        {
            "text": "Why was I not selected?", 
            "type": "question", 
            "intent": "rejection"
        },
        {
            "text": "Skill Analysis (Dive Deeper) ->", 
            "type": "submenu", 
            "options": [
                {"text": "What skills am I missing?", "type": "question", "intent": "missing_skills"},
                {"text": "What skills did I match successfully?", "type": "question", "intent": "matched_skills"}
            ]
        },
        {
            "text": "What is my score breakdown?", 
            "type": "question", 
            "intent": "score"
        },
        {
            "text": "Do I fit this role overall?", 
            "type": "question", 
            "intent": "fit"
        }
    ]
    
    # Start the interactive loop
    run_interactive_menu(main_menu, analysis_results, is_submenu=False)


if __name__ == "__main__":
    print("--- Local ATS Chat Analyzer ---")
    resume_file = input("Enter the path to your resume PDF (default: sanju.pdf): ").strip()
    if not resume_file:
        resume_file = "sanju.pdf"
        
    jd_file = input("Enter the path to your JD text file (default: jd.txt): ").strip()
    if not jd_file:
        jd_file = "jd.txt"
        
    start_local_chat(resume_file, jd_file)
