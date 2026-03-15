import os
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone

ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_ENV_PATH = ROOT_DIR / "backend" / ".env"

load_dotenv(BACKEND_ENV_PATH)

api_key = os.getenv("PINECONE_API_KEY")
host = os.getenv("PINECONE_HOST")
if not api_key:
    raise SystemExit("PINECONE_API_KEY is not set in backend/.env")
if not host:
    raise SystemExit("PINECONE_HOST is not set in backend/.env")

pc = Pinecone(api_key=api_key)
# Connect by host so we use the same index as the backend (no name lookup).
index = pc.Index(host=host)

# Because your index is integrated with a hosted embedding model, you provide inputs as text 
# and Pinecone converts them to dense vectors automatically.
# Pinecone expects metadata as flat top-level fields (string, number, boolean, or list of strings), not a nested object.
data = [
    {
        "id": "vec1",
        "text": "Contact Information: Isaac Lo. Email: ljzisaac02@gmail.com, LinkedIn: linkedin.com/in/iljz, GitHub: github.com/iljz, Portfolio: iljz.vercel.app.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec2",
        "text": "Education: Georgia Institute of Technology - Main Campus in Atlanta, GA. M.S. in Computer Science - Machine Learning Concentration, expected May 2026. GPA: 4.0/4.0. Relevant Coursework includes Artificial Intelligence, Machine Learning for Trading, Machine Learning, Conversational AI, Deep Reinforcement Learning, Data Visualization & Analytics, and Computational Algorithms.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec3",
        "text": "Education: University of Illinois at Urbana-Champaign in Urbana-Champaign, IL. B.S. in Mechanical Engineering with a Minor in Computer Science, May 2024.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec4",
        "text": "Experience: Graduate Research Assistant at Design Intelligence Lab - Multi Modal Jill Watson Project in Atlanta, GA (Jan 2025 - Present). Designed, built, and deployed an AI Virtual TA to 800+ students across 3 universities, using a multi-modal chat agent to process course documents and deliver grounded, GPT-4-powered answers to enhance online learning. Increased retrieval relevance and answer confidence for 77% of users by designing a dual-vector retrieval strategy with OpenAI embeddings and implementing native hybrid search in Weaviate. Spearheaded the integration of an LTI-compliant front-end web app using TypeScript and designed a PDF viewer feature that enabled easy fact-verification and interactive reading, achieving a 97% user approval rating. Architected a Docker Compose microservice ecosystem on AWS (EC2, S3), securing 4 independently scalable services with custom Security Groups and routing production traffic via a campus subdomain. Engineered a multi-modal benchmarking framework, designing ingestion pipelines and rigorously testing retrieval strategies to evaluate and optimize each step in the system's pipeline.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec5",
        "text": "Experience: Software Engineer Intern at Stryker in San Jose, CA (May 2025 - Aug 2025). Engineered a Java Spring Boot microservice that entirely eliminated ~30s of downtime and failovers during firmware upgrades, resolving a critical reliability issue for hospital communication devices. Re-architected a legacy monolithic updater into an independent service by designing a REST API communication layer, decoupling dependencies, reducing code complexity by 40%, and enabling recovery on partial outages. Designed and developed the end-to-end firmware deployment workflow, from a React-based admin client to low-latency UDP signals, enabling administrators to update 50+ hospital devices with a single click.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec6",
        "text": "Experience: Full-Stack Software Engineer at Aerospace Systems Design Lab - Energy Infrastructure and Data Engineering, Remote (Oct 2024 - May 2025). Developed a Vue.js/Flask dashboard to visualize real-time data from 20+ IoT sensors, enabling researchers to gather insights into energy expenditures at different locations. Architected a secure sensor authentication service and Postgres data pipeline, reducing IoT data retrieval and analysis time from hours to minutes.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec7",
        "text": "Projects: PICO Scholar - AI Lit Reviews (github.com/datagero/pico-scholar). Achieved 2nd Place at the Red Hat & Intel AI Hackathon by building a platform using RAG systems and fine tuned models for accelerated literature reviews in the biomedical research space. Developed a system with LlamaIndex and FastAPI to generate multi-document summaries and create context-aware individual chatbots for 120+ research papers using MongoDB for chat persistence.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec8",
        "text": "Projects: Constrained LLM Post-Training Optimization. Optimized SFT and RL post-training for Qwen3-4B under a strict 1-GPU/24-hour budget, utilizing 4-bit quantization and LoRA to reduce memory footprint by 15% and fit training onto consumer hardware. Led hyperparameter ablation studies across GRPO loss variants, identifying a critical 1e-05 learning rate regime that swung reasoning accuracy by 14.6% on the GSM8K benchmark.",
        "source": "Isaac_Lo_Resume.pdf",
    },
    {
        "id": "vec9",
        "text": "Skills & Interests. Languages: Python, Java, TypeScript/JavaScript, C++, SQL, MATLAB. AI & Data: PyTorch, Weaviate, LlamaIndex, scikit-learn, pandas. Backend & DevOps: Spring Boot, Flask, React, MongoDB, Git, Docker, AWS. Interests (Beyond Tech): Badminton, Boxing, Golden State Warriors, Ranking Food on Beli, Reality TV Cooking.",
        "source": "Isaac_Lo_Resume.pdf",
    },
]

namespace = os.getenv("PINECONE_NAMESPACE") or "__default__"

index.upsert_records(
    namespace=namespace,
    records=data,
)