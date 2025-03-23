import os
import uuid
from PIL import Image
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.utils import secure_filename

# Configure Gemini API
API_KEY = "AIzaSyBY648V9CD3YEnlxOI4_jg6QQBiEa-sqDk"
genai.configure(api_key=API_KEY)

# Flask App Setup
app = Flask(__name__, template_folder="views")
app.config['UPLOAD_FOLDER'] = 'public/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# In-memory storage for uploaded images (in a real app, use a database)
uploaded_images = {}

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
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400

    # Get form data
    seller_name = request.form.get('seller_name')
    seller_city = request.form.get('seller_city')
    seller_contact = request.form.get('seller_contact')
    book_name = request.form.get('book_name')
    book_category = request.form.get('book_category')
    book_price = request.form.get('book_price')
    image_index = request.form.get('image_index')
    
    # Generate a unique ID for this image
    image_id = str(uuid.uuid4())
    
    # Create a unique filename
    filename = secure_filename(f"{image_id}_{file.filename}")
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Analyze the image
    rating = analyze_book_condition(file_path)
    decision = "Rejected" if rating >= 4 else "Accepted"
    
    # Store the image information if accepted
    if decision == "Accepted":
        uploaded_images[file_path] = {
            'rating': rating,
            'seller_name': seller_name,
            'seller_city': seller_city,
            'seller_contact': seller_contact,
            'book_name': book_name,
            'book_category': book_category,
            'book_price': book_price,
            'image_index': image_index
        }
    
    return jsonify({
        'image_path': file_path,
        'rating': rating,
        'decision': decision
    })

@app.route('/submit_info', methods=['POST'])
def submit_info():
    # Get form data
    seller_name = request.form.get('seller_name')
    seller_city = request.form.get('seller_city')
    seller_contact = request.form.get('seller_contact')
    book_name = request.form.get('book_name')
    book_category = request.form.get('book_category')
    book_price = request.form.get('book_price')
    
    # Get image paths from form
    image_paths = [
        request.form.get('image1_path'),
        request.form.get('image2_path'),
        request.form.get('image3_path'),
        request.form.get('image4_path'),
        request.form.get('image5_path')
    ]
    
    # Validate all data
    if not all([seller_name, seller_city, seller_contact, book_name, book_category, book_price]):
        return jsonify({'error': 'Missing required seller or book information'}), 400
    
    if not all(image_paths):
        return jsonify({'error': 'Missing one or more image paths'}), 400
    
    # Verify all image paths exist in our storage
    for img_path in image_paths:
        if img_path not in uploaded_images:
            return jsonify({'error': f'Invalid image path: {img_path}'}), 400
    
    # At this point, all data is valid and all images have been uploaded and verified
    # In a real application, you would save this data to a database
    
    # Prepare response with all collected data
    image_details = []
    for img_path in image_paths:
        image_details.append({
            'path': img_path,
            'rating': uploaded_images[img_path]['rating']
        })
    
    return jsonify({
        'message': 'Information submitted successfully',
        'seller_data': {
            'seller_name': seller_name,
            'seller_city': seller_city,
            'seller_contact': seller_contact,
            'book_name': book_name,
            'book_category': book_category,
            'book_price': book_price
        },
        'images': image_details
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)
