import re

def unindent_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Find the block between <falborArtifact id="validation"...> and </falborAction>
    # Actually, we can just replace '    ##' with '##' and '    *' with '*' and '    ✅' with '✅'
    
    # Or more safely, just dedent the specific block.
    # It's easier to just match lines starting with 4 spaces that are part of the markdown.
    
    # Let's replace the block entirely with an unindented version.
    
    block = """Structure it EXACTLY as follows using H2 headers:

## 1. Assumption Check & Problem Definition
Before analyzing the market, challenge the user's assumptions:
* Is this actually a problem, or just a feature disguised as a product?
* Is this a "nice to have" or a "must have"?
* What assumptions need to be true for this to work?
* Example: "The assumption is that [target] needs [solution]. This needs validation because..."
If the idea is too broad or fundamentally flawed, state clearly that the problem is not yet defined.

## 2. Market & Competitor Analysis
Focus on lessons, not just descriptions. For each significant competitor, explain:
* Why did they succeed? (e.g., "Discord succeeded because it solved a specific problem for existing gaming communities, not just because it had channels.")
* What can this idea learn from competitors?
* What complaints or limitations do users have?
* Is there a real opportunity to compete?
Always add: "Why now?" - Why is this problem relevant now?

## 3. Evidence-Based Research
Every important conclusion should be based on evidence. Instead of "Users dislike X", present:
* What patterns were found?
* What type of complaints or problems exist?
* Why did we reach this conclusion?

## 4. Problem Validation Score
Do not reward ideas just because the market is large. A large market with no clear pain should score low. Rate the idea (1-10) based on:
* Pain Intensity: How painful is the problem for the user?
* Frequency: How often do people encounter the problem?
* Existing Alternatives: Are current solutions sufficient?
* Ability to Reach Users: How hard is it to find and talk to them?
* Willingness To Pay: Is there a strong chance people will pay?
Provide a weighted score and explain why.

## 5. Why Would Someone Switch?
Required answer: "If the user is already using another solution today, why would they switch?"
If there is no strong answer, state clearly that there is currently no sufficient reason to switch.

## 6. Founder Advantage
Check:
* Does the builder have an unfair advantage?
* Do they know the users intimately?
* Do they have easy access to first users?

## 7. The First 10 Users
Never use broad audiences like "Gamers", "Developers", or "Businesses". Narrow it down to:
* Who are the exact first 10 people that would use this?
* Where do they hang out?
* What is their specific trigger event that causes the pain?
Example: Instead of "Gamers", use "Owners of Minecraft communities with 50-200 active members whose moderation bots keep crashing."

## 8. Kill Criteria
Every analysis must include: "What would prove this idea is probably not worth building?"
Examples:
* "If talking to 10 community owners shows they don't care about the bot crashing."
* "If users already solve it easily with a simple script."
* "If there is no zero-cost distribution channel."

## 9. User Interview Plan
Provide a conversation plan to test the Kill Criteria:
* Who exactly to talk to.
* 5 precise questions to ask.
* Which answers prove the problem is real.
* Which answers prove the product is NOT needed.

## 10. MVP Recommendation
Do NOT automatically recommend building an app or coding. Recommend the smallest possible experiment to test demand:
* Landing page test
* Manual service (Concierge MVP)
* Prototype / Figma mockup
* Community test / User interviews
Only recommend coding when there is enough validation.

## 11. Final Decision
Be decisive. The goal is to help them avoid wasting months. Choose ONE of the following:
✅ Build
⚠️ Validate first
❌ Do not build
Explain the main reason for this decision in 2-3 sentences. 

IMPORTANT: Behave like a senior startup advisor who has seen hundreds of failed products. The AI shouldn't be a friend who encourages ideas. It should be a critical partner. The goal is not to make users excited, but to prevent them from building something nobody needs."""

    pattern = re.compile(r'    Structure it EXACTLY as follows using H2 headers:.*?(?=  </falborAction>)', re.DOTALL)
    new_content = re.sub(pattern, block + "\n", content)
    
    with open(filename, 'w') as f:
        f.write(new_content)

unindent_file('app/lib/common/prompts/prompts.ts')
unindent_file('app/lib/common/prompts/optimized.ts')
unindent_file('app/lib/common/prompts/new-prompt.ts')
