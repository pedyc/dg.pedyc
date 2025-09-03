---
title: 5 Agent Workflows You Need to Master (And Exactly How to Use Them)
author: ["[[Paolo Perrone]]"]
description: "Master AI Agent workflows to get reliable, high-quality outputs. Learn prompt chaining, routing, orchestration, parallelization, and evaluation loops."
tags: ["clippings"]
date-created: 2025-09-02
date-modified: 2025-09-02
created: 2025-09-02
published: 2025-08-20
source: "https://medium.com/data-science-collective/5-agent-workflows-you-need-to-master-and-exactly-how-to-use-them-1b8726d17d4c"
---

Hey there!

Most people use AI Agent by throwing prompts at them and hoping for the best. That works for quick experiments but fails when you need consistent, production-ready results.

The problem is that ad-hoc prompting doesn't scale. It leads to messy outputs, unpredictable quality, and wasted compute.

A better approach is structured Agent workflows.

The most effective teams don't rely on single prompts. They break tasks into steps, route inputs to the right models, and check outputs carefully until the results are reliable.

In this guide, I'll show you 5 key Agent workflows you need to know. Each comes with step-by-step instructions and code examples, so you can apply them directly. You'll learn what each workflow does, when to use it, and how it produces better results.

Let's dive in!

## Workflows 1: Prompt Chaining

Prompt chaining means using the output of one LLM call as the input to the next. Instead of dumping a complex task into one giant prompt, you break it into smaller steps.

![[Clippings/_resources/5 Agent Workflows You Need to Master (And Exactly How to Use Them)/0dc268368aaa85fdd75a405e8fb6b25d_MD5.webp]]

The idea is simple: smaller steps reduce confusion and errors. A chain guides the model instead of leaving it to guess.

Skipping chaining often leads to long, messy outputs, inconsistent tone, and more mistakes. By chaining, you can review each step before moving on, making the process more reliable.

### Code Example

```c
from typing import List
from helpers import run_llm 

def serial_chain_workflow(input_query: str, prompt_chain : List[str]) -> List[str]:
    """Run a serial chain of LLM calls to address the \`input_query\` 
    using a list of prompts specified in \`prompt_chain\`.
    """
    response_chain = []
    response = input_query
    for i, prompt in enumerate(prompt_chain):
        print(f"Step {i+1}")
        response = run_llm(f"{prompt}\nInput:\n{response}", model='meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo')
        response_chain.append(response)
        print(f"{response}\n")
    return response_chain

# Example
question = "Sally earns $12 an hour for babysitting. Yesterday, she just did 50 minutes of babysitting. How much did she earn?"

prompt_chain = ["""Given the math problem, ONLY extract any relevant numerical information and how it can be used.""",
                """Given the numberical information extracted, ONLY express the steps you would take to solve the problem.""",
                """Given the steps, express the final answer to the problem."""]

responses = serial_chain_workflow(question, prompt_chain)
```

## Workflows 2: Routing

Routing decides where each input goes.

Not every query deserves your largest, slowest, or most expensive model. Routing makes sure simple tasks go to lightweight models, while complex tasks reach heavyweight ones.

![[Clippings/_resources/5 Agent Workflows You Need to Master (And Exactly How to Use Them)/b9c3d78bc2ff3ba7c28c795c0b2cdab5_MD5.webp]]

Without routing, you risk overspending on easy tasks or giving poor results on hard ones.

To use routing:

- Define input categories (simple, complex, restricted).
- Assign each category to the right model or workflow.

The purpose is efficiency. Routing cuts costs, lowers latency, and improves quality because the right tool handles the right job.

### Code Example

