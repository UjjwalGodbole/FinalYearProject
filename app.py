import os
from PIL import Image
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename

# Configure Gemini API
API_KEY = "AIzaSyBY648V9CD3YEnlxOI4_jg6QQBiEa-sqDk"
genai.configure(api_key=API_KEY)

# Flask App Setup
app = Flask(__name__, template_folder='views')
app.config['UPLOAD_FOLDER'] = 'public/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def analyze_book_condition(image_path):
    """Send a single book image to Gemini API and get a condition rating (1-5)"""
    image = Image.open(image_path)
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content([
        """Analyze the image strictly. Follow these rules:
        1️⃣ If the image is blurred, unclear, or has low quality, return "REJECT".
        2️⃣ If the image is NOT a book (e.g., a person, random object, etc.), return "REJECT".
        3️⃣ If the image contains excessive handwriting or markings on the pages, return "REJECT".
        4️⃣ Otherwise, rate the book's condition on a scale of 1 to 5 (1 = Like new, 5 = Very old and damaged).
        ONLY return a number from 1 to 5 OR the word "REJECT".
        """,
        image
    ])
    
    try:
        rating = int(response.text.strip())
    except ValueError:
        rating = 5
    
    return rating

@app.route('/', methods=['GET'])
def home():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def analyze_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    rating = analyze_book_condition(file_path)
    decision = "Rejected" if rating >= 4 else "Accepted"
    
    return jsonify({
        'rating': rating,
        'decision': decision
    })

@app.route('/submit_info', methods=['POST'])
def submit_info():
    seller_name = request.form.get('seller_name')
    seller_city = request.form.get('seller_city')
    book_name = request.form.get('book_name')
    
    if not all([seller_name, seller_city, book_name]):
        return jsonify({'error': 'Missing required information'}), 400
    
    # Here you would typically save this information to a database
    # For now, we'll just return success
    return jsonify({
        'message': 'Information submitted successfully',
        'data': {
            'seller_name': seller_name,
            'seller_city': seller_city,
            'book_name': book_name
        }
    })

if __name__ == '__main__':
    app.run(debug=True)