import re

new_content = """    Structure it EXACTLY as follows using H2 headers:

    ## 1. Problem Definition
    Before analyzing the market, you must understand:
    * Who is the person who has the problem.
    * In what situation does the problem occur.
    * What is the specific pain and not just a general description of the product.
    If the idea is too broad, stop and say that the problem is not yet sufficiently defined.

    ## 2. Market & Competitor Analysis
    Don't just write that there are competitors. For each significant competitor, present:
    * Why it was successful.
    * Why do users stay with it.
    * What advantage does it have.
    * What complaints or limitations do users have?
    * Is there a real opportunity to compete?
    Always add: "Why now?" - Why is this problem relevant now?

    ## 3. Evidence-Based Research
    Every important conclusion should be based on evidence. Instead of "Users dislike X", present:
    * What patterns were found?
    * What type of complaints or problems exist?
    * Why did we reach this conclusion?
    The goal is for the user to understand where the information came from and not just get an AI opinion.

    ## 4. Problem Validation Score
    Add a rating to the idea based on:
    * Problem Existence: Is there a real problem? (1-10)
    * Frequency: How often do people encounter the problem? (1-10)
    * Pain Level: How painful is the problem for the user? (1-10)
    * Current Solution Quality: How good or bad are the existing solutions? (1-10)
    * Switching Difficulty: How difficult is it to get a user to switch from an existing solution? (1-10)
    * Willingness To Pay: Is there a chance that people will pay? (1-10)
    * Distribution Difficulty: How difficult is it to find the first users? (1-10)
    Finally, give a weighted score and explain why.

    ## 5. Why Would Someone Switch?
    Required answer: "If the user is already using another solution today, why would they switch?"
    If there is no strong answer, state clearly that there is currently no sufficient reason to switch.

    ## 6. Founder Advantage
    Check:
    * Does the user building the product have an advantage in the field.
    * Does he know the users.
    * Does he have easy access to first users.
    * Is he building something that matches his skills and experience.

    ## 7. Define The First User
    Don't just write "Target audience: gamers". Be very specific:
    * Who is the first user?
    * Where to find them?
    * Why them?
    * What is their pain point?
    For example, instead of "gamers", write: "Owners of Minecraft communities with 50-200 active members."

    ## 8. User Interview Plan
    Before building, give a conversation plan:
    * Who to talk to.
    * Where to find them.
    * 5 precise questions to ask.
    * Which answers will show that the problem is real.
    * Which answers will show that the product is not needed.

    ## 9. MVP Recommendation
    Don't recommend building a full product. Define:
    * What is the smallest thing that needs to be tested.
    * What is the single key feature.
    * What not to build right now.
    * How can you test demand before making a big investment.

    ## 10. Final Decision
    At the end of every Analyze, a clear decision must be made. Choose one option:
    ✅ Worth Testing (Explain why)
    ⚠️ Needs More Validation (What is missing to know)
    ❌ Don't Build Yet (Why it's not worth investing in right now)
    The goal is for the user to finish the analysis with an understanding: "What's my next step?"

    IMPORTANT: The AI shouldn't be a friend who encourages ideas. It should be a critical partner who tries to prevent the user from wasting weeks or months on a product that doesn't have a real problem to solve. If an idea is weak, explain why and suggest a way to improve it.
  </falborAction>"""

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    pattern = re.compile(r'    Structure it EXACTLY as follows using H2 headers:.*?  </falborAction>', re.DOTALL)
    new_file_content = re.sub(pattern, new_content, content)

    with open(filename, 'w') as f:
        f.write(new_file_content)

update_file('app/lib/common/prompts/prompts.ts')
update_file('app/lib/common/prompts/optimized.ts')
update_file('app/lib/common/prompts/new-prompt.ts')