```c
from pydantic import BaseModel, Field
from typing import Literal, Dict
from helpers import run_llm, JSON_llm

def router_workflow(input_query: str, routes: Dict[str, str]) -> str:
    """Given a \`input_query\` and a dictionary of \`routes\` containing options and details for each.
    Selects the best model for the task and return the response from the model.
    """
    ROUTER_PROMPT = """Given a user prompt/query: {user_query}, select the best option out of the following routes:
    {routes}. Answer only in JSON format."""

    # Create a schema from the routes dictionary
    class Schema(BaseModel):
        route: Literal[tuple(routes.keys())]

        reason: str = Field(
            description="Short one-liner explanation why this route was selected for the task in the prompt/query."
        )

    # Call LLM to select route
    selected_route = JSON_llm(
        ROUTER_PROMPT.format(user_query=input_query, routes=routes), Schema
    )
    print(
        f"Selected route:{selected_route['route']}\nReason: {selected_route['reason']}\n"
    )

    # Use LLM on selected route.
    # Could also have different prompts that need to be used for each route.
    response = run_llm(user_prompt=input_query, model=selected_route["route"])
    print(f"Response: {response}\n")

    return response

prompt_list = [
    "Produce python snippet to check to see if a number is prime or not.",
    "Plan and provide a short itenary for a 2 week vacation in Europe.",
    "Write a short story about a dragon and a knight.",
]

model_routes = {
    "Qwen/Qwen2.5-Coder-32B-Instruct": "Best model choice for code generation tasks.",
    "Gryphe/MythoMax-L2-13b": "Best model choice for story-telling, role-playing and fantasy tasks.",
    "Qwen/QwQ-32B-Preview": "Best model for reasoning, planning and multi-step tasks",
}

for i, prompt in enumerate(prompt_list):
    print(f"Task {i+1}: {prompt}\n")
    print(20 * "==")
    router_workflow(prompt, model_routes)
```

## Workflows 3: Parallelization

Most people run LLMs one task at a time. If tasks are independent, you can run them in parallel and merge the results, saving time and improving output quality.

Parallelization breaks a large task into smaller, independent parts that run simultaneously. After each part is done, you combine the results.

![[Clippings/_resources/5 Agent Workflows You Need to Master (And Exactly How to Use Them)/87b316cabfe059b8294a566fb3b36592_MD5.webp]]

**Examples**:

- **Code review**: one model checks security, another performance, a third readability, then combine the results for a complete review.
- **Document analysis**: split a long report into sections, summarize each separately, then merge the summaries.
- **Text analysis**: extract sentiment, key entities, and potential bias in parallel, then combine into a final summary.

Skipping parallelization slows things down and can overload a single model, leading to messy or inconsistent outputs. Running tasks in parallel lets each model focus on one aspect, making the final output more accurate and easier to work with.

### Code Example

```c
import asyncio
from typing import List
from helpers import run_llm, run_llm_parallel

async def parallel_workflow(prompt : str, proposer_models : List[str], aggregator_model : str, aggregator_prompt: str):
    """Run a parallel chain of LLM calls to address the \`input_query\` 
    using a list of models specified in \`models\`.

    Returns output from final aggregator model.
    """

    # Gather intermediate responses from proposer models
    proposed_responses = await asyncio.gather(*[run_llm_parallel(prompt, model) for model in proposer_models])
    
    # Aggregate responses using an aggregator model
    final_output = run_llm(user_prompt=prompt,
                           model=aggregator_model,
                           system_prompt=aggregator_prompt + "\n" + "\n".join(f"{i+1}. {str(element)}" for i, element in enumerate(proposed_responses)
           ))
    
    return final_output, proposed_responses

reference_models = [
    "microsoft/WizardLM-2-8x22B",
    "Qwen/Qwen2.5-72B-Instruct-Turbo",
    "google/gemma-2-27b-it",
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
]

user_prompt = """Jenna and her mother picked some apples from their apple farm. 
Jenna picked half as many apples as her mom. If her mom got 20 apples, how many apples did they both pick?"""

aggregator_model = "deepseek-ai/DeepSeek-V3"

aggregator_system_prompt = """You have been provided with a set of responses from various open-source models to the latest user query.
Your task is to synthesize these responses into a single, high-quality response. It is crucial to critically evaluate the information
provided in these responses, recognizing that some of it may be biased or incorrect. Your response should not simply replicate the
given answers but should offer a refined, accurate, and comprehensive reply to the instruction. Ensure your response is well-structured,
coherent, and adheres to the highest standards of accuracy and reliability.

Responses from models:"""

async def main():
    answer, intermediate_reponses = await parallel_workflow(prompt = user_prompt, 
                                                            proposer_models = reference_models, 
                                                            aggregator_model = aggregator_model, 
                                                            aggregator_prompt = aggregator_system_prompt)

    for i, response in enumerate(intermediate_reponses):
        print(f"Intermetidate Response {i+1}:\n\n{response}\n")

    print(f"Final Answer: {answer}\n")
```

## Workflows 4: Orchestrator-workers

This workflow uses an orchestrator model to plan a task and assign specific subtasks to worker models.

