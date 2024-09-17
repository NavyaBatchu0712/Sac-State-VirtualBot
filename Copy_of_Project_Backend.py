# Set the OpenAI API key directly in Python code
api_key = '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'

# Use the API key in your OpenAI LLM setup
from langchain.llms import OpenAI

# Initialize the OpenAI LLM with the API key
llm = OpenAI(api_key=api_key)


import os

# Set the OpenAI API key as an environment variable in Python
os.environ['OPENAI_API_KEY'] = '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'

# Access the API key from the environment variable
api_key = os.getenv('OPENAI_API_KEY')

# Verify the key is set
print(api_key)  # Should print the API key

# Use the API key in your OpenAI LLM setup
from langchain.llms import OpenAI

# Initialize the OpenAI LLM with the API key
llm = OpenAI(api_key=api_key)



import os
from langchain.llms import OpenAI

# Load the OpenAI API key from the environment variable
api_key = os.getenv("OPENAI_API_KEY")

# Check if the key is loaded correctly
if not api_key:
    raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")

# Use the API key to initialize the OpenAI LLM
llm = OpenAI(api_key=api_key)


import zipfile
import os

# Define the path to your zip file
zip_file_path = '/content/Sac State Data.zip'




import mimetypes

# Check the file type
mime_type, _ = mimetypes.guess_type(zip_file_path)
print(f"File type: {mime_type}")


import os

# Define the folder path
folder_path = '/Users/navyakrishnabatchu/Desktop/Chatbot/Sac State Data'

# List the files in the folder
pdf_files = os.listdir(folder_path)
print("PDF Files in the folder:", pdf_files)


from langchain.document_loaders import PyMuPDFLoader

# Initialize a list to hold the documents
documents = []

# Process each PDF file
for file_name in pdf_files:
    if file_name.endswith('.pdf'):  # Ensure that the file is a PDF
        pdf_path = os.path.join(folder_path, file_name)  # Create the full path to the PDF
        loader = PyMuPDFLoader(pdf_path)  # Load the PDF
        doc = loader.load()  # Extract content
        documents.extend(doc)  # Add the content to the documents list

# Check the total number of documents (chunks of text)
print(f"Total documents extracted: {len(documents)}")


from langchain.text_splitter import CharacterTextSplitter

# Split the documents into smaller chunks
splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_documents = splitter.split_documents(documents)


from langchain_openai import OpenAIEmbeddings

from langchain.vectorstores import FAISS

# Initialize OpenAI embeddings (use your API key)
embeddings = OpenAIEmbeddings(api_key='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')

# Create FAISS index from the split documents
vectorstore = FAISS.from_documents(split_documents, embeddings)


from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# Initialize the LLM (e.g., GPT-4) with your OpenAI API key
llm = OpenAI(api_key='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')

# Create a retrieval-based QA chain using the FAISS vector store
qa_chain = RetrievalQA.from_chain_type(llm, retriever=vectorstore.as_retriever())

# Chat loop where the user inputs queries and the chatbot responds
def chat_with_bot():
    print("Chatbot is ready! Type 'exit' to stop the chat.")
    while True:
        # Get user input
        user_query = input("You: ")

        # Break the loop if the user types 'exit'
        if user_query.lower() == 'exit':
            print("Goodbye!")
            break

        # Get the response from the chatbot
        bot_response = qa_chain.run(user_query)

        # Print the bot's response
        print(f"Bot: {bot_response}")

# Start the chat
chat_with_bot()

from flask import Flask, request, jsonify
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import faiss  # Assuming FAISS is used for vector store
import pickle  # For loading the vector store
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from flask_cors import CORS  # To handle CORS issues

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes



# Initialize the LLM (e.g., GPT-4) using your OpenAI API key
llm = OpenAI(api_key="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")

# Create a retrieval-based QA chain using the FAISS vector store
qa_chain = RetrievalQA.from_chain_type(llm, retriever=vectorstore.as_retriever())

# Define the chatbot endpoint
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_query = data.get('message')

    if user_query:
        try:
            # Generate response from LangChain
            bot_response = qa_chain.run(user_query)
            return jsonify({'response': bot_response})
        except Exception as e:
            # Return error response
            return jsonify({'response': 'An error occurred processing your request.', 'error': str(e)}), 500
    else:
        return jsonify({'response': 'No query provided.'}), 400

# Start the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

