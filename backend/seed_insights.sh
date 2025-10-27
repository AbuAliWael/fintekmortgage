# Initial Daily Mortgage Insights - Seed Data

# Run this to populate initial insights:

curl -X POST http://localhost:8001/api/insights \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding Rising Interest Rates: What It Means for Your Home Purchase",
    "content": "In today'\''s market, understanding how interest rates impact your mortgage is crucial. While rates have increased, it'\''s important to remember that they'\''re still historically reasonable. Focus on what you can control: improving your credit score, saving for a larger down payment, and shopping around for the best rates. Even a 0.5% difference in your rate can save you tens of thousands over the life of your loan. Consider working with a licensed mortgage professional who can help you navigate rate fluctuations and find the best program for your situation.",
    "category": "rates"
  }'

curl -X POST http://localhost:8001/api/insights \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First-Time Homebuyer Advantage: Programs That Make Homeownership Accessible",
    "content": "Many first-time buyers don'\''t realize they have access to special programs designed to make homeownership more affordable. FHA loans require as little as 3.5% down, while some conventional programs accept just 3%. Additionally, many states and local governments offer down payment assistance grants that don'\''t need to be repaid. VA loans provide incredible benefits for eligible veterans with zero down payment required. The key is understanding which program aligns with your financial situation and long-term goals. A knowledgeable loan officer can help you explore all available options.",
    "category": "programs"
  }'

curl -X POST http://localhost:8001/api/insights \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Smart Approach to Refinancing in 2025: Timing and Calculations That Matter",
    "content": "Refinancing isn'\''t just about getting a lower rate—it'\''s about understanding your break-even point and long-term plans. Before refinancing, calculate how long it will take to recoup your closing costs through monthly savings. If you plan to move within a few years, refinancing might not make financial sense. However, if you'\''re staying long-term and can reduce your rate by even 0.75%, the savings can be substantial. Consider your equity position too—if you'\''ve built significant equity, you may eliminate PMI through refinancing. Always run the numbers with a mortgage professional before making this important decision.",
    "category": "refinancing"
  }'

curl -X POST http://localhost:8001/api/insights \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Credit Score Impact: The Difference Between Good and Great Rates",
    "content": "Your credit score is one of the most powerful factors in determining your mortgage rate. The difference between a 680 and 740 credit score can mean thousands of dollars in interest over your loan'\''s lifetime. Before applying for a mortgage, take time to review your credit report for errors, pay down credit card balances below 30% utilization, and avoid opening new credit accounts. Even a small improvement—raising your score from 720 to 740—can unlock better rates and save you money monthly. Remember: your credit score isn'\''t permanent. Strategic financial habits can improve it significantly within months.",
    "category": "tips"
  }'

curl -X POST http://localhost:8001/api/insights \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Navigating Affordability: Strategic Decisions for Today'\''s Housing Market",
    "content": "In a competitive market with elevated prices, strategic thinking is essential. Focus on total monthly costs, not just the home price. Consider properties in emerging neighborhoods where values are appreciating. Evaluate the trade-off between buying now and building equity versus waiting for potential rate decreases. Remember that home values historically appreciate over time, making homeownership a wealth-building tool. If affordability is tight, explore creative solutions: adjustable-rate mortgages with lower initial rates, buying below your maximum budget to leave room for improvements, or considering multi-family properties where rental income offsets your mortgage. Every financial situation is unique—professional guidance ensures you make informed decisions.",
    "category": "affordability"
  }'

echo "All insights created successfully!"
