"""
Automated Daily Mortgage Insights Generator
Runs daily at 6 AM EST to generate fresh mortgage insights
"""

import os
import logging
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/backend/daily_insights.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Categories to rotate through
CATEGORIES = ['rates', 'programs', 'refinancing', 'tips', 'affordability']


async def generate_daily_insight():
    """Generate and save a new mortgage insight"""
    try:
        logger.info("Starting daily insight generation...")
        
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Get current date
        current_date = datetime.now(timezone.utc)
        date_str = current_date.strftime("%B %d, %Y")
        
        # Determine category based on day of week
        # Monday=0, Sunday=6
        day_of_week = current_date.weekday()
        category = CATEGORIES[day_of_week % len(CATEGORIES)]
        
        logger.info(f"Generating insight for {date_str}, category: {category}")
        
        # Create AI prompt based on category
        prompts = {
            'rates': f"Write a professional mortgage insight article (150-250 words) about current interest rate trends and their impact on homebuyers for {date_str}. Focus on actionable advice, market conditions, and what buyers should know. Write as an expert mortgage broker giving professional advice. Do not use Q&A format.",
            'programs': f"Write a professional mortgage insight article (150-250 words) about mortgage loan programs (FHA, VA, conventional, first-time buyer programs) for {date_str}. Explain benefits and eligibility in an authoritative tone. Write as an expert mortgage broker. Do not use Q&A format.",
            'refinancing': f"Write a professional mortgage insight article (150-250 words) about refinancing strategies and timing considerations for {date_str}. Include when it makes sense to refinance and what factors to consider. Write as an expert mortgage broker. Do not use Q&A format.",
            'tips': f"Write a professional mortgage insight article (150-250 words) about mortgage tips, credit scores, or best practices for {date_str}. Provide actionable advice that helps buyers improve their mortgage readiness. Write as an expert mortgage broker. Do not use Q&A format.",
            'affordability': f"Write a professional mortgage insight article (150-250 words) about affordability strategies and smart home buying decisions for {date_str}. Help buyers navigate high prices and competitive markets. Write as an expert mortgage broker. Do not use Q&A format."
        }
        
        prompt = prompts.get(category, prompts['tips'])
        
        # Generate content using Emergent LLM
        session_id = f"insights_{current_date.strftime('%Y%m%d')}"
        system_message = "You are an expert mortgage broker providing professional, authoritative advice to homebuyers. Write clear, actionable insights that build trust and demonstrate expertise."
        
        llm_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=prompt)
        content = await llm_chat.send_message(user_message)
        content = content.strip()
        
        # Generate a title (ask AI to create it)
        title_prompt = f"Based on this mortgage insight content, write a compelling, professional title (8-15 words, no quotes): {content[:200]}"
        title_user_message = UserMessage(text=title_prompt)
        title_content = await llm_chat.send_message(title_user_message)
        title = title_content.strip().replace('"', '').replace("'", "")
        
        # Create insight document
        insight_doc = {
            'id': str(uuid.uuid4()),
            'title': title,
            'content': content,
            'category': category,
            'date': current_date.isoformat(),
            'published': True,
            'auto_generated': True,
            'generated_at': current_date.isoformat()
        }
        
        # Save to database
        await db.daily_insights.insert_one(insight_doc)
        
        logger.info(f"Successfully generated and saved insight: {title}")
        logger.info(f"Category: {category}, Length: {len(content)} characters")
        
        # Close connection
        client.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error generating daily insight: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return False


async def cleanup_old_insights():
    """Keep only the most recent 30 insights to avoid database bloat"""
    try:
        logger.info("Cleaning up old insights...")
        
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Get all insights sorted by date
        all_insights = await db.daily_insights.find(
            {},
            {"_id": 0, "id": 1, "date": 1}
        ).sort("date", -1).to_list(None)
        
        # Keep only the latest 30
        if len(all_insights) > 30:
            insights_to_delete = all_insights[30:]
            ids_to_delete = [insight['id'] for insight in insights_to_delete]
            
            result = await db.daily_insights.delete_many({"id": {"$in": ids_to_delete}})
            logger.info(f"Deleted {result.deleted_count} old insights")
        else:
            logger.info(f"Only {len(all_insights)} insights in database, no cleanup needed")
        
        client.close()
        
    except Exception as e:
        logger.error(f"Error cleaning up old insights: {str(e)}")


def run_daily_generation():
    """Synchronous wrapper for async generation"""
    try:
        # Run the async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        success = loop.run_until_complete(generate_daily_insight())
        
        if success:
            logger.info("Daily insight generation completed successfully")
            # Cleanup old insights
            loop.run_until_complete(cleanup_old_insights())
        else:
            logger.error("Daily insight generation failed")
        
        loop.close()
        
    except Exception as e:
        logger.error(f"Error in run_daily_generation: {str(e)}")


if __name__ == "__main__":
    logger.info("Manual execution of daily insights generator")
    run_daily_generation()
