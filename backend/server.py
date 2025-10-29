from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from jose import JWTError, jwt
import os
import logging
from pathlib import Path
import uuid
from emergentintegrations.llm.chat import LlmChat, UserMessage
from enum import Enum
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-this')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_MINUTES = int(os.environ.get('JWT_EXPIRATION_MINUTES', '10080'))

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Resend Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
resend.api_key = RESEND_API_KEY

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== ENUMS ====================
class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    NURTURING = "nurturing"
    PIPELINE = "pipeline"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class LeadSource(str, Enum):
    WEB_FORM = "web_form"
    REFERRAL = "referral"
    SOCIAL_MEDIA = "social_media"
    DIRECT = "direct"
    PARTNER = "partner"


class PipelineStage(str, Enum):
    APPLICATION = "application"
    PRE_APPROVAL = "pre_approval"
    PROPERTY_SEARCH = "property_search"
    OFFER_MADE = "offer_made"
    UNDER_CONTRACT = "under_contract"
    APPRAISAL = "appraisal"
    UNDERWRITING = "underwriting"
    CLEAR_TO_CLOSE = "clear_to_close"
    CLOSED = "closed"


# ==================== MODELS ====================
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    hashed_password: str
    full_name: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    source: LeadSource
    status: LeadStatus = LeadStatus.NEW
    score: int = 0
    loan_amount: Optional[float] = None
    property_value: Optional[float] = None
    credit_score: Optional[int] = None
    down_payment: Optional[float] = None
    employment_status: Optional[str] = None
    annual_income: Optional[float] = None
    notes: Optional[str] = None
    next_follow_up: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    source: LeadSource
    loan_amount: Optional[float] = None
    property_value: Optional[float] = None
    credit_score: Optional[int] = None
    down_payment: Optional[float] = None
    employment_status: Optional[str] = None
    annual_income: Optional[float] = None
    notes: Optional[str] = None


class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[LeadStatus] = None
    score: Optional[int] = None
    loan_amount: Optional[float] = None
    property_value: Optional[float] = None
    credit_score: Optional[int] = None
    down_payment: Optional[float] = None
    employment_status: Optional[str] = None
    annual_income: Optional[float] = None
    notes: Optional[str] = None
    next_follow_up: Optional[datetime] = None


