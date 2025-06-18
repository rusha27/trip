import os
from dotenv import load_dotenv
import mysql.connector
import logging

# Setup logger (basic config, you can customize)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

def get_db_connection():
    try:
        db = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        if db.is_connected():
            logger.info("Initial DB connection successful")
            return db
        else:
            logger.error("Initial DB object created, but not connected")
            return None
    except mysql.connector.Error as e:
        logger.error(f"Database connection failed: {e}")
        return None
