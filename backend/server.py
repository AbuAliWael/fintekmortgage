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


# ==================== MORTGAGE CALCULATOR ROUTES ====================
@api_router.post("/calculator/payment")
async def calculate_mortgage_payment(calc_data: MortgageCalculation):
    try:
        # Calculate monthly payment
        loan_amount = calc_data.loan_amount
        if calc_data.down_payment and calc_data.down_payment > 0:
            loan_amount = (calc_data.property_value or calc_data.loan_amount) - calc_data.down_payment
        
        monthly_rate = calc_data.interest_rate / 100 / 12
        num_payments = calc_data.loan_term_years * 12
        
        # Principal and interest payment
        if monthly_rate == 0:
            monthly_pi = loan_amount / num_payments
        else:
            monthly_pi = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
        
        # Add taxes, insurance, HOA
        monthly_tax = (calc_data.property_tax_annual or 0) / 12
        monthly_insurance = (calc_data.home_insurance_annual or 0) / 12
        monthly_hoa = calc_data.hoa_monthly or 0
        
        total_monthly = monthly_pi + monthly_tax + monthly_insurance + monthly_hoa
        
        # Calculate total interest
        total_paid = monthly_pi * num_payments
        total_interest = total_paid - loan_amount
        
        # Down payment percentage
        down_payment_percent = 0
        if calc_data.down_payment and calc_data.property_value:
            down_payment_percent = (calc_data.down_payment / calc_data.property_value) * 100
        
        return {
            "monthly_payment": round(total_monthly, 2),
            "monthly_principal_interest": round(monthly_pi, 2),
            "monthly_tax": round(monthly_tax, 2),
            "monthly_insurance": round(monthly_insurance, 2),
            "monthly_hoa": round(monthly_hoa, 2),
            "total_loan_amount": round(loan_amount, 2),
            "total_interest": round(total_interest, 2),
            "total_paid": round(total_paid, 2),
            "down_payment": calc_data.down_payment or 0,
            "down_payment_percent": round(down_payment_percent, 2)
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
