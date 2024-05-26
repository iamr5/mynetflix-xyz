from flask import Flask, request, jsonify, send_file
import pandas as pd
import imdb

app = Flask(__name__)
ia = imdb.IMDb()

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
        results = ia.search_movie(title)
        if results:
            canonical_title = results[0]['title']
            df.at[index, 'title'] = canonical_title
    return df

@app.route('/download', methods=['GET'])
def download_file():
    return send_file('backend/updated_titles.csv', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