The orchestrator decides what needs to be done and in what order, so you don't have to design the workflow manually. Worker models handle their tasks, and the orchestrator combines their outputs into a final result.

![[Clippings/_resources/5 Agent Workflows You Need to Master (And Exactly How to Use Them)/5b39c31a74cea19bf740e4393726e9fe_MD5.webp]]

**Examples**:

- **Writing** **content**: the orchestrator breaks a blog post into headline, outline, and sections. Workers generate each part, and the orchestrator assembles the complete post.
- **Coding**: the orchestrator splits a program into setup, functions, and tests. Workers produce code for each piece, and the orchestrator merges them.
- **Data reports**: the orchestrator identifies summary, metrics, and insights. Workers generate content for each, and the orchestrator consolidates the report.

This workflow reduces manual planning and keeps complex tasks organized. By letting the orchestrator handle task management, you get consistent, organized outputs while each worker focuses on a specific piece of work.

### Code Example

```c
import asyncio
import json
from pydantic import BaseModel, Field
from typing import Literal, List
from helpers import run_llm_parallel, JSON_llm

ORCHESTRATOR_PROMPT = """
Analyze this task and break it down into 2-3 distinct approaches:

Task: {task}

Provide an Analysis:

Explain your understanding of the task and which variations would be valuable.
Focus on how each approach serves different aspects of the task.

Along with the analysis, provide 2-3 approaches to tackle the task, each with a brief description:

Formal style: Write technically and precisely, focusing on detailed specifications
Conversational style: Write in a friendly and engaging way that connects with the reader
Hybrid style: Tell a story that includes technical details, combining emotional elements with specifications

Return only JSON output.
"""

WORKER_PROMPT = """
Generate content based on:
Task: {original_task}
Style: {task_type}
Guidelines: {task_description}

Return only your response:
[Your content here, maintaining the specified style and fully addressing requirements.]
"""

task = """Write a product description for a new eco-friendly water bottle.
The target_audience is environmentally conscious millennials and key product features are: plastic-free, insulated, lifetime warranty
"""

class Task(BaseModel):
    type: Literal["formal", "conversational", "hybrid"]
    description: str

class TaskList(BaseModel):
    analysis: str
    tasks: List[Task]  = Field(..., default_factory=list)

async def orchestrator_workflow(task : str, orchestrator_prompt : str, worker_prompt : str): 
    """Use a orchestrator model to break down a task into sub-tasks and then use worker models to generate and return responses."""

    # Use orchestrator model to break the task up into sub-tasks
    orchestrator_response = JSON_llm(orchestrator_prompt.format(task=task), schema=TaskList)
 
    # Parse orchestrator response
    analysis = orchestrator_response["analysis"]
    tasks= orchestrator_response["tasks"]

    print("\n=== ORCHESTRATOR OUTPUT ===")
    print(f"\nANALYSIS:\n{analysis}")
    print(f"\nTASKS:\n{json.dumps(tasks, indent=2)}")

    worker_model =  ["meta-llama/Llama-3.3-70B-Instruct-Turbo"]*len(tasks)

    # Gather intermediate responses from worker models
    return tasks , await asyncio.gather(*[run_llm_parallel(user_prompt=worker_prompt.format(original_task=task, task_type=task_info['type'], task_description=task_info['description']), model=model) for task_info, model in zip(tasks,worker_model)])

async def main():
    task = """Write a product description for a new eco-friendly water bottle. 
    The target_audience is environmentally conscious millennials and key product features are: plastic-free, insulated, lifetime warranty
    """

    tasks, worker_resp = await orchestrator_workflow(task, orchestrator_prompt=ORCHESTRATOR_PROMPT, worker_prompt=WORKER_PROMPT)

    for task_info, response in zip(tasks, worker_resp):
       print(f"\n=== WORKER RESULT ({task_info['type']}) ===\n{response}\n")

asyncio.run(main())
```

## Workflows 5: Evaluator-Optimizer

This workflow focuses on improving output quality by introducing a feedback loop.

One model generates content, and a separate evaluator model checks it against specific criteria. If the output doesn't meet the standards, the generator revises it and the evaluator checks again. This process continues until the output passes.

![[Clippings/_resources/5 Agent Workflows You Need to Master (And Exactly How to Use Them)/5de08731cd16322802a0eb2fbf78cf14_MD5.webp]]

**Examples**:

