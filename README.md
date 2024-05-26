# MyNetflix XYZ

## Backend Setup

### Prerequisites
- Python 3.x
- pip

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/iamr5/mynetflix-xyz.git
    cd mynetflix-xyz/backend
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the Flask application:
    ```bash
    export FLASK_APP=app.py
    flask run
    ```

### Usage
- Navigate to the frontend in your browser and use the upload form to process your CSV files.
- Download the processed file using the provided link.