class Pipeline(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: str
    stage: PipelineStage
    loan_amount: float
    estimated_close_date: Optional[datetime] = None
    probability: int = 50
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PipelineCreate(BaseModel):
    lead_id: str
    stage: PipelineStage
    loan_amount: float
    estimated_close_date: Optional[datetime] = None
    probability: Optional[int] = 50
    notes: Optional[str] = None


class PipelineUpdate(BaseModel):
    stage: Optional[PipelineStage] = None
    loan_amount: Optional[float] = None
    estimated_close_date: Optional[datetime] = None
    probability: Optional[int] = None
    notes: Optional[str] = None


class FollowUp(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: str
    type: str  # email, sms, call
    scheduled_date: datetime
    completed: bool = False
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FollowUpCreate(BaseModel):
    lead_id: str
    type: str
    scheduled_date: datetime
    message: Optional[str] = None


class ReferralPartner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    company: str
    type: str  # realtor, builder, cpa, attorney
    total_referrals: int = 0
    total_closed: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReferralPartnerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: str
    type: str


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_message: str
    ai_response: str
    lead_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatRequest(BaseModel):
    message: str
    session_id: str
    lead_id: Optional[str] = None


class DailyInsight(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str  # affordability, rates, refinancing, programs, tips
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    published: bool = True


class DailyInsightCreate(BaseModel):
    title: str
    content: str
    category: str


class MortgageCalculation(BaseModel):
    loan_amount: float
    interest_rate: float
    loan_term_years: int
    down_payment: Optional[float] = 0
    property_value: Optional[float] = None
    property_tax_annual: Optional[float] = 0
    home_insurance_annual: Optional[float] = 0
    hoa_monthly: Optional[float] = 0


class EmailCampaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subject: str
    body: str
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "draft"  # draft, sent, scheduled
    total_recipients: int = 0
    sent_count: int = 0
    opened_count: int = 0
    clicked_count: int = 0
    model_config = ConfigDict(arbitrary_types_allowed=True)


class EmailCampaignCreate(BaseModel):
    name: str
    subject: str
    body: str


class EmailRecipient(BaseModel):
    email: str
    first_name: str
    last_name: str


class SendCampaignRequest(BaseModel):
    campaign_id: str
    recipients: List[EmailRecipient]


# ==================== HELPER FUNCTIONS ====================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")


def calculate_lead_score(lead_data: dict) -> int:
    """Calculate lead score based on various factors"""
    score = 0
    
    # Credit score (0-30 points)
    if lead_data.get('credit_score'):
        credit = lead_data['credit_score']
        if credit >= 740:
            score += 30
        elif credit >= 680:
            score += 20
        elif credit >= 620:
            score += 10
    
    # Down payment (0-25 points)
    if lead_data.get('down_payment') and lead_data.get('property_value'):
        down_payment_percent = (lead_data['down_payment'] / lead_data['property_value']) * 100
        if down_payment_percent >= 20:
            score += 25
        elif down_payment_percent >= 10:
            score += 15
        elif down_payment_percent >= 5:
            score += 10
    
    # Income (0-20 points)
    if lead_data.get('annual_income') and lead_data.get('loan_amount'):
        dti_ratio = (lead_data['loan_amount'] * 0.05) / (lead_data['annual_income'] / 12)  # Rough DTI
        if dti_ratio <= 0.28:
            score += 20
        elif dti_ratio <= 0.36:
            score += 15
        elif dti_ratio <= 0.43:
            score += 10
    
    # Employment status (0-15 points)
    if lead_data.get('employment_status'):
        if lead_data['employment_status'].lower() in ['full-time', 'self-employed']:
            score += 15
        elif lead_data['employment_status'].lower() in ['part-time', 'contract']:
            score += 8
    
    # Loan amount feasibility (0-10 points)
    if lead_data.get('loan_amount'):
        if 100000 <= lead_data['loan_amount'] <= 1000000:
            score += 10
        elif lead_data['loan_amount'] < 100000 or lead_data['loan_amount'] > 2000000:
            score += 5
    
    return min(score, 100)


# ==================== AUTH ROUTES ====================
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token({"sub": user.id})
    return Token(access_token=access_token, token_type="bearer")


@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"username": credentials.username}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    user = User(**user_doc)
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = create_access_token({"sub": user.id})
    return Token(access_token=access_token, token_type="bearer")


@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ==================== LEAD ROUTES ====================
@api_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    lead_dict = lead_data.model_dump()
    
    # Calculate lead score
    lead_dict['score'] = calculate_lead_score(lead_dict)
    
    # Set next follow-up (24 hours from now for high-score leads)
    if lead_dict['score'] >= 60:
        lead_dict['next_follow_up'] = datetime.now(timezone.utc) + timedelta(hours=24)
    else:
        lead_dict['next_follow_up'] = datetime.now(timezone.utc) + timedelta(days=3)
    
    lead = Lead(**lead_dict)
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc['next_follow_up']:
        doc['next_follow_up'] = doc['next_follow_up'].isoformat()
    
    await db.leads.insert_one(doc)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def get_leads(
    status: Optional[LeadStatus] = None,
    source: Optional[LeadSource] = None,
    min_score: Optional[int] = None
):
    query = {}
    if status:
        query['status'] = status
    if source:
        query['source'] = source
    if min_score is not None:
        query['score'] = {"$gte": min_score}
    
    leads = await db.leads.find(query, {"_id": 0}).sort("score", -1).to_list(1000)
    
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
        if isinstance(lead.get('updated_at'), str):
            lead['updated_at'] = datetime.fromisoformat(lead['updated_at'])
        if lead.get('next_follow_up') and isinstance(lead['next_follow_up'], str):
            lead['next_follow_up'] = datetime.fromisoformat(lead['next_follow_up'])
    
    return leads


@api_router.get("/leads/{lead_id}", response_model=Lead)
async def get_lead(lead_id: str):
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if isinstance(lead.get('created_at'), str):
        lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    if isinstance(lead.get('updated_at'), str):
        lead['updated_at'] = datetime.fromisoformat(lead['updated_at'])
    if lead.get('next_follow_up') and isinstance(lead['next_follow_up'], str):
        lead['next_follow_up'] = datetime.fromisoformat(lead['next_follow_up'])
    
    return Lead(**lead)


@api_router.patch("/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, lead_update: LeadUpdate):
    existing = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {k: v for k, v in lead_update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Recalculate score if relevant fields changed
    if any(k in update_data for k in ['credit_score', 'down_payment', 'property_value', 'annual_income', 'loan_amount']):
        merged_data = {**existing, **update_data}
        update_data['score'] = calculate_lead_score(merged_data)
    
    if update_data.get('next_follow_up'):
        update_data['next_follow_up'] = update_data['next_follow_up'].isoformat()
    
    await db.leads.update_one({"id": lead_id}, {"$set": update_data})
    
    updated_lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if isinstance(updated_lead.get('created_at'), str):
        updated_lead['created_at'] = datetime.fromisoformat(updated_lead['created_at'])
    if isinstance(updated_lead.get('updated_at'), str):
        updated_lead['updated_at'] = datetime.fromisoformat(updated_lead['updated_at'])
    if updated_lead.get('next_follow_up') and isinstance(updated_lead['next_follow_up'], str):
        updated_lead['next_follow_up'] = datetime.fromisoformat(updated_lead['next_follow_up'])
    
    return Lead(**updated_lead)


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}


# ==================== PIPELINE ROUTES ====================
@api_router.post("/pipeline", response_model=Pipeline)
async def create_pipeline(pipeline_data: PipelineCreate):
    # Verify lead exists
    lead = await db.leads.find_one({"id": pipeline_data.lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Update lead status to pipeline
    await db.leads.update_one(
        {"id": pipeline_data.lead_id},
        {"$set": {"status": LeadStatus.PIPELINE}}
    )
    
    pipeline = Pipeline(**pipeline_data.model_dump())
    doc = pipeline.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc.get('estimated_close_date'):
        doc['estimated_close_date'] = doc['estimated_close_date'].isoformat()
    
    await db.pipeline.insert_one(doc)
    return pipeline


@api_router.get("/pipeline", response_model=List[Pipeline])
async def get_pipeline(stage: Optional[PipelineStage] = None):
    query = {}
    if stage:
        query['stage'] = stage
    
    pipelines = await db.pipeline.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for p in pipelines:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('updated_at'), str):
            p['updated_at'] = datetime.fromisoformat(p['updated_at'])
        if p.get('estimated_close_date') and isinstance(p['estimated_close_date'], str):
            p['estimated_close_date'] = datetime.fromisoformat(p['estimated_close_date'])
    
    return pipelines


@api_router.patch("/pipeline/{pipeline_id}", response_model=Pipeline)
async def update_pipeline(pipeline_id: str, pipeline_update: PipelineUpdate):
    existing = await db.pipeline.find_one({"id": pipeline_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    update_data = {k: v for k, v in pipeline_update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    if update_data.get('estimated_close_date'):
        update_data['estimated_close_date'] = update_data['estimated_close_date'].isoformat()
    
    await db.pipeline.update_one({"id": pipeline_id}, {"$set": update_data})
    
    updated = await db.pipeline.find_one({"id": pipeline_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    if updated.get('estimated_close_date') and isinstance(updated['estimated_close_date'], str):
        updated['estimated_close_date'] = datetime.fromisoformat(updated['estimated_close_date'])
    
    return Pipeline(**updated)


# ==================== FOLLOW-UP ROUTES ====================
@api_router.post("/follow-ups", response_model=FollowUp)
async def create_follow_up(follow_up_data: FollowUpCreate):
    follow_up = FollowUp(**follow_up_data.model_dump())
    doc = follow_up.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['scheduled_date'] = doc['scheduled_date'].isoformat()
    
    await db.follow_ups.insert_one(doc)
    return follow_up


@api_router.get("/follow-ups", response_model=List[FollowUp])
async def get_follow_ups(lead_id: Optional[str] = None, pending_only: bool = False):
    query = {}
    if lead_id:
        query['lead_id'] = lead_id
    if pending_only:
        query['completed'] = False
    
    follow_ups = await db.follow_ups.find(query, {"_id": 0}).sort("scheduled_date", 1).to_list(1000)
    
    for f in follow_ups:
        if isinstance(f.get('created_at'), str):
            f['created_at'] = datetime.fromisoformat(f['created_at'])
        if isinstance(f.get('scheduled_date'), str):
            f['scheduled_date'] = datetime.fromisoformat(f['scheduled_date'])
    
    return follow_ups


@api_router.patch("/follow-ups/{follow_up_id}/complete")
async def complete_follow_up(follow_up_id: str):
    result = await db.follow_ups.update_one(
        {"id": follow_up_id},
        {"$set": {"completed": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    return {"message": "Follow-up marked as completed"}


# ==================== REFERRAL PARTNER ROUTES ====================
@api_router.post("/partners", response_model=ReferralPartner)
async def create_partner(partner_data: ReferralPartnerCreate):
    partner = ReferralPartner(**partner_data.model_dump())
    doc = partner.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.partners.insert_one(doc)
    return partner


@api_router.get("/partners", response_model=List[ReferralPartner])
async def get_partners(active_only: bool = False):
    query = {}
    if active_only:
        query['active'] = True
    
    partners = await db.partners.find(query, {"_id": 0}).sort("total_closed", -1).to_list(1000)
    
    for p in partners:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    
    return partners


# ==================== AI CHAT ROUTES ====================
@api_router.post("/ai/chat")
async def ai_chat(chat_request: ChatRequest):
    try:
        # Initialize LLM chat
        system_message = """You are a helpful mortgage loan officer assistant. Your role is to:
1. Pre-qualify leads by asking about credit score, income, down payment, employment status
2. Answer mortgage-related questions professionally
3. Guide clients through the mortgage process
4. Provide accurate information about loan options and requirements

Be professional, helpful, and concise. When pre-qualifying, gather key information:
- Credit score
- Annual income
- Employment status
- Desired loan amount
- Available down payment
- Property value (if known)

Always be encouraging but honest about requirements."""

        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=chat_request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=chat_request.message)
        response = await chat.send_message(user_message)
        
        # Save chat to database
        chat_msg = ChatMessage(
            session_id=chat_request.session_id,
            user_message=chat_request.message,
            ai_response=response,
            lead_id=chat_request.lead_id
        )
        doc = chat_msg.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.chat_messages.insert_one(doc)
        
        return {"response": response, "session_id": chat_request.session_id}
    except Exception as e:
        logger.error(f"AI chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")


@api_router.get("/ai/chat-history/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    
    return messages


# ==================== DAILY INSIGHTS ROUTES ====================
@api_router.post("/insights", response_model=DailyInsight)
async def create_insight(insight_data: DailyInsightCreate):
    insight = DailyInsight(**insight_data.model_dump())
    doc = insight.model_dump()
    doc['date'] = doc['date'].isoformat()
    
    await db.daily_insights.insert_one(doc)
    return insight


@api_router.get("/insights/latest", response_model=DailyInsight)
async def get_latest_insight():
    insight = await db.daily_insights.find_one(
        {"published": True},
        {"_id": 0},
        sort=[("date", -1)]
    )
    if not insight:
        raise HTTPException(status_code=404, detail="No insights available")
    
    if isinstance(insight.get('date'), str):
        insight['date'] = datetime.fromisoformat(insight['date'])
    
    return DailyInsight(**insight)


@api_router.get("/insights", response_model=List[DailyInsight])
async def get_insights(limit: int = 10, category: Optional[str] = None):
    query = {"published": True}
    if category:
        query['category'] = category
    
    insights = await db.daily_insights.find(
        query,
        {"_id": 0}
    ).sort("date", -1).limit(limit).to_list(limit)
    
    for insight in insights:
        if isinstance(insight.get('date'), str):
            insight['date'] = datetime.fromisoformat(insight['date'])
    
    return insights


# ==================== MORTGAGE CALCULATOR ROUTES ====================
@api_router.post("/calculator/payment")
async def calculate_mortgage_payment(calc_data: MortgageCalculation):
    try:
        # Calculate monthly payment
        loan_amount = calc_data.loan_amount
        property_value = calc_data.property_value or calc_data.loan_amount
        
        if calc_data.down_payment and calc_data.down_payment > 0:
            loan_amount = property_value - calc_data.down_payment
        
        monthly_rate = calc_data.interest_rate / 100 / 12
        num_payments = calc_data.loan_term_years * 12
        
        # Principal and interest payment
        if monthly_rate == 0:
            monthly_pi = loan_amount / num_payments
        else:
            monthly_pi = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
        
        # Calculate down payment percentage
        down_payment_percent = 0
        if calc_data.down_payment and property_value:
            down_payment_percent = (calc_data.down_payment / property_value) * 100
        
        # Calculate PMI (Private Mortgage Insurance) if down payment < 20%
        monthly_pmi = 0
        has_pmi = False
        if down_payment_percent < 20 and down_payment_percent > 0:
            # PMI typically ranges from 0.5% to 1% of loan amount annually
            # Using 0.75% as average
            pmi_rate = 0.0075
            monthly_pmi = (loan_amount * pmi_rate) / 12
            has_pmi = True
        
        # Add taxes, insurance, HOA, and PMI
        monthly_tax = (calc_data.property_tax_annual or 0) / 12
        monthly_insurance = (calc_data.home_insurance_annual or 0) / 12
        monthly_hoa = calc_data.hoa_monthly or 0
        
        total_monthly = monthly_pi + monthly_tax + monthly_insurance + monthly_hoa + monthly_pmi
        
        # Calculate total interest
        total_paid = monthly_pi * num_payments
        total_interest = total_paid - loan_amount
        
        # Calculate total PMI paid over loan life (until 20% equity reached)
        # Assuming PMI drops at 78% LTV (22% equity)
        total_pmi = 0
        if has_pmi:
            # Estimate months until 22% equity (simplified calculation)
            months_with_pmi = min(num_payments, 84)  # Typically 7 years max, but varies
            total_pmi = monthly_pmi * months_with_pmi
        
        return {
            "monthly_payment": round(total_monthly, 2),
            "monthly_principal_interest": round(monthly_pi, 2),
            "monthly_tax": round(monthly_tax, 2),
            "monthly_insurance": round(monthly_insurance, 2),
            "monthly_hoa": round(monthly_hoa, 2),
            "monthly_pmi": round(monthly_pmi, 2),
            "has_pmi": has_pmi,
            "total_loan_amount": round(loan_amount, 2),
            "total_interest": round(total_interest, 2),
            "total_paid": round(total_paid, 2),
            "total_pmi": round(total_pmi, 2),
            "down_payment": calc_data.down_payment or 0,
            "down_payment_percent": round(down_payment_percent, 2),
            "property_value": round(property_value, 2)
        }
    except Exception as e:
        logger.error(f"Mortgage calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@api_router.post("/calculator/affordability")
async def calculate_affordability(
    annual_income: float,
    monthly_debts: float,
    down_payment: float,
    interest_rate: float,
    loan_term_years: int = 30
):
    try:
        # Use 28/36 rule (28% of gross income for housing, 36% for total debt)
        monthly_income = annual_income / 12
        max_monthly_housing = monthly_income * 0.28
        max_monthly_debt = monthly_income * 0.36
        
        # Available for mortgage payment after other debts
        available_for_mortgage = max_monthly_debt - monthly_debts
        available_for_mortgage = min(available_for_mortgage, max_monthly_housing)
        
        # Assume 20% of payment goes to taxes and insurance
        available_for_pi = available_for_mortgage * 0.80
        
        # Calculate maximum loan amount
        monthly_rate = interest_rate / 100 / 12
        num_payments = loan_term_years * 12
        
        if monthly_rate == 0:
            max_loan = available_for_pi * num_payments
        else:
            max_loan = available_for_pi * ((1 + monthly_rate)**num_payments - 1) / (monthly_rate * (1 + monthly_rate)**num_payments)
        
        max_home_price = max_loan + down_payment
        
        return {
            "max_home_price": round(max_home_price, 2),
            "max_loan_amount": round(max_loan, 2),
            "max_monthly_payment": round(available_for_mortgage, 2),
            "monthly_income": round(monthly_income, 2),
            "recommended_down_payment": down_payment,
            "debt_to_income_ratio": round((monthly_debts + available_for_mortgage) / monthly_income * 100, 2)
        }
    except Exception as e:
        logger.error(f"Affordability calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")



# ==================== QUALIFICATION ANALYSIS ROUTE ====================
class QualificationRequest(BaseModel):
    creditScore: int
    income2023: float
    income2024: float
    incomeYTD2025: float
    monthlyDebts: float
    purchasePrice: float
    downPayment: float
    propertyTax: float
    homeInsurance: float
    hasEmploymentHistory: bool
    loanType: str


@api_router.post("/qualify")
async def analyze_qualification(req: QualificationRequest):
    try:
        # Special handling for Non-QM - no income verification needed
        if req.loanType == 'nonqm':
            # Calculate mortgage payment only
            loan_amount = req.purchasePrice - req.downPayment
            down_payment_percent = (req.downPayment / req.purchasePrice) * 100
            
            # Assume 6.5% interest rate for Non-QM (typically higher)
            interest_rate = 7.0  # Non-QM rates slightly higher
            monthly_rate = interest_rate / 100 / 12
            num_payments = 30 * 12
            
            # Calculate P&I
            if monthly_rate == 0:
                monthly_pi = loan_amount / num_payments
            else:
                monthly_pi = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
            
            # No PMI with 20% down
            monthly_pmi = 0
            
            # Total housing payment
            total_housing_payment = monthly_pi + req.propertyTax + req.homeInsurance
            
            # Check Non-QM requirements
            qualified = False
            message = ""
            recommendations = ""
            
            if req.creditScore >= 660 and down_payment_percent >= 20:
                qualified = True
                message = f"Excellent! You meet Non-QM requirements with no income verification needed!"
                recommendations = f"""Your Non-QM Profile:
✓ Credit Score: {req.creditScore} (Meets 660+ requirement)
✓ Down Payment: {down_payment_percent:.1f}% (Meets 20% requirement)
✓ No tax returns or W2s required
✓ No traditional employment verification

Your Expected Monthly Payment: ${total_housing_payment:,.0f}
- Principal & Interest: ${monthly_pi:,.0f}
- Property Tax: ${req.propertyTax:,.0f}
- Home Insurance: ${req.homeInsurance:,.0f}

Next Steps:
1. Prepare 12-24 months of bank statements for alternative income verification
2. Get pre-approved with Non-QM program
3. Schedule consultation to discuss your specific situation"""
            elif req.creditScore < 660:
                message = f"Your credit score of {req.creditScore} is below the 660 minimum for Non-QM loans."
                recommendations = f"""Credit Improvement Plan for Non-QM:

Current Score: {req.creditScore}
Target Score: 660+

Steps to Improve:
1. Review credit report for errors and dispute inaccuracies
2. Pay all bills on time (biggest factor)
3. Pay down credit card balances below 30% utilization
4. Avoid opening new credit accounts

Your down payment of {down_payment_percent:.1f}% meets the requirement!

Expected Monthly Payment: ${total_housing_payment:,.0f} (once credit improves)

Schedule a consultation to create your credit improvement strategy!"""
            else:
                message = f"Your down payment of {down_payment_percent:.1f}% is below the 20% minimum for Non-QM loans."
                recommendations = f"""Down Payment Requirement:

Current Down Payment: {down_payment_percent:.1f}%
Required: 20% minimum (${req.purchasePrice * 0.20:,.0f})
Shortfall: ${(req.purchasePrice * 0.20) - req.downPayment:,.0f}

Your credit score of {req.creditScore} meets the requirement!

Strategies:
1. Increase savings to reach 20% down payment
2. Consider a lower-priced property
3. Explore gift funds from family members
4. Consider traditional loans (FHA/Conventional) if you have employment history

Schedule a consultation to discuss all your options!"""
            
            return {
                "qualified": qualified,
                "message": message,
                "recommendations": recommendations,
                "calculations": {
                    "monthlyIncome": 0,  # Not applicable for Non-QM
                    "totalHousingPayment": round(total_housing_payment, 2),
                    "monthlyPI": round(monthly_pi, 2),
                    "monthlyPMI": 0,
                    "dti": 0,  # Not calculated for Non-QM
                    "downPaymentPercent": round(down_payment_percent, 1),
                    "loanAmount": round(loan_amount, 2)
                }
            }
        
        # Regular qualification logic for other loan types
        # Calculate monthly income using AI-powered analysis
        # Take average of 2-year W2 and project YTD to annual
        import datetime
        current_month = datetime.datetime.now().month
        projected_2025_annual = (req.incomeYTD2025 / current_month) * 12 if current_month > 0 else req.incomeYTD2025
        
        # Average annual income
        avg_annual_income = (req.income2023 + req.income2024 + projected_2025_annual) / 3
        monthly_income = avg_annual_income / 12
        
        # Calculate mortgage payment
        loan_amount = req.purchasePrice - req.downPayment
        down_payment_percent = (req.downPayment / req.purchasePrice) * 100
        
        # Assume 6.5% interest rate for calculation (30-year fixed)
        interest_rate = 6.5
        monthly_rate = interest_rate / 100 / 12
        num_payments = 30 * 12
        
        # Calculate P&I
        if monthly_rate == 0:
            monthly_pi = loan_amount / num_payments
        else:
            monthly_pi = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
        
        # Calculate PMI if needed
        monthly_pmi = 0
        if down_payment_percent < 20 and req.loanType not in ['va', 'nonqm']:
            monthly_pmi = loan_amount * 0.005 / 12  # 0.5% annual PMI
        
        # Total housing payment
        total_housing_payment = monthly_pi + req.propertyTax + req.homeInsurance + monthly_pmi
        
        # Calculate DTI
        total_monthly_payments = total_housing_payment + req.monthlyDebts
        dti = (total_monthly_payments / monthly_income) * 100
        
        # Loan-specific DTI limits
        dti_limits = {
            'fha': 53,
            'conventional': 45,
            'firsttimebuyer': 45,  # Will provide recommendations
            'va': 41,
            'nonqm': 50,
            'refinancing': 45
        }
        
        # Credit score requirements
        credit_requirements = {
            'fha': 580,
            'conventional': 620,
            'firsttimebuyer': 580,  # Will provide recommendations
            'va': 620,
            'nonqm': 660,
            'refinancing': 620
        }
        
        max_dti = dti_limits.get(req.loanType, 45)
        min_credit = credit_requirements.get(req.loanType, 620)
        
        # Special handling for First-Time Buyer - provide loan recommendations
        if req.loanType == 'firsttimebuyer':
            qualified = False
            
            # Determine best loan type based on profile
            can_do_conventional = req.creditScore >= 620 and dti <= 45 and req.hasEmploymentHistory
            can_do_fha = req.creditScore >= 580 and dti <= 53 and req.hasEmploymentHistory
            can_do_nonqm = req.creditScore >= 660 and down_payment_percent >= 20
            
            if not req.hasEmploymentHistory:
                if can_do_nonqm:
                    message = "As a first-time buyer without 2 years employment history, Non-QM is your best option!"
                    recommendations = f"""Your Profile Analysis:
• Credit Score: {req.creditScore}
• Down Payment: {down_payment_percent:.1f}%
• DTI: {dti:.1f}%
• Employment History: Less than 2 years

Recommended Loan: Non-QM
✓ No traditional employment verification needed
✓ Use bank statements or alternative documentation
✓ Great for self-employed or recent job changes

Next Steps:
1. Prepare 12-24 months of bank statements
2. Schedule consultation to discuss your income documentation
3. Get pre-approved with a Non-QM program"""
                else:
                    message = "Let's work on building your qualification profile for first-time homeownership!"
                    recommendations = f"""Your Current Profile:
• Credit Score: {req.creditScore}
• Down Payment: {down_payment_percent:.1f}%
• DTI: {dti:.1f}%
• Employment History: Less than 2 years

Recommendations:
1. Build 2 years employment history for FHA/Conventional loans
2. Improve credit to 660+ and save 20% down for Non-QM
3. Consider a co-borrower to strengthen your application

Let's schedule a consultation to create your path to homeownership!"""
            elif can_do_conventional:
                message = f"Great news! You qualify for a Conventional loan as a first-time buyer!"
                recommendations = f"""Your Profile:
• Credit Score: {req.creditScore} ✓
• DTI: {dti:.1f}% ✓
• Employment History: 2+ years ✓

Recommended Loan: Conventional
✓ Competitive interest rates
✓ PMI can be removed at 20% equity
✓ 3-5% down payment options
✓ First-time buyer programs available

Next Steps:
1. Get pre-approved for a Conventional loan
2. Explore first-time buyer assistance programs
3. Gather documentation: W2s, pay stubs, bank statements"""
            elif can_do_fha:
                message = f"Perfect! You qualify for an FHA loan as a first-time buyer!"
                recommendations = f"""Your Profile:
• Credit Score: {req.creditScore} ✓
• DTI: {dti:.1f}% ✓
• Employment History: 2+ years ✓

Recommended Loan: FHA
✓ Only 3.5% down payment required
✓ Flexible credit requirements
✓ Gift funds allowed for down payment
✓ Higher DTI limits (up to 53%)

Next Steps:
1. Get pre-approved for an FHA loan
2. Consider FHA first-time buyer advantages
3. Gather documentation: W2s, pay stubs, bank statements"""
            elif can_do_nonqm and dti > 53:
                message = f"Your DTI is high for traditional loans, but Non-QM is an option!"
                recommendations = f"""Your Profile:
• Credit Score: {req.creditScore} ✓
• Down Payment: {down_payment_percent:.1f}% ✓
• DTI: {dti:.1f}% (Above traditional limits)

Recommended Loan: Non-QM
✓ Accommodates higher DTI ratios
✓ Strong credit and down payment compensate
✓ Alternative income verification

Next Steps:
1. Schedule consultation to discuss Non-QM options
2. Prepare bank statements for income verification
3. We'll help you get pre-approved"""
            else:
                message = f"Let's work together to get you qualified for your first home!"
                recommendations = f"""Your Current Profile:
• Credit Score: {req.creditScore}
• DTI: {dti:.1f}%
• Down Payment: {down_payment_percent:.1f}%

Path to Qualification:
"""
                if req.creditScore < 580:
                    recommendations += "1. Improve credit to 580+ for FHA or 620+ for Conventional\n"
                if dti > 53:
                    recommendations += f"2. Reduce DTI by paying down debts or increasing income\n"
                if down_payment_percent < 3.5:
                    recommendations += "3. Save for at least 3.5% down payment\n"
                    
                recommendations += "\nSchedule a consultation to create your personalized action plan!"
        
        # Qualification logic
        qualified = False
        message = ""
        recommendations = ""
        
        # Check employment history
        if not req.hasEmploymentHistory:
            # Suggest Non-QM if criteria met
            if req.creditScore >= 660 and down_payment_percent >= 20:
                qualified = False
                message = f"While you don't have 2 years of employment history, you may qualify for a Non-QM loan!"
                recommendations = f"""Based on your profile:
• Credit Score: {req.creditScore} (Good for Non-QM ✓)
• Down Payment: {down_payment_percent:.1f}% (Meets 20% requirement ✓)
• DTI: {dti:.1f}%

Non-QM loans don't require traditional employment verification. You can qualify using:
- Bank statements (12-24 months)
- Asset depletion
- 1099 income verification

Next Steps:
1. Prepare 12-24 months of bank statements
2. Schedule a consultation to discuss your income documentation options
3. We'll help you get pre-approved with a Non-QM program"""
            else:
                qualified = False
                message = "Additional documentation may be needed for qualification."
                recommendations = f"""Your Current Profile:
• Credit Score: {req.creditScore}
• Down Payment: {down_payment_percent:.1f}%
• DTI: {dti:.1f}%
• Employment History: Less than 2 years

Recommendations:
1. Build employment history to 2 years for traditional loans
2. If you have 660+ credit and can put 20% down, consider Non-QM loans
3. Work on improving credit score if below 660
4. Schedule a consultation to explore all available options"""
        
        # Standard qualification checks
        elif req.creditScore >= min_credit and dti <= max_dti:
            qualified = True
            message = f"Congratulations! You appear to qualify for a {req.loanType.upper().replace('_', ' ')} loan!"
            
            # Use LLM for personalized recommendations
            llm_prompt = f"""You are a mortgage expert. Provide brief, actionable advice for this borrower:

Loan Type: {req.loanType.upper()}
Credit Score: {req.creditScore}
DTI: {dti:.1f}%
Down Payment: {down_payment_percent:.1f}%
Monthly Income: ${monthly_income:,.0f}
Monthly Housing Payment: ${total_housing_payment:,.0f}

Provide 3-4 bullet points of advice to strengthen their application or next steps. Keep it concise and actionable."""

            try:
                llm = LlmChat(api_key=EMERGENT_LLM_KEY)
                llm_response = llm.send_message(UserMessage(content=llm_prompt))
                recommendations = llm_response.content
            except Exception as e:
                logger.error(f"LLM recommendation error: {str(e)}")
                recommendations = f"""Next Steps:
• Your DTI of {dti:.1f}% is within acceptable limits for {req.loanType} loans
• Get pre-approved to lock in your qualification
• Gather documentation: pay stubs, W2s, bank statements
• Schedule a consultation to discuss your specific situation"""
        
        # DTI too high - suggest alternatives
        elif dti > max_dti:
            qualified = False
            if req.creditScore >= 660 and down_payment_percent >= 20:
                message = f"Your DTI of {dti:.1f}% is above limits for {req.loanType} loans, but you may qualify for Non-QM!"
                recommendations = f"""Your Profile:
• Credit Score: {req.creditScore} ✓
• Down Payment: {down_payment_percent:.1f}% ✓
• DTI: {dti:.1f}% (Above limits for traditional loans)

Non-QM Solution:
Non-QM loans can accommodate higher DTI ratios with:
- Strong credit (660+)
- Significant down payment (20%+)
- Alternative income verification

Next Steps:
1. Schedule consultation to discuss Non-QM options
2. We can review your complete financial picture
3. Explore ways to reduce DTI if targeting traditional loans"""
            else:
                message = f"Your DTI of {dti:.1f}% is above limits for this type of loan. Let's work on lowering it!"
                recommendations = f"""Strategies to Lower Your DTI:
1. Pay down high-interest debts (credit cards, personal loans)
2. Increase your down payment to reduce loan amount and monthly payment
3. Consider a co-borrower to increase household income
4. Look at homes in a lower price range

Your Current DTI: {dti:.1f}%
Monthly Payment Reduction Needed: ~${(total_monthly_payments - (monthly_income * max_dti / 100)):,.0f}

Schedule a consultation to create a personalized action plan!"""
        
        # Credit score too low
        else:
            qualified = False
            message = f"Your credit score of {req.creditScore} is below minimum requirements for {req.loanType} loans."
            recommendations = f"""Credit Improvement Plan:
1. Review credit report for errors and dispute inaccuracies
2. Pay all bills on time (biggest factor in credit score)
3. Pay down credit card balances below 30% utilization
4. Avoid opening new credit accounts
5. Consider becoming an authorized user on a family member's account

Current Score: {req.creditScore}
Target Score: {min_credit}+

Timeframe: Most people can improve 50-100 points in 6-12 months with consistent effort.

Alternative: If you have 20% down and 660+ credit, Non-QM loans may be an option.

Schedule a consultation to create your credit improvement strategy!"""
        
        return {
            "qualified": qualified,
            "message": message,
            "recommendations": recommendations,
            "calculations": {
                "monthlyIncome": round(monthly_income, 2),
                "totalHousingPayment": round(total_housing_payment, 2),
                "monthlyPI": round(monthly_pi, 2),
                "monthlyPMI": round(monthly_pmi, 2),
                "dti": round(dti, 1),
                "downPaymentPercent": round(down_payment_percent, 1),
                "loanAmount": round(loan_amount, 2)
            }
        }
        
    except Exception as e:
        logger.error(f"Qualification analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


# ==================== ANALYTICS ROUTES ====================
@api_router.get("/analytics/dashboard")
async def get_dashboard_analytics():
    try:
        # Lead statistics
        total_leads = await db.leads.count_documents({})
        new_leads = await db.leads.count_documents({"status": LeadStatus.NEW})
        qualified_leads = await db.leads.count_documents({"status": LeadStatus.QUALIFIED})
        
        # Pipeline statistics
        total_pipeline = await db.pipeline.count_documents({})
        pipeline_value = await db.pipeline.aggregate([
            {"$group": {"_id": None, "total": {"$sum": "$loan_amount"}}}
        ]).to_list(1)
        total_pipeline_value = pipeline_value[0]['total'] if pipeline_value else 0
        
        # Lead sources
        lead_sources = await db.leads.aggregate([
            {"$group": {"_id": "$source", "count": {"$sum": 1}}}
        ]).to_list(100)
        
        # Pipeline by stage
        pipeline_by_stage = await db.pipeline.aggregate([
            {"$group": {"_id": "$stage", "count": {"$sum": 1}, "value": {"$sum": "$loan_amount"}}}
        ]).to_list(100)
        
        # Follow-ups pending
        pending_follow_ups = await db.follow_ups.count_documents({
            "completed": False,
            "scheduled_date": {"$lte": datetime.now(timezone.utc).isoformat()}
        })
        
        # Partner statistics
        total_partners = await db.partners.count_documents({"active": True})
        
        return {
            "leads": {
                "total": total_leads,
                "new": new_leads,
                "qualified": qualified_leads,
                "by_source": lead_sources
            },
            "pipeline": {
                "total_deals": total_pipeline,
                "total_value": round(total_pipeline_value, 2),
                "by_stage": pipeline_by_stage
            },
            "follow_ups": {
                "pending": pending_follow_ups
            },
            "partners": {
                "active": total_partners
            }
        }
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")


# ==================== EMAIL CAMPAIGN ROUTES ====================
@api_router.post("/campaigns", response_model=EmailCampaign)
async def create_campaign(campaign: EmailCampaignCreate, current_user: User = Depends(get_current_user)):
    """Create a new email campaign"""
    try:
        campaign_doc = EmailCampaign(
            name=campaign.name,
            subject=campaign.subject,
            body=campaign.body,
            created_by=current_user.email
        )
        doc = campaign_doc.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.email_campaigns.insert_one(doc)
        return campaign_doc
    except Exception as e:
        logger.error(f"Campaign creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Campaign creation error: {str(e)}")


@api_router.get("/campaigns", response_model=List[EmailCampaign])
async def get_campaigns(current_user: User = Depends(get_current_user)):
    """Get all email campaigns"""
    try:
        campaigns = await db.email_campaigns.find(
            {"created_by": current_user.email},
            {"_id": 0}
        ).sort("created_at", -1).to_list(100)
        
        for campaign in campaigns:
            if isinstance(campaign.get('created_at'), str):
                campaign['created_at'] = datetime.fromisoformat(campaign['created_at'])
        
        return campaigns
    except Exception as e:
        logger.error(f"Get campaigns error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Get campaigns error: {str(e)}")


@api_router.post("/campaigns/{campaign_id}/send")
async def send_campaign(campaign_id: str, request: SendCampaignRequest, current_user: User = Depends(get_current_user)):
    """Send personalized emails to multiple recipients"""
    try:
        # Get campaign
        campaign = await db.email_campaigns.find_one({"id": campaign_id})
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        sent_count = 0
        errors = []
        
        # Send emails to each recipient (personalized)
        for recipient in request.recipients:
            try:
                # Personalize subject and body
                personalized_subject = campaign['subject'].replace('{first_name}', recipient.first_name).replace('{last_name}', recipient.last_name)
                personalized_body = campaign['body'].replace('{first_name}', recipient.first_name).replace('{last_name}', recipient.last_name)
                
                # Add chatbot button to email
                email_html = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .button {{ display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px; }}
                        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <p>{personalized_body.replace(chr(10), '<br>')}</p>
                        
                        <a href="{os.environ.get('FRONTEND_URL', os.environ.get('REACT_APP_BACKEND_URL', '').replace('/api', ''))}" class="button">
                            💬 Chat with AI Assistant
                        </a>
                        
                        <div class="footer">
                            <p>Wael Abdeldayem - Licensed Mortgage Broker<br>
                            NMLS #2171794<br>
                            Email: Wael@BarrettFinancial.com</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                # Send email via Resend
                params = {
                    "from": "Wael Abdeldayem <onboarding@resend.dev>",
                    "to": [recipient.email],
                    "subject": personalized_subject,
                    "html": email_html,
                }
                
                email_response = resend.Emails.send(params)
                
                # Track email sent
                await db.campaign_emails.insert_one({
                    "id": str(uuid.uuid4()),
                    "campaign_id": campaign_id,
                    "recipient_email": recipient.email,
                    "recipient_name": f"{recipient.first_name} {recipient.last_name}",
                    "sent_at": datetime.now(timezone.utc).isoformat(),
                    "email_id": email_response.get('id'),
                    "status": "sent"
                })
                
                sent_count += 1
                
            except Exception as email_error:
                logger.error(f"Error sending to {recipient.email}: {str(email_error)}")
                errors.append({
                    "email": recipient.email,
                    "error": str(email_error)
                })
        
        # Update campaign stats
        await db.email_campaigns.update_one(
            {"id": campaign_id},
            {
                "$set": {
                    "status": "sent",
                    "total_recipients": len(request.recipients),
                    "sent_count": sent_count
                }
            }
        )
        
        return {
            "success": True,
            "sent_count": sent_count,
            "total_recipients": len(request.recipients),
            "errors": errors
        }
        
    except Exception as e:
        logger.error(f"Send campaign error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Send campaign error: {str(e)}")


@api_router.get("/campaigns/{campaign_id}/stats")
async def get_campaign_stats(campaign_id: str, current_user: User = Depends(get_current_user)):
    """Get campaign statistics"""
    try:
        campaign = await db.email_campaigns.find_one({"id": campaign_id}, {"_id": 0})
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Get emails sent
        emails_sent = await db.campaign_emails.find({"campaign_id": campaign_id}).to_list(1000)
        
        return {
            "campaign": campaign,
            "emails_sent": len(emails_sent),
            "recipients": emails_sent
        }
    except Exception as e:
        logger.error(f"Get campaign stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Get campaign stats error: {str(e)}")


# ==================== MAIN ROUTES ====================
@api_router.get("/")
async def root():
    return {"message": "Mortgage Business Platform API - Ready to scale to $4M/month!"}


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
