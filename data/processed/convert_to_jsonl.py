import csv
import json
import re

input_csv = 'All-2479-Answers-retrieved-from-MedQuAD.csv'
output_jsonl = 'medquad_qa.jsonl'

def extract_qa(text):
    """
    Metindeki Question: ... Answer: ... kısımlarını ayırır.
    Eğer yoksa, tahmini şekilde bölmeye çalışır.
    """
    # Pattern ile Question: ... Answer: ... bulmaya çalışalım
    question_match = re.search(r'Question:\s*(.+?)\s*Answer:', text, re.DOTALL)
    answer_match = re.search(r'Answer:\s*(.+)', text, re.DOTALL)

    if question_match and answer_match:
        question = question_match.group(1).strip()
        answer = answer_match.group(1).strip()
    else:
        # Eğer pattern yoksa, en basitinden ilk cümle soru olarak alınabilir (isteğe göre geliştirilebilir)
        question = "Unknown question"
        answer = text.strip()

    return question, answer

with open(input_csv, 'r', encoding='utf-8') as csvfile, open(output_jsonl, 'w', encoding='utf-8') as jsonlfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        answer_id = row.get('AnswerID', '')
        answer_text = row.get('Answer', '')

        question, answer = extract_qa(answer_text)

        json_obj = {
            "id": answer_id,
            "question": question,
            "answer": answer,
            "category": "general",
            "source": "MedQuAD"
        }

        jsonlfile.write(json.dumps(json_obj, ensure_ascii=False) + '\n')

print(f"{output_jsonl} dosyası başarıyla oluşturuldu!")
