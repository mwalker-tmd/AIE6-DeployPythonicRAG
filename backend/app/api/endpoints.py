from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
import tempfile, shutil, os
from app.core.aimakerspace.text_utils import PDFLoader, TextFileLoader, CharacterTextSplitter
from app.core.aimakerspace.vectordatabase import VectorDatabase
from app.core.aimakerspace.openai_utils.chatmodel import ChatOpenAI
from app.core.aimakerspace.openai_utils.prompts import SystemRolePrompt, UserRolePrompt

router = APIRouter()
splitter = CharacterTextSplitter()
vector_db = None
llm = ChatOpenAI()

system_prompt = SystemRolePrompt("Use the following context to answer a user's question. If you don't know, say so.")
user_prompt = UserRolePrompt("Context:\n{context}\n\nQuestion:\n{question}")

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    suffix = f".{file.filename.split('.')[-1]}"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        file_path = temp_file.name

    try:
        loader = PDFLoader(file_path) if file.filename.endswith(".pdf") else TextFileLoader(file_path)
        documents = loader.load_documents()
        chunks = splitter.split_texts(documents)

        global vector_db
        vector_db = VectorDatabase()
        await vector_db.abuild_from_list(chunks)

        return JSONResponse({"message": f"{file.filename} processed", "chunks": len(chunks)})
    finally:
        os.unlink(file_path)

@router.post("/query")
async def query(question: str = Form(...)):
    if vector_db is None:
        return JSONResponse(status_code=400, content={"error": "No file uploaded yet."})

    context_list = vector_db.search_by_text(question, k=4)
    context_prompt = "\n".join([ctx[0] for ctx in context_list])
    sys_msg = system_prompt.create_message()
    user_msg = user_prompt.create_message(question=question, context=context_prompt)

    async def response_stream():
        async for chunk in llm.astream([sys_msg, user_msg]):
            yield chunk

    return StreamingResponse(response_stream(), media_type="text/plain")
