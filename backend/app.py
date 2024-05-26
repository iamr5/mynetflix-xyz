from flask import Flask, request, jsonify, send_file
import pandas as pd
import requests

app = Flask(__name__)

# Reemplaza 'YOUR_API_KEY' con tu API Key de OMDB
OMDB_API_KEY = 'fe13f3c9'
OMDB_API_URL = 'http://www.omdbapi.com/'

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    if file:
        df = pd.read_csv(file)
        df = update_titles(df)
        df.to_csv('backend/updated_titles.csv', index=False)
        return jsonify({"message": "File processed successfully", "file": "updated_titles.csv"})

def update_titles(df):
    for index, row in df.iterrows():
        title = row['title']
        canonical_title = get_canonical_title(title)
        if canonical_title:
            df.at[index, 'title'] = canonical_title
    return df

def get_canonical_title(title):
    params = {
        't': title,
        'apikey': OMDB_API_KEY
    }
    response = requests.get(OMDB_API_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        if 'Title' in data:
            return data['Title']
    return None

@app.route('/download', methods=['GET'])
def download_file():
    return send_file('backend/updated_titles.csv', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