- **Code generation**: the generator writes code, the evaluator checks correctness, efficiency, and style, and the generator revises until the code meets requirements.
- **Marketing copy**: the generator drafts copy, the evaluator ensures word count, tone, and clarity are correct, and revisions are applied until approved.
- **Data summaries**: the generator produces a report, the evaluator checks for completeness and accuracy, and the generator updates it as needed.

Without this workflow, outputs can be inconsistent and require manual review. Using the evaluator-optimizer loop ensures results meets standards and reduces repeated manual corrections.

### Code Example

```c
from pydantic import  BaseModel
from typing import Literal
from helpers import run_llm, JSON_llm

task = """
Implement a Stack with:
1. push(x)
2. pop()
3. getMin()
All operations should be O(1).
"""

GENERATOR_PROMPT = """
Your goal is to complete the task based on <user input>. If there are feedback 
from your previous generations, you should reflect on them to improve your solution

Output your answer concisely in the following format: 

Thoughts:
[Your understanding of the task and feedback and how you plan to improve]

Response:
[Your code implementation here]
"""

def generate(task: str, generator_prompt: str, context: str = "") -> tuple[str, str]:
    """Generate and improve a solution based on feedback."""
    full_prompt = f"{generator_prompt}\n{context}\nTask: {task}" if context else f"{generator_prompt}\nTask: {task}"

    response = run_llm(full_prompt, model="Qwen/Qwen2.5-Coder-32B-Instruct")
    
    print("\n## Generation start")
    print(f"Output:\n{response}\n")
    
    return response

EVALUATOR_PROMPT = """
Evaluate this following code implementation for:
1. code correctness
2. time complexity
3. style and best practices

You should be evaluating only and not attempting to solve the task.

Only output "PASS" if all criteria are met and you have no further suggestions for improvements.

Provide detailed feedback if there are areas that need improvement. You should specify what needs improvement and why.

Only output JSON.
"""

def evaluate(task : str, evaluator_prompt : str, generated_content: str, schema) -> tuple[str, str]:
    """Evaluate if a solution meets requirements."""
    full_prompt = f"{evaluator_prompt}\nOriginal task: {task}\nContent to evaluate: {generated_content}"

    #Build a schema for the evaluation
    class Evaluation(BaseModel):
        evaluation: Literal["PASS", "NEEDS_IMPROVEMENT", "FAIL"]
        feedback: str

    response = JSON_llm(full_prompt, Evaluation)
    
    evaluation = response["evaluation"]
    feedback = response["feedback"]

    print("## Evaluation start")
    print(f"Status: {evaluation}")
    print(f"Feedback: {feedback}")

    return evaluation, feedback

def loop_workflow(task: str, evaluator_prompt: str, generator_prompt: str) -> tuple[str, list[dict]]:
    """Keep generating and evaluating until the evaluator passes the last generated response."""
    # Store previous responses from generator
    memory = []
    
    # Generate initial response
    response = generate(task, generator_prompt)
    memory.append(response)

   
    # While the generated response is not passing, keep generating and evaluating
    while True:
        evaluation, feedback = evaluate(task, evaluator_prompt, response)
        # Terminating condition
        if evaluation == "PASS":
            return response
        
        # Add current response and feedback to context and generate a new response
        context = "\n".join([
            "Previous attempts:",
            *[f"- {m}" for m in memory],
            f"\nFeedback: {feedback}"
        ])
        
        response = generate(task, generator_prompt, context)
        memory.append(response)

loop_workflow(task, EVALUATOR_PROMPT, GENERATOR_PROMPT)
```

## Putting It All Together

Structured workflows change the way you work with LLMs.

Instead of tossing prompts at an AI and hoping for the best, you break tasks into steps, route them to the right models, run independent subtasks in parallel, orchestrate complex processes, and refine outputs with evaluator loops.

Each workflow serves a purpose, and combining them lets you handle tasks more efficiently and reliably. You can start small with one workflow, master it, and gradually add others as needed.

By using routing, orchestration, parallelization, and evaluator-optimizer loops together, you move from messy, unpredictable prompting to outputs that are consistent, high-quality, and production-ready. Over time, this approach doesn't just save time: it gives you control, predictability, and confidence in every result your models produce, solving the very problems that ad-hoc prompting creates.

Apply these workflows, and you'll unlock the full potential of your AI, getting consistent, high-quality results with confidence.
