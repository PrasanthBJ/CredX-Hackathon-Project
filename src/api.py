from flask import Flask, request, jsonify
import os
import tempfile
import sys
# Proper import structure since we are inside the src/ folder
from src.jd_analyzer import analyze_jd_match

app = Flask(__name__)

@app.route('/api/v1/analyze', methods=['POST'])
def analyze():
    """
    Expects multipart/form-data:
    - 'resume': The PDF file
    - 'jd_text': The text string of the job description
    """
    # 1. Check for JD text
    jd_text = request.form.get('jd_text')
    if not jd_text:
        return jsonify({"status": "error", "message": "Missing 'jd_text' in form data"}), 400

    # 2. Check for Resume file
    if 'resume' not in request.files:
        return jsonify({"status": "error", "message": "Missing 'resume' file in form data"}), 400
        
    resume_file = request.files['resume']
    if resume_file.filename == '':
        return jsonify({"status": "error", "message": "Empty resume file name"}), 400

    # 3. Save file temporarily for the parser
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, "api_temp_resume.pdf")
    
    try:
        resume_file.save(temp_path)
        
        # 4. Suppress standard print outputs from our internal modules
        old_stdout = sys.stdout
        sys.stdout = open(os.devnull, 'w')
        try:
            # 5. Run the existing robust analysis function
            analysis_results = analyze_jd_match(temp_path, jd_text)
        finally:
            sys.stdout = old_stdout
            
        # 6. Return a clean, structured JSON response for Spring Boot
        return jsonify({
            "status": "success",
            "data": analysis_results
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        # 7. Clean up temporary file
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

if __name__ == '__main__':
    print("Starting ATS REST API on port 5000...")
    # By default, run on 0.0.0.0 so the Spring Boot container/service can easily reach it
    app.run(host='0.0.0.0', port=5000, debug=True)
