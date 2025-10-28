"""
APScheduler service for running daily insights generation
Runs every day at 6 AM EST
"""

import os
import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import sys

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from daily_insights_automation import run_daily_generation

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/backend/scheduler.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def job_function():
    """Wrapper function for the scheduled job"""
    logger.info(f"Scheduled job started at {datetime.now()}")
    try:
        run_daily_generation()
        logger.info("Scheduled job completed successfully")
    except Exception as e:
        logger.error(f"Error in scheduled job: {str(e)}")


if __name__ == "__main__":
    logger.info("Starting Daily Insights Scheduler...")
    logger.info("Will run daily at 6:00 AM EST (11:00 AM UTC)")
    
    # Create scheduler
    scheduler = BlockingScheduler()
    
    # Schedule the job to run every day at 6 AM EST (11 AM UTC)
    # CronTrigger: hour=11 means 11 AM UTC = 6 AM EST
    scheduler.add_job(
        job_function,
        trigger=CronTrigger(hour=11, minute=0),  # 6 AM EST = 11 AM UTC
        id='daily_insights_job',
        name='Generate Daily Mortgage Insights',
        replace_existing=True
    )
    
    # Also run once on startup (optional - for testing)
    logger.info("Running initial generation on startup...")
    try:
        run_daily_generation()
        logger.info("Initial generation completed")
    except Exception as e:
        logger.error(f"Error in initial generation: {str(e)}")
    
    logger.info("Scheduler started. Waiting for scheduled time...")
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Scheduler stopped by user")
