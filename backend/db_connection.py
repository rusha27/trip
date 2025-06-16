import mysql.connector
import logging

# Setup logger (basic config, you can customize)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    try:
        db = mysql.connector.connect(
            host="13.234.30.109",
            user="root",
            password="rootmysql",
            database="tripglide"
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
