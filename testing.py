import mysql.connector
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    try:
        db = mysql.connector.connect(
            host="13.204.46.172",
            user="root",
            password="rootmysql",
            database="tripglide"
        )
        logger.info("Database connection established")
        return db
    except mysql.connector.Error as e:
        logger.error(f"Failed to connect to database: {e}")
        return None

if __name__ == "__main__":
    connection = get_db_connection()
    if connection:
        print("Connection successful!")
        connection.close()
    else:
        print("Connection failed!")
